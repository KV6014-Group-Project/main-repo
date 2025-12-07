import React, { useState, useEffect } from "react";
import { 
  SafeAreaView, 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Share,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Clipboard from 'expo-clipboard';
import { fetchEvent, deleteEvent, generatePromoterInvitation, Event, InvitationResponse } from "../lib/api";

export default function OrganiserEvent() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [invitation, setInvitation] = useState<InvitationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  async function loadEvent() {
    try {
      setError(null);
      const data = await fetchEvent(eventId!);
      setEvent(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load event';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateInvitation() {
    if (!event) return;
    
    setInviteLoading(true);
    try {
      const data = await generatePromoterInvitation(event.id);
      setInvitation(data);
      Alert.alert(
        'Invitation Created!',
        'Share this link with a promoter to invite them to your event.',
        [{ text: 'OK' }]
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate invitation';
      Alert.alert('Error', message);
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleCopyLink() {
    if (!invitation) return;
    await Clipboard.setStringAsync(invitation.token);
    Alert.alert('Copied!', 'Invitation token copied to clipboard');
  }

  async function handleShareLink() {
    if (!invitation || !event) return;
    try {
      await Share.share({
        message: `You're invited to promote "${event.title}"!\n\nUse this token to accept: ${invitation.token}`,
        title: `Invitation to promote: ${event.title}`,
      });
    } catch (err) {
      console.error('Share failed:', err);
    }
  }

  async function handleDeleteConfirm() {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${event?.title}"? This action cannot be undone.`
      );
      if (confirmed) {
        await handleDelete();
      }
    } else {
      Alert.alert(
        'Delete Event',
        `Are you sure you want to delete "${event?.title}"? This action cannot be undone.`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: handleDelete
          }
        ]
      );
    }
  }

  async function handleDelete() {
    if (!eventId) return;
    
    setLoading(true);
    try {
      await deleteEvent(eventId as string);
      
      if (Platform.OS === 'web') {
        router.push('/organiser/organiserdashboard' as any);
      } else {
        Alert.alert('Success', 'Event deleted successfully', [
          { 
            text: 'OK', 
            onPress: () => router.push('/organiser/organiserdashboard' as any)
          }
        ]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      
      if (Platform.OS === 'web') {
        alert(message); // Simple alert for web
      } else {
        Alert.alert('Error', message);
      }
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }

  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#28B900" />
        <Text className="mt-4 text-gray-500">Loading event...</Text>
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-5">
        <Text className="text-red-500 text-center mb-4">{error || 'Event not found'}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500">← Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <View className="bg-neutral-300 rounded-xl p-6 mb-5">
          <Text className="text-xl font-bold">{event.title}</Text>
          <View className={`self-start px-3 py-1 rounded-full mt-2 ${
            event.status.name === 'published' ? 'bg-green-200' :
            event.status.name === 'draft' ? 'bg-yellow-200' :
            'bg-gray-200'
          }`}>
            <Text className="text-xs capitalize">{event.status.name}</Text>
          </View>
        </View>

        <View className="bg-neutral-300 rounded-xl p-5 mb-5">
          <Text className="text-sm font-bold mb-1">Date</Text>
          <Text className="text-sm mb-4">{formatDate(event.start_datetime)}</Text>

          <Text className="text-sm font-bold mb-1">Time</Text>
          <Text className="text-sm mb-4">
            {formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}
          </Text>

          <Text className="text-sm font-bold mb-1">Location</Text>
          <Text className="text-sm">
            {event.location.venue}
            {event.location.room ? `, ${event.location.room}` : ''}
          </Text>
          {event.location.address && (
            <Text className="text-xs text-gray-600 mt-1">{event.location.address}</Text>
          )}
        </View>

        {event.description && (
          <View className="bg-neutral-100 rounded-xl p-4 mb-5">
            <Text className="text-base font-bold mb-2">About This Event</Text>
            <Text className="text-sm text-gray-700">{event.description}</Text>
          </View>
        )}

        {/* Invite Promoter Section */}
        <View className="bg-blue-50 rounded-xl p-4 mb-5">
          <Text className="text-base font-bold mb-2">Invite Promoters</Text>
          <Text className="text-sm text-gray-600 mb-4">
            Generate an invitation link to share with promoters who can help spread the word about your event.
          </Text>
          
          {!invitation ? (
            <TouchableOpacity 
              className={`rounded-xl p-4 items-center ${inviteLoading ? 'bg-gray-400' : 'bg-[#28B900]'}`}
              onPress={handleGenerateInvitation}
              disabled={inviteLoading}
            >
              {inviteLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-bold">Generate Invitation Token</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View>
              <View className="bg-white p-3 rounded-lg mb-3">
                <Text className="text-xs text-gray-500 mb-1">Invitation Token:</Text>
                <Text className="text-xs text-gray-800 font-mono" selectable>
                  {invitation.token}
                </Text>
                <Text className="text-xs text-gray-400 mt-2">
                  Expires in {invitation.expires_in_days} days
                </Text>
              </View>
              
              <TouchableOpacity 
                className="bg-neutral-200 rounded-xl p-3 items-center mb-2"
                onPress={handleCopyLink}
              >
                <Text className="text-sm font-medium">Copy Token</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="mt-2 p-2 items-center"
                onPress={handleGenerateInvitation}
              >
                <Text className="text-blue-500 text-sm">Generate New Token</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity className="bg-neutral-200 rounded-xl p-4 items-center mb-5">
          <Text className="text-base font-medium">View Event Statistics</Text>
        </TouchableOpacity>

        {/* NOT FINAL, THIS IS JUST A TEMPLATE TO SHOW FUNCTIONALITY */}
        <TouchableOpacity className="bg-yellow-400 rounded-xl p-4 items-center mb-5" onPress={() => router.push(`/organiser/update-event?eventId=${eventId}` as any)}>
          <Text className="text-base font-bold">Update Event</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className={`rounded-xl p-4 items-center mb-5 ${loading ? 'bg-red-300' : 'bg-red-400'}`}
          onPress={handleDeleteConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base font-bold">Delete Event</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity className="p-4 items-center" onPress={() => router.back()}>
          <Text className="text-blue-500 text-base">← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
