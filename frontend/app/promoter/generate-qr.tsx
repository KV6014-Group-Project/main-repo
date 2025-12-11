import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchPromoterEvent, generateParticipantQR, Event, QRShareResponse } from '../../lib/api';
import QRCodeDisplay from '../components/QRCodeDisplay';

export default function GenerateQR() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [qrData, setQrData] = useState<QRShareResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  async function loadEvent() {
    try {
      setError(null);
      const data = await fetchPromoterEvent(eventId!);
      setEvent(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load event';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateQR() {
    if (!event) return;
    
    setGenerating(true);
    try {
      const data = await generateParticipantQR(event.id);
      setQrData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate QR code';
      Alert.alert('Error', message);
    } finally {
      setGenerating(false);
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
        <Text className="text-2xl font-bold text-center mb-2">Generate QR Code</Text>
        <Text className="text-sm text-gray-500 text-center mb-6">
          Create a QR code for participants to scan and RSVP
        </Text>

        {/* Event Info Card */}
        <View className="bg-neutral-100 rounded-xl p-4 mb-6">
          <Text className="text-lg font-bold mb-2">{event.title}</Text>
          <Text className="text-sm text-gray-600">
            {formatDate(event.start_datetime)} at {formatTime(event.start_datetime)}
          </Text>
          <Text className="text-sm text-gray-600">
            {event.location.name}
            {event.location.room ? `, ${event.location.room}` : ''}
          </Text>
        </View>

        {/* QR Code Display */}
        {qrData ? (
          <View className="mb-6">
            <View className="bg-neutral-50 rounded-xl p-4">
              <QRCodeDisplay
                value={qrData.yaml}
                size={280}
                title={event.title}
                subtitle={`${formatDate(event.start_datetime)} • ${formatTime(event.start_datetime)}`}
              />
            </View>
            
            <View className="mt-4 bg-green-50 p-4 rounded-xl">
              <Text className="text-green-800 text-center text-sm">
                ✓ QR Code generated successfully
              </Text>
              <Text className="text-green-600 text-center text-xs mt-1">
                Share ID: {qrData.share_id.slice(0, 8)}...
              </Text>
            </View>

            <TouchableOpacity
              className="bg-[#28B900] rounded-xl p-4 items-center mt-4"
              onPress={handleGenerateQR}
            >
              <Text className="text-white text-base font-bold">Generate New QR Code</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mb-6">
            <View className="bg-neutral-50 rounded-xl p-8 items-center">
              <View className="w-64 h-64 bg-neutral-200 rounded-lg items-center justify-center">
                <Text className="text-gray-400 text-center">
                  QR code will appear here
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className={`rounded-xl p-4 items-center mt-4 ${generating ? 'bg-gray-400' : 'bg-[#28B900]'}`}
              onPress={handleGenerateQR}
              disabled={generating}
            >
              {generating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-bold">Generate QR Code</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Instructions */}
        <View className="bg-blue-50 rounded-xl p-4 mb-6">
          <Text className="text-base font-bold mb-2 text-blue-900">How it works</Text>
          <Text className="text-sm text-blue-800 mb-2">
            1. Generate a QR code for this event
          </Text>
          <Text className="text-sm text-blue-800 mb-2">
            2. Show the QR code to participants
          </Text>
          <Text className="text-sm text-blue-800 mb-2">
            3. Participants scan to RSVP (works offline!)
          </Text>
          <Text className="text-sm text-blue-800">
            4. RSVPs sync when participants go online
          </Text>
        </View>

        <TouchableOpacity className="p-4 items-center" onPress={() => router.back()}>
          <Text className="text-blue-500 text-base">← Back to Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
