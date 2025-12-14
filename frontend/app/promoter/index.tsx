import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { acceptPromoterInvitation, Event, EventStats, fetchPromoterEvents, fetchPromoterEventStats } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';

export default function PromoterHome() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventStats, setEventStats] = useState<Record<string, EventStats>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Accept invitation modal
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [invitationToken, setInvitationToken] = useState('');
  const [acceptingInvite, setAcceptingInvite] = useState(false);
  
  const { user } = useAuth();

  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchPromoterEvents();
      // Ensure data is an array
      const list = Array.isArray(data) ? data : [];
      setEvents(list);

      const statsEntries = await Promise.all(
        list.map(async (event) => {
          try {
            const stats = await fetchPromoterEventStats(event.id);
            return [event.id, stats] as const;
          } catch {
            return [event.id, { total_rsvps: 0, total_interested: 0, total_cancelled: 0, by_promoter: {}, by_source: {} }] as const;
          }
        })
      );
      setEventStats(Object.fromEntries(statsEntries));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load events';
      setError(message);
      setEvents([]);
      setEventStats({});
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

  async function handleAcceptInvitation() {
    if (!invitationToken.trim()) {
      Alert.alert('Error', 'Please enter an invitation token');
      return;
    }

    setAcceptingInvite(true);
    try {
      const result = await acceptPromoterInvitation(invitationToken.trim());
      Alert.alert('Success!', result.message, [
        { 
          text: 'OK', 
          onPress: () => {
            setShowAcceptModal(false);
            setInvitationToken('');
            loadEvents();
          }
        }
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to accept invitation';
      Alert.alert('Error', message);
    } finally {
      setAcceptingInvite(false);
    }
  }

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

  const displayName = useMemo(() => {
    if (!user) return 'Promoter';
    const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return name || user.email;
  }, [user]);

  const totals = useMemo(() => {
    const totalEvents = events.length;
    const totalRsvps = Object.values(eventStats).reduce((sum, s) => sum + (s?.total_rsvps || 0), 0);
    return { totalEvents, totalRsvps };
  }, [eventStats, events.length]);

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
        contentContainerClassName="p-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
          <Text className="text-sm font-bold mb-4">Your impact</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold">{totals.totalRsvps}</Text>
              <Text className="text-xs text-gray-500 mt-1">Participants</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold">{totals.totalEvents}</Text>
              <Text className="text-xs text-gray-500 mt-1">Events</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold">0</Text>
              <Text className="text-xs text-gray-500 mt-1">Shares</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 mb-5">
          <TouchableOpacity
            className="flex-1 bg-neutral-200 rounded-xl p-4 items-center"
            onPress={() => router.push('/promoter/events')}
          >
            <Text className="text-gray-800 text-base font-bold">View all events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-blue-600 rounded-xl p-4 items-center"
            onPress={() => setShowAcceptModal(true)}
          >
            <Text className="text-white text-base font-bold">+ Add event</Text>
          </TouchableOpacity>
        </View>

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
                <Text className="text-xs text-gray-600 mt-1">
                  {eventStats[event.id]?.total_rsvps || 0} registered via your link
                </Text>
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
                <Text className="text-xs text-gray-600 mt-1">
                  {eventStats[event.id]?.total_rsvps || 0} registered via your link
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Accept Invitation Modal */}
      <Modal
        visible={showAcceptModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAcceptModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-5">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <Text className="text-xl font-bold mb-2">Accept Invitation</Text>
            <Text className="text-sm text-gray-500 mb-4">
              Paste the invitation token you received from an organiser
            </Text>

            <TextInput
              className="bg-neutral-100 p-4 rounded-xl mb-4"
              placeholder="Paste invitation token here..."
              value={invitationToken}
              onChangeText={setInvitationToken}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              className={`rounded-xl p-4 items-center mb-3 ${acceptingInvite ? 'bg-gray-400' : 'bg-[#28B900]'}`}
              onPress={handleAcceptInvitation}
              disabled={acceptingInvite}
            >
              {acceptingInvite ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-bold">Accept Invitation</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="p-3 items-center"
              onPress={() => {
                setShowAcceptModal(false);
                setInvitationToken('');
              }}
            >
              <Text className="text-gray-500 text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
