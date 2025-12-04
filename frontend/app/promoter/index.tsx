import React, { useState, useEffect, useCallback } from 'react';
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
import { fetchPromoterEvents, acceptPromoterInvitation, Event } from '../lib/api';
import { getCurrentUser } from '../lib/authState';

export default function PromoterHome() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Accept invitation modal
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [invitationToken, setInvitationToken] = useState('');
  const [acceptingInvite, setAcceptingInvite] = useState(false);
  
  const user = getCurrentUser();

  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchPromoterEvents();
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

  const displayName = user 
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
    : 'Promoter';

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
        <Text className="text-3xl font-bold text-center mt-5 mb-2">Promoter Dashboard</Text>
        <Text className="text-sm text-gray-500 text-center mb-2">{displayName}</Text>
        <Text className="text-sm text-gray-400 text-center mb-8">Share events with your community</Text>

        {/* Accept Invitation Button */}
        <TouchableOpacity 
          className="bg-blue-500 p-4 rounded-xl items-center mb-5"
          onPress={() => setShowAcceptModal(true)}
        >
          <Text className="text-white text-base font-semibold">Accept Invitation</Text>
        </TouchableOpacity>

        {/* Events Section */}
        <View className="bg-neutral-100 rounded-xl p-5 mb-5">
          <Text className="text-lg font-semibold mb-3">Your Events</Text>
          
          {error && (
            <View className="bg-red-100 p-3 rounded-lg mb-3">
              <Text className="text-red-700 text-sm">{error}</Text>
              <TouchableOpacity onPress={loadEvents} className="mt-2">
                <Text className="text-blue-500 text-sm">Tap to retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {events.length === 0 && !error ? (
            <Text className="text-sm text-gray-500">
              No events assigned yet. Accept an invitation from an organiser to get started.
            </Text>
          ) : (
            events.map((event) => (
              <TouchableOpacity
                key={event.id}
                className="bg-white rounded-lg p-4 mb-3"
                onPress={() => handleEventPress(event)}
              >
                <Text className="text-base font-semibold mb-1">{event.title}</Text>
                <Text className="text-sm text-gray-600">
                  {formatEventDate(event.start_datetime)} at {formatEventTime(event.start_datetime)}
                </Text>
                <Text className="text-sm text-gray-500">
                  {event.location.venue}
                  {event.location.room ? `, ${event.location.room}` : ''}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {events.length > 0 && (
          <TouchableOpacity 
            className="bg-[#28B900] p-4 rounded-xl items-center mb-3" 
            onPress={() => router.push('/promoter/promoterimpact')}
          >
            <Text className="text-white text-base font-semibold">View Impact</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          className="bg-neutral-200 p-4 rounded-xl items-center mt-5" 
          onPress={() => router.replace('/welcome')}
        >
          <Text className="text-gray-700 text-base font-semibold">Sign Out</Text>
        </TouchableOpacity>
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
