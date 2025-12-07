/**
 * Participant Context
 *
 * Single Source of Truth for participant data:
 * - Profile persistence (AsyncStorage)
 * - Event queue management (pending/synced states)
 * - Sync engine to batch send to backend
 */
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDeviceId } from "./device";
import { parseQRPayload, ParsedEventInfo } from "./offlineParser";
import {
    syncParticipantEvents,
    fetchParticipantEvents,
    checkServerConnection,
    Event,
} from "./api";

// ============ Types ============

export type ParticipantProfile = {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
};

export type LocalEventStatus = "pending" | "synced" | "error";

export type LocalEvent = {
    id: string; // Client-generated UUID
    eventId: string; // From QR payload
    title: string;
    startTime: string;
    promoterId?: string;
    shareId?: string;
    rawPayload: string;
    status: LocalEventStatus;
    scannedAt: number; // Timestamp ms
    syncedAt?: number;
    errorMessage?: string;
};

type ParticipantContextValue = {
    // State
    profile: ParticipantProfile | null;
    localEvents: LocalEvent[];
    serverEvents: Event[];
    isLoading: boolean;
    isSyncing: boolean;
    isOnline: boolean;

    // Actions
    saveProfile: (profile: ParticipantProfile) => Promise<void>;
    clearProfile: () => Promise<void>;
    addScannedEvent: (payload: string) => boolean;
    syncEvents: () => Promise<void>;
    refreshServerEvents: () => Promise<void>;
};

// ============ Storage Keys ============

const PROFILE_KEY = "participant_profile";
const LOCAL_EVENTS_KEY = "participant_local_events";

// ============ Context ============

const ParticipantContext = createContext<ParticipantContextValue | undefined>(
    undefined
);

// ============ UUID Generator ============

