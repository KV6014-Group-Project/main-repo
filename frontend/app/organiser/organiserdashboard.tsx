import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchOrganiserEvents, Event } from '../lib/api';
import { useAuth } from '../lib/AuthContext';

export default function OrganiserDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchOrganiserEvents();
      // Ensure data is an array
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

  function formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
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

  const displayName = user 
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
    : 'Organiser';

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#28B900" />
        <Text className="mt-4 text-gray-500">Loading events...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="bg-neutral-300 rounded-xl p-6 items-center mb-4">
          <Text className="text-3xl font-bold">{displayName.toUpperCase()}</Text>
        </View>

        <View className="bg-neutral-100 rounded-xl p-5 mb-6">
          <Text className="text-sm font-bold mb-4">Your Impact This Month</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-3xl font-bold">--</Text>
              <Text className="text-xs text-gray-500 mt-1">Participants</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold">{events.length}</Text>
              <Text className="text-xs text-gray-500 mt-1">Events</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold">--</Text>
              <Text className="text-xs text-gray-500 mt-1">Shares</Text>
            </View>
          </View>
        </View>

        {/* Create Event Button */}
        <TouchableOpacity 
          className="bg-[#28B900] rounded-xl p-4 items-center mb-4"
          onPress={() => router.push('/organiser/create-event')}
        >
          <Text className="text-white text-base font-bold">+ Create New Event</Text>
        </TouchableOpacity>

        <Text className="text-base font-bold mb-4">Your Events</Text>

        {error && (
          <View className="bg-red-100 p-4 rounded-xl mb-4">
            <Text className="text-red-700">{error}</Text>
            <TouchableOpacity onPress={loadEvents} className="mt-2">
              <Text className="text-blue-500">Tap to retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {events.length === 0 && !error && (
          <View className="bg-neutral-100 rounded-xl p-6 items-center">
            <Text className="text-gray-500 text-center">
              No events yet. Create your first event to get started!
            </Text>
          </View>
        )}

        {events.map((event) => (
          <TouchableOpacity 
            key={event.id}
            className="bg-neutral-300 rounded-xl p-4 mb-3"
            onPress={() => handleEventPress(event)}
          >
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-sm font-bold flex-1">
                {event.title}
                {event.location.venue ? ` - ${event.location.venue}` : ''}
              </Text>
              <View className={`px-2 py-1 rounded-full ml-2 ${
                event.status.name === 'published' ? 'bg-green-200' :
                event.status.name === 'draft' ? 'bg-yellow-200' :
                'bg-gray-200'
              }`}>
                <Text className="text-xs capitalize">{event.status.name}</Text>
              </View>
            </View>
            <Text className="text-sm text-gray-700">{formatEventDate(event.start_datetime)}</Text>
            <Text className="text-sm text-gray-700">{formatEventTime(event.start_datetime)}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity className="mt-5 p-4 items-center" onPress={() => router.back()}>
          <Text className="text-blue-500 text-base">← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
