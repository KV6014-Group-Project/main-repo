// Frontend-only event store using static JSON + local assignments

import { eventsData, type EventData } from '../data/eventData';

type EventCore = {
  id: string; // stable id
  name: string;
  date: string;
  time: string;
  location: { venue: string; room?: string };
  description: string;
};

export type OrganiserEvent = EventData & {
  createdAt: number;
};

export type PromoterAssignment = {
  eventId: string;
  assignedAt: number;
  promoterId: string; // local id for promoter profile
};

const KEYS = {
  promoterAssignments: 'store.promoter.assignments.v1',
};

let AsyncStorage: {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
} | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (_err) {
  AsyncStorage = null;
}

function isWeb(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (globalThis as any).document !== 'undefined';
}

async function storageGet(key: string): Promise<string | null> {
  if (AsyncStorage) return AsyncStorage.getItem(key);
  if (isWeb() && 'localStorage' in globalThis) {
    try {
      return globalThis.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return null;
}

async function storageSet(key: string, value: string): Promise<void> {
  if (AsyncStorage) return AsyncStorage.setItem(key, value);
  if (isWeb() && 'localStorage' in globalThis) {
    try {
      globalThis.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }
}

function uuid(): string {
  // lightweight UUID v4-ish
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function listOrganiserEvents(): Promise<OrganiserEvent[]> {
  // Load from static JSON - add createdAt if missing for compatibility
  return eventsData.map(e => ({
    ...e,
    createdAt: e.createdAt || Date.now(), // default if not set
  })) as OrganiserEvent[];
}

export async function createOrganiserEvent(e: Omit<EventCore, 'id'> & { id?: string }): Promise<OrganiserEvent> {
  const next: OrganiserEvent = {
    id: e.id || uuid(),
    name: e.name,
    date: e.date,
    time: e.time,
    location: e.location,
    description: e.description,
    attendees: { registered: 0 }, // default
    sharing: { promoterLinks: [], participantLinks: [] }, // default
    createdAt: Date.now(),
  };
  // No persistence - log for manual addition to events.json
  console.log('Add this event to frontend/data/events.json:');
  console.log(JSON.stringify(next, null, 2));
  return next;
}

export async function getEventById(eventId: string): Promise<OrganiserEvent | undefined> {
  const all = await listOrganiserEvents();
  return all.find((e) => e.id === eventId);
}

export async function listPromoterAssignments(): Promise<PromoterAssignment[]> {
  const raw = await storageGet(KEYS.promoterAssignments);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as PromoterAssignment[];
  } catch {
    return [];
  }
}

export async function addPromoterAssignment(eventId: string, promoterId: string): Promise<PromoterAssignment> {
  const assignment: PromoterAssignment = { eventId, promoterId, assignedAt: Date.now() };
  const all = await listPromoterAssignments();
  const merged = [assignment, ...all.filter((a) => !(a.eventId === eventId && a.promoterId === promoterId))];
  await storageSet(KEYS.promoterAssignments, JSON.stringify(merged));
  return assignment;
}

export async function listEventsForPromoter(promoterId: string): Promise<OrganiserEvent[]> {
  const [assignments, organiserEvents] = await Promise.all([
    listPromoterAssignments(),
    listOrganiserEvents(),
  ]);
  const allowedIds = new Set(assignments.filter(a => a.promoterId === promoterId).map(a => a.eventId));
  return organiserEvents.filter(e => allowedIds.has(e.id));
}


