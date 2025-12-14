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
import { Event, fetchPromoterEvents } from '../../lib/api';

export default function PromoterEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchPromoterEvents();
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
    return [...events].sort(
      (a, b) => new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime()
    );
  }, [events]);

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
      pathname: '/promoter/promoterevent',
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
          <Text className="text-sm text-gray-500 mt-1">Events you’re promoting appear here.</Text>
        </View>

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
              No events assigned yet. Accept an invitation from an organiser to get started.
            </Text>
          </View>
        )}

        {sortedEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            className="bg-neutral-300 rounded-xl p-4 mb-3"
            onPress={() => handleEventPress(event)}
          >
            <Text className="text-sm font-bold">{event.title}</Text>
            <Text className="text-sm text-gray-700">{formatEventDate(event.start_datetime)}</Text>
            <Text className="text-sm text-gray-700">{formatEventTime(event.start_datetime)}</Text>
            <Text className="text-xs text-gray-600 mt-1">
              {event.location.name}
              {event.location.room ? `, ${event.location.room}` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
