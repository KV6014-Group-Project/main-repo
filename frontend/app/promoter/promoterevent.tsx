import React, { useState, useEffect } from "react";
import { 
  SafeAreaView, 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchPromoterEvent, Event } from "../lib/api";

export default function PromoterEvent() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
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

        <View className="bg-[#D5E0CB] rounded-xl p-4 mb-5">
          <Text className="text-base font-bold">-- people</Text>
          <Text className="text-sm text-gray-700">registered via your link</Text>
        </View>

        {/* Generate QR Code Button */}
        <TouchableOpacity 
          className="bg-[#28B900] rounded-xl p-4 items-center mb-3"
          onPress={() => router.push({
            pathname: '/promoter/generate-qr',
            params: { eventId: event.id },
          })}
        >
          <Text className="text-white text-base font-bold">Generate QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#48C44B] rounded-xl p-4 items-center mb-3">
          <Text className="text-white text-base font-bold">Share On WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-neutral-200 rounded-xl p-4 items-center mb-5">
          <Text className="text-base font-medium">View Statistics</Text>
        </TouchableOpacity>

        <TouchableOpacity className="p-4 items-center" onPress={() => router.back()}>
          <Text className="text-blue-500 text-base">← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
