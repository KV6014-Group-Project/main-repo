import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useParticipant, LocalEvent } from '../../lib/ParticipantContext';
import { formatEventTime } from '../../lib/offlineParser';
import { Event } from '../../lib/api';

export default function ParticipantHome() {
  const router = useRouter();
  const {
    profile,
    localEvents,
    serverEvents,
    isLoading,
    isSyncing,
    isOnline,
    syncEvents,
    refreshServerEvents,
    clearProfile,
  } = useParticipant();

  // Merge local and server events for display
  const displayEvents = getMergedEvents(localEvents, serverEvents);
  const pendingCount = localEvents.filter(e => e.status === 'pending').length;

  // Refresh server events periodically
  useEffect(() => {
    if (isOnline && !isLoading) {
      refreshServerEvents();
    }
  }, [isOnline, isLoading]);

  const handleSync = async () => {
    await syncEvents();
  };

  const handleDeleteDeviceData = () => {
    const confirmed = Platform.OS === 'web'
      ? window.confirm('Delete device data?\n\nThis will remove your participant details and local event history from this device. You will need to re-enter your details next time.')
      : null;

    // For web, use confirm
    if (Platform.OS === 'web') {
      if (confirmed) {
        performDelete();
      }
    } else {
      // For mobile, use Alert
      Alert.alert(
        'Delete device data?',
        'This will remove your participant details and local event history from this device. You will need to re-enter your details next time.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ],
      );
    }
  };

  const performDelete = async () => {
    await clearProfile();
    router.replace('/welcome');
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#28B900" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <Text className="text-3xl font-bold text-center mt-5 mb-2">Participant Profile</Text>
        <Text className="text-sm text-gray-500 text-center mb-8">Your event participation details</Text>

        {/* Connection Status */}
        <View className="flex-row items-center justify-center mb-4">
          <View className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          <Text className="text-sm text-gray-500">{isOnline ? 'Online' : 'Offline'}</Text>
        </View>

        {/* Profile Info */}
        <View className="bg-neutral-100 rounded-xl p-5 mb-5">
          <Text className="text-lg font-semibold mb-4">Your Info</Text>
          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-1">Name</Text>
            <Text className="text-base">
              {profile ? `${profile.firstName} ${profile.lastName}` : 'Not registered'}
            </Text>
          </View>
          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-1">Email</Text>
            <Text className="text-base">{profile?.email || 'Not provided'}</Text>
          </View>
          {profile?.phone && (
            <View>
              <Text className="text-xs text-gray-500 mb-1">Phone</Text>
              <Text className="text-base">{profile.phone}</Text>
            </View>
          )}
        </View>

        {/* Sync Button (when there are pending events) */}
        {pendingCount > 0 && (
          <TouchableOpacity
            className={`p-4 rounded-xl items-center mb-5 ${isSyncing ? 'bg-gray-400' : 'bg-blue-500'}`}
            onPress={handleSync}
            disabled={isSyncing}
          >
            <Text className="text-white text-base font-semibold">
              {isSyncing ? 'Syncing...' : `Sync ${pendingCount} Pending Event${pendingCount > 1 ? 's' : ''}`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Events List */}
        <View className="bg-neutral-100 rounded-xl p-5 mb-5">
          <Text className="text-lg font-semibold mb-4">Your Events</Text>

          {displayEvents.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">
              No events yet. Scan a QR code to add an event!
            </Text>
          ) : (
            displayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </View>

        {/* Add Event Button */}
        <TouchableOpacity
          className="bg-neutral-200 p-4 rounded-xl items-center mt-5"
          onPress={() => router.push('/participant/qr-code-page')}
        >
          <Text className="text-gray-700 text-base font-semibold">Add Event with QR</Text>
        </TouchableOpacity>

        {/* Delete Device Data Button */}
        <TouchableOpacity
          className="bg-neutral-200 p-4 rounded-xl items-center mt-5"
          onPress={handleDeleteDeviceData}
        >
          <Text className="text-gray-700 text-base font-semibold">Delete Device Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ Helper Types & Functions ============

type DisplayEvent = {
  id: string;
  title: string;
  startTime: string;
  status: 'pending' | 'synced' | 'error';
  errorMessage?: string;
  location?: string;
};

function getMergedEvents(localEvents: LocalEvent[], serverEvents: Event[]): DisplayEvent[] {
  const eventMap = new Map<string, DisplayEvent>();

  // Ensure serverEvents is an array
  const events = Array.isArray(serverEvents) ? serverEvents : [];

  // Add server events (canonical, confirmed)
  for (const event of events) {
    eventMap.set(event.id, {
      id: event.id,
      title: event.title,
      startTime: event.start_datetime,
      status: 'synced',
      location: event.location?.name,
    });
  }

  // Add/overlay local events (may be pending or have errors)
  for (const event of localEvents) {
    const existing = eventMap.get(event.eventId);
    if (existing) {
      // Server event exists, keep it but note if there's an error
      if (event.status === 'error') {
        existing.status = 'error';
        existing.errorMessage = event.errorMessage;
      }
    } else {
      // Only in local queue
      eventMap.set(event.id, {
        id: event.id,
        title: event.title,
        startTime: event.startTime,
        status: event.status,
        errorMessage: event.errorMessage,
      });
    }
  }

  // Sort by start time (upcoming first)
  return Array.from(eventMap.values()).sort((a, b) => {
    const dateA = new Date(a.startTime).getTime() || 0;
    const dateB = new Date(b.startTime).getTime() || 0;
    return dateA - dateB;
  });
}

// ============ Event Card Component ============

function EventCard({ event }: { event: DisplayEvent }) {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '⏳ Pending' },
    synced: { bg: 'bg-green-100', text: 'text-green-700', label: '✓ Registered' },
    error: { bg: 'bg-red-100', text: 'text-red-700', label: '⚠ Error' },
  };

  const config = statusConfig[event.status];

  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-base font-semibold flex-1 mr-3">{event.title}</Text>
        <View className={`${config.bg} rounded-md px-2 py-1`}>
          <Text className={`${config.text} text-xs font-bold`}>{config.label}</Text>
        </View>
      </View>

      <View className="gap-1">
        <Text className="text-sm text-gray-500">
          🕐 {formatEventTime(event.startTime)}
        </Text>
        {event.location && (
          <Text className="text-sm text-gray-500">📍 {event.location}</Text>
        )}
        {event.status === 'error' && event.errorMessage && (
          <Text className="text-sm text-red-500 mt-1">{event.errorMessage}</Text>
        )}
      </View>
    </View>
  );
}
