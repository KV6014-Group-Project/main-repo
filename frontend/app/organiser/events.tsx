import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Event, fetchOrganiserEvents } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';

export default function OrganiserEvents() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchOrganiserEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load events';
      setError(message);
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadEvents();
  }, [loadEvents]);

  const sortedEvents = useMemo(() => {
    const organiserEvents = user?.id
      ? events.filter((e) => e.organiser?.id === user.id)
      : events;

    return [...organiserEvents].sort(
      (a, b) => new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime()
    );
  }, [events, user?.id]);

  function formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  function formatEventTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  function handleEventPress(event: Event) {
    router.push({
      pathname: '/organiser/organiserevent',
      params: { eventId: event.id },
    });
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#28B900" />
        <Text className="mt-4 text-gray-500">Loading your events...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="mb-5">
          <Text className="text-2xl font-bold">Your Events</Text>
          <Text className="text-sm text-gray-500 mt-1">Only events created by you appear here.</Text>
        </View>

        <TouchableOpacity
          className="bg-[#28B900] rounded-xl p-4 items-center mb-4"
          onPress={() => router.push('/organiser/create-event')}
        >
          <Text className="text-white text-base font-bold">+ Create New Event</Text>
        </TouchableOpacity>

        {error && (
          <View className="bg-red-100 p-4 rounded-xl mb-4">
            <Text className="text-red-700">{error}</Text>
            <TouchableOpacity onPress={loadEvents} className="mt-2">
              <Text className="text-blue-500">Tap to retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {sortedEvents.length === 0 && !error && (
          <View className="bg-neutral-100 rounded-xl p-6 items-center">
            <Text className="text-gray-500 text-center">
              No events yet. Create your first event to get started!
            </Text>
          </View>
        )}

        {sortedEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            className="bg-neutral-300 rounded-xl p-4 mb-3"
            onPress={() => handleEventPress(event)}
          >
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-sm font-bold flex-1">
                {event.title}
                {event.location.name ? ` - ${event.location.name}` : ''}
              </Text>
              <View
                className={`px-2 py-1 rounded-full ml-2 ${
                  event.status.name === 'published'
                    ? 'bg-green-200'
                    : event.status.name === 'draft'
                      ? 'bg-yellow-200'
                      : 'bg-gray-200'
                }`}
              >
                <Text className="text-xs capitalize">{event.status.name}</Text>
              </View>
            </View>
            <Text className="text-sm text-gray-700">{formatEventDate(event.start_datetime)}</Text>
            <Text className="text-sm text-gray-700">{formatEventTime(event.start_datetime)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