function generateUUID(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// ============ Provider ============

type ParticipantProviderProps = {
    children: React.ReactNode;
};

export function ParticipantProvider({ children }: ParticipantProviderProps) {
    const [profile, setProfile] = useState<ParticipantProfile | null>(null);
    const [localEvents, setLocalEvents] = useState<LocalEvent[]>([]);
    const [serverEvents, setServerEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    // Hydrate from storage on mount
    useEffect(() => {
        async function hydrate() {
            try {
                const [profileJson, eventsJson] = await Promise.all([
                    AsyncStorage.getItem(PROFILE_KEY),
                    AsyncStorage.getItem(LOCAL_EVENTS_KEY),
                ]);

                if (profileJson) {
                    setProfile(JSON.parse(profileJson));
                }

                if (eventsJson) {
                    setLocalEvents(JSON.parse(eventsJson));
                }

                // Check server connection
                const online = await checkServerConnection();
                setIsOnline(online);
            } catch (error) {
                console.warn("Failed to hydrate participant state:", error);
            } finally {
                setIsLoading(false);
            }
        }

        hydrate();
    }, []);

    // Persist local events whenever they change
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(localEvents)).catch(
                (error) => console.warn("Failed to persist local events:", error)
            );
        }
    }, [localEvents, isLoading]);

    // Save profile
    const saveProfile = useCallback(
        async (newProfile: ParticipantProfile): Promise<void> => {
            setProfile(newProfile);
            await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
        },
        []
    );

    // Clear profile
    const clearProfile = useCallback(async (): Promise<void> => {
        setProfile(null);
        setLocalEvents([]);
        setServerEvents([]);
        await Promise.all([
            AsyncStorage.removeItem(PROFILE_KEY),
            AsyncStorage.removeItem(LOCAL_EVENTS_KEY),
        ]);
    }, []);

    // Add scanned event to queue
    const addScannedEvent = useCallback(
        (payload: string): boolean => {
            const parsed = parseQRPayload(payload);
            if (!parsed) {
                return false;
            }

            // Check for duplicate (same eventId already in queue)
            const isDuplicate = localEvents.some(
                (e) => e.eventId === parsed.eventId && e.status !== "error"
            );
            if (isDuplicate) {
                // Already have this event, consider it a success
                return true;
            }

            const newEvent: LocalEvent = {
                id: generateUUID(),
                eventId: parsed.eventId,
                title: parsed.title,
                startTime: parsed.startTime,
                promoterId: parsed.promoterId,
                shareId: parsed.shareId,
                rawPayload: parsed.raw,
                status: "pending",
                scannedAt: Date.now(),
            };

            setLocalEvents((prev) => [...prev, newEvent]);
            return true;
        },
        [localEvents]
    );

    // Sync pending events to server
    const syncEvents = useCallback(async (): Promise<void> => {
        const pendingEvents = localEvents.filter((e) => e.status === "pending");
        if (pendingEvents.length === 0) {
            return;
        }

        setIsSyncing(true);

        try {
            const deviceId = await getDeviceId();

            // Build sync entries
            const entries = pendingEvents.map((event) => ({
                yaml: event.rawPayload,
                local_status: "scanned" as const,
                scanned_at: event.scannedAt,
            }));

            const response = await syncParticipantEvents(deviceId, entries);

            // Update local events based on sync results
            setLocalEvents((prev) => {
                const updated = [...prev];

                for (const result of response.entries) {
                    const pendingEvent = pendingEvents[result.entry_index];
                    if (!pendingEvent) continue;

                    const eventIndex = updated.findIndex(
                        (e) => e.id === pendingEvent.id
                    );
                    if (eventIndex === -1) continue;

                    if (result.success) {
                        updated[eventIndex] = {
                            ...updated[eventIndex],
                            status: "synced",
                            syncedAt: Date.now(),
                            errorMessage: undefined,
                        };
                    } else {
                        updated[eventIndex] = {
                            ...updated[eventIndex],
                            status: "error",
                            errorMessage: result.error || "Sync failed",
                        };
                    }
                }

                return updated;
            });

            // Update server events with canonical data
            if (response.events && response.events.length > 0) {
                setServerEvents((prev) => {
                    const merged = [...prev];
                    for (const event of response.events) {
                        const existingIndex = merged.findIndex((e) => e.id === event.id);
                        if (existingIndex >= 0) {
                            merged[existingIndex] = event;
                        } else {
                            merged.push(event);
                        }
                    }
                    return merged;
                });
            }

            setIsOnline(true);
        } catch (error) {
            console.warn("Sync failed:", error);
            setIsOnline(false);
        } finally {
            setIsSyncing(false);
        }
    }, [localEvents]);

    // Refresh server events
    const refreshServerEvents = useCallback(async (): Promise<void> => {
        try {
            const deviceId = await getDeviceId();
            const events = await fetchParticipantEvents(deviceId);
            setServerEvents(events);
            setIsOnline(true);

            // Mark local events as synced if they appear in server events
            setLocalEvents((prev) => {
                return prev.map((localEvent) => {
                    const serverEvent = events.find((e) => e.id === localEvent.eventId);
                    if (serverEvent && localEvent.status === "pending") {
                        return {
                            ...localEvent,
                            status: "synced" as const,
                            syncedAt: Date.now(),
                        };
                    }
                    return localEvent;
                });
            });
        } catch (error) {
            console.warn("Failed to refresh server events:", error);
            setIsOnline(false);
        }
    }, []);

    // Auto-sync on mount if online and has pending events
    useEffect(() => {
        if (!isLoading && isOnline) {
            const hasPending = localEvents.some((e) => e.status === "pending");
            if (hasPending) {
                syncEvents();
            } else {
                refreshServerEvents();
            }
        }
    }, [isLoading]); // Only run once after hydration

    const value = useMemo<ParticipantContextValue>(
        () => ({
            profile,
            localEvents,
            serverEvents,
            isLoading,
            isSyncing,
            isOnline,
            saveProfile,
            clearProfile,
            addScannedEvent,
            syncEvents,
            refreshServerEvents,
        }),
        [
            profile,
            localEvents,
            serverEvents,
            isLoading,
            isSyncing,
            isOnline,
            saveProfile,
            clearProfile,
            addScannedEvent,
            syncEvents,
            refreshServerEvents,
        ]
    );

    return (
        <ParticipantContext.Provider value={value}>
            {children}
        </ParticipantContext.Provider>
    );
}

// ============ Hook ============

export function useParticipant(): ParticipantContextValue {
    const context = useContext(ParticipantContext);
    if (context === undefined) {
        throw new Error("useParticipant must be used within a ParticipantProvider");
    }
    return context;
}
