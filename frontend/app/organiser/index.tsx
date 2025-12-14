import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchOrganiserEvents, Event } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';

export default function OrganiserHome() {
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

  const displayName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
    : 'Organiser';

  const { totalEvents, publishedCount, draftCount, upcomingEvents } = useMemo(() => {
    const sorted = [...events].sort(
      (a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime()
    );
    const now = Date.now();
    const upcoming = sorted.filter((e) => new Date(e.start_datetime).getTime() >= now);
    const published = events.filter((e) => e.status?.name === 'published').length;
    const draft = events.filter((e) => e.status?.name === 'draft').length;

    return {
      totalEvents: events.length,
      publishedCount: published,
      draftCount: draft,
      upcomingEvents: upcoming,
    };
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="bg-neutral-300 rounded-2xl p-6 mb-5">
          <Text className="text-3xl font-bold text-center">{displayName}</Text>
          <Text className="text-sm text-gray-600 text-center mt-2">Dashboard overview</Text>
        </View>

        <View className="bg-neutral-100 rounded-2xl p-5 mb-5">
          <Text className="text-sm font-bold mb-4">Quick Overview</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-3xl font-bold">{totalEvents}</Text>
              <Text className="text-xs text-gray-500 mt-1">Total</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold">{publishedCount}</Text>
              <Text className="text-xs text-gray-500 mt-1">Published</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold">{draftCount}</Text>
              <Text className="text-xs text-gray-500 mt-1">Drafts</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 mb-5">
          <TouchableOpacity
            className="flex-1 bg-[#28B900] p-4 rounded-xl items-center"
            onPress={() => router.push('/organiser/create-event')}
          >
            <Text className="text-white text-base font-semibold">+ Create Event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-neutral-200 p-4 rounded-xl items-center"
            onPress={() => router.push('/organiser/events')}
          >
            <Text className="text-gray-800 text-base font-semibold">View All</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-base font-bold mb-3">Upcoming</Text>

        {loading && (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" color="#28B900" />
            <Text className="mt-4 text-gray-500">Loading your dashboard...</Text>
          </View>
        )}

        {!loading && error && (
          <View className="bg-red-100 p-4 rounded-xl mb-4">
            <Text className="text-red-700">{error}</Text>
            <TouchableOpacity onPress={loadEvents} className="mt-2">
              <Text className="text-blue-500">Tap to retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && upcomingEvents.length === 0 && (
          <View className="bg-neutral-100 rounded-xl p-6 items-center">
            <Text className="text-gray-500 text-center">
              No upcoming events.
            </Text>
          </View>
        )}

        {!loading && !error && upcomingEvents.slice(0, 3).map((event) => (
          <TouchableOpacity
            key={event.id}
            className="bg-neutral-300 rounded-xl p-4 mb-3"
            onPress={() =>
              router.push({
                pathname: '/organiser/organiserevent',
                params: { eventId: event.id },
              })
            }
          >
            <Text className="text-sm font-bold mb-1">{event.title}</Text>
            <Text className="text-sm text-gray-700">{formatEventDate(event.start_datetime)} · {formatEventTime(event.start_datetime)}</Text>
            {!!event.location?.name && (
              <Text className="text-xs text-gray-600 mt-1">{event.location.name}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
