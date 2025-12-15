import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Event, fetchOrganiserEvents } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';

export default function OrganiserHome() {
  const router = useRouter();
  const { user, otpVerified } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const roleName = user?.role?.name?.toLowerCase();
    if (roleName === 'organiser' && !otpVerified) {
      router.replace({ pathname: '/auth/email-otp' as any, params: { role: 'organiser' } } as any);
    }
  }, [otpVerified, router, user?.role?.name]);

  const displayName = useMemo(() => {
    if (!user) return 'Organiser';
    const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return name || user.email;
  }, [user]);

  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchOrganiserEvents();
      const list = Array.isArray(data) ? data : [];
      const organiserOnly = user?.id ? list.filter((e) => e.organiser?.id === user.id) : list;
      setEvents(organiserOnly);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load events';
      setError(message);
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadEvents();
  }, [loadEvents]);

  const now = useMemo(() => new Date(), []);

  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter((e) => new Date(e.start_datetime).getTime() >= now.getTime())
      .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
      .slice(0, 3);
  }, [events, now]);

  const recentEvents = useMemo(() => {
    return [...events]
      .filter((e) => new Date(e.start_datetime).getTime() < now.getTime())
      .sort((a, b) => new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime())
      .slice(0, 3);
  }, [events, now]);

  const publishedCount = useMemo(
    () => events.filter((e) => e.status?.name === 'published').length,
    [events]
  );
  const draftCount = useMemo(
    () => events.filter((e) => e.status?.name === 'draft').length,
    [events]
  );

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
        <Text className="mt-4 text-gray-500">Loading dashboard...</Text>
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
        <View className="bg-neutral-300 rounded-2xl p-6 mb-5">
          <Text className="text-2xl font-bold">{displayName}</Text>
          <Text className="text-sm text-gray-600 mt-1">Dashboard overview</Text>
        </View>

        {error && (
          <View className="bg-red-100 p-4 rounded-xl mb-4">
            <Text className="text-red-700">{error}</Text>
            <TouchableOpacity onPress={loadEvents} className="mt-2">
              <Text className="text-blue-500">Tap to retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="bg-neutral-100 rounded-2xl p-5 mb-5">
          <Text className="text-sm font-bold mb-4">Quick overview</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold">{events.length}</Text>
              <Text className="text-xs text-gray-500 mt-1">Total</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold">{publishedCount}</Text>
              <Text className="text-xs text-gray-500 mt-1">Published</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold">{draftCount}</Text>
              <Text className="text-xs text-gray-500 mt-1">Drafts</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 mb-5">
          <TouchableOpacity
            className="flex-1 bg-[#28B900] rounded-xl p-4 items-center"
            onPress={() => router.push('/organiser/create-event')}
          >
            <Text className="text-white text-base font-bold">+ Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-neutral-200 rounded-xl p-4 items-center"
            onPress={() => router.push('/organiser/events' as any)}
          >
            <Text className="text-gray-800 text-base font-bold">View all</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-blue-600 rounded-xl p-4 items-center mb-5"
          onPress={() => router.push('/organiser/organiser-analytics' as any)}
        >
          <Text className="text-white text-base font-bold">View Analytics</Text>
        </TouchableOpacity>

        <Text className="text-base font-bold mb-3">Upcoming</Text>
        {upcomingEvents.length === 0 ? (
          <View className="bg-neutral-100 rounded-xl p-5 mb-5">
            <Text className="text-sm text-gray-500">No upcoming events.</Text>
          </View>
        ) : (
          <View className="mb-5">
            {upcomingEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                className="bg-neutral-300 rounded-xl p-4 mb-3"
                onPress={() => handleEventPress(event)}
              >
                <Text className="text-sm font-bold">{event.title}</Text>
                <Text className="text-sm text-gray-700">{formatEventDate(event.start_datetime)}</Text>
                <Text className="text-sm text-gray-700">{formatEventTime(event.start_datetime)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text className="text-base font-bold mb-3">Recent</Text>
        {recentEvents.length === 0 ? (
          <View className="bg-neutral-100 rounded-xl p-5">
            <Text className="text-sm text-gray-500">No past events yet.</Text>
          </View>
        ) : (
          <View>
            {recentEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                className="bg-neutral-200 rounded-xl p-4 mb-3"
                onPress={() => handleEventPress(event)}
              >
                <Text className="text-sm font-bold">{event.title}</Text>
                <Text className="text-sm text-gray-700">{formatEventDate(event.start_datetime)}</Text>
                <Text className="text-sm text-gray-700">{formatEventTime(event.start_datetime)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
