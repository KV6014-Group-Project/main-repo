import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchPromoterEvent, generateParticipantQR, Event, QRShareResponse } from '../../lib/api';
import QRCodeDisplay, { QRCodeDisplayRef } from '../components/QRCodeDisplay';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import ViewShot from "react-native-view-shot";

// Conditionally import html2canvas for web
let html2canvas: any = null;
if (Platform.OS === 'web') {
  html2canvas = require('html2canvas');
}

export default function GenerateQR() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const qrRef = useRef<QRCodeDisplayRef>(null);
  
  const [event, setEvent] = useState<Event | null>(null);
  const [qrData, setQrData] = useState<QRShareResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ref for the poster
  const posterRef = useRef<any>(null);

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

  async function handleDownloadQR() {
    if (!posterRef.current || !event) return;

    setDownloading(true);

    try {
      if (Platform.OS === "web") {
        // Web: Use html2canvas
        const canvas = await html2canvas(posterRef.current, {
          backgroundColor: '#f5f5f5',
          scale: 1,
        });
        
        canvas.toBlob((blob: Blob | null) => {
          if (!blob) {
            throw new Error('Failed to create blob');
          }
          
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `${event.title.replace(/[^a-z0-9]/gi, '-')}-poster.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 'image/png');

      } else {
        // Mobile: Use ViewShot
        const posterUri = await posterRef.current.capture();

        if (!posterUri) { 
          throw new Error("Failed to capture poster"); 
        }

        const fileUri = `${FileSystem.cacheDirectory}${event.title.replace(/[^a-z0-9]/gi, '-')}-poster.png`;
        const base64 = await FileSystem.readAsStringAsync(posterUri, { encoding: "base64" });

        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(fileUri, {
          mimeType: "image/png",
          dialogTitle: "Share Poster",
        });
      }

    } catch (err) {
      console.error('Download error:', err);
      const message = err instanceof Error ? err.message : 'Failed to download poster';
      Alert.alert('Error', message);
    } finally {
      setDownloading(false);
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
            {Platform.OS === 'web' ? (
              // Web: Use a div ref for html2canvas
              <div ref={posterRef}>
                <View className="bg-neutral-50 rounded-xl p-4">
                  <QRCodeDisplay
                    ref={qrRef}
                    value={qrData.yaml}
                    size={280}
                    title={event.title}
                    subtitle={`${formatDate(event.start_datetime)} • ${formatTime(event.start_datetime)}`}
                  />
                </View>
              </div>
            ) : (
              // Mobile: Use ViewShot
              <ViewShot
                ref={posterRef}
                options={{ format: "png", quality: 1 }}
              >
                <View className="bg-neutral-50 rounded-xl p-4">
                  <QRCodeDisplay
                    ref={qrRef}
                    value={qrData.yaml}
                    size={280}
                    title={event.title}
                    subtitle={`${formatDate(event.start_datetime)} • ${formatTime(event.start_datetime)}`}
                  />
                </View>
              </ViewShot>
            )}
            
            <View className="mt-4 bg-green-50 p-4 rounded-xl">
              <Text className="text-green-800 text-center text-sm">
                ✓ QR Code generated successfully
              </Text>
              <Text className="text-green-600 text-center text-xs mt-1">
                Share ID: {qrData.share_id.slice(0, 8)}...
              </Text>
            </View>

            {/* Download/Share Button */}
            <TouchableOpacity
              className={`rounded-xl p-4 items-center mt-4 ${downloading ? 'bg-gray-400' : 'bg-blue-600'}`}
              onPress={handleDownloadQR}
              disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-bold">
                  {Platform.OS === 'web' ? 'Download Poster' : 'Share Poster'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#28B900] rounded-xl p-4 items-center mt-2"
              onPress={handleGenerateQR}
            >
              <Text className="text-white text-base font-bold">Generate New Poster</Text>
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
            2. Download or share the QR code
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