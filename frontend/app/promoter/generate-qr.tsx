import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';
import { fetchPromoterEvent, generateParticipantQR, Event, QRShareResponse } from '../../lib/api';
import QRCodeDisplay from '../components/QRCodeDisplay';
import EventPoster from '../components/EventPoster';

// Only import html2canvas on web platform
const html2canvas = Platform.OS === 'web' ? require('html2canvas') : null;

export default function GenerateQR() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [qrData, setQrData] = useState<QRShareResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingPoster, setSavingPoster] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const posterRef = useRef<View>(null);

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

  function generateShareableLink(): string {
    if (!qrData) return '';
    // Encode the YAML payload as base64 for URL safety
    const encoded = btoa(qrData.yaml);
    // Create a deep link that participants can use
    return `rose://join?token=${encoded}`;
  }

  async function handleCopyLink() {
    const link = generateShareableLink();
    if (!link) return;

    try {
      await Clipboard.setStringAsync(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (err) {
      Alert.alert('Error', 'Failed to copy link to clipboard');
    }
  }

  async function handleSavePoster() {
    if (!posterRef.current || !event || !qrData) return;

    setSavingPoster(true);
    try {
      const isWeb = Platform.OS === 'web';
      const fileName = `${event.title.replace(/[^a-z0-9]/gi, '_')}_poster.png`;

      if (isWeb && html2canvas) {
        // For web, use html2canvas instead of react-native-view-shot
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const element = (posterRef.current as any);
        // Ensure React is available for html2canvas by setting it globally if needed
        if (typeof window !== 'undefined' && !(window as any).React) {
          (window as any).React = React;
        }
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        const dataUrl = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert('Success', 'Poster downloaded!');
      } else {
        // For mobile, use react-native-view-shot
        const uri = await captureRef(posterRef.current, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        });

        // For mobile, show share/save options
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share Event Poster',
          });
        } else {
          // Fallback to saving to media library
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status === 'granted') {
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert('Success', 'Poster saved to your photo library!');
          } else {
            Alert.alert('Permission Required', 'Please grant permission to save images.');
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save poster';
      Alert.alert('Error', message);
      if (Platform.OS === 'web') {
        window.alert(message);
      }
    } finally {
      setSavingPoster(false);
    }
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
                QR Code generated successfully
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

            {/* Copy Link Button */}
            <TouchableOpacity
              className={`rounded-xl p-4 items-center mt-3 border-2 ${linkCopied ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-white'}`}
              onPress={handleCopyLink}
            >
              <Text className={`text-base font-bold ${linkCopied ? 'text-green-600' : 'text-blue-500'}`}>
                {linkCopied ? 'Link Copied!' : 'Copy Shareable Link'}
              </Text>
            </TouchableOpacity>

            {/* Download Poster Button */}
            <TouchableOpacity
              className={`rounded-xl p-4 items-center mt-3 border-2 border-[#28B900] ${savingPoster ? 'bg-gray-100' : 'bg-white'}`}
              onPress={handleSavePoster}
              disabled={savingPoster}
            >
              {savingPoster ? (
                <ActivityIndicator color="#28B900" />
              ) : (
                <Text className="text-[#28B900] text-base font-bold">Download Event Poster</Text>
              )}
            </TouchableOpacity>

            {/* Hidden Poster for Capture */}
            <View style={{ position: 'absolute', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
              <EventPoster
                ref={posterRef}
                qrValue={qrData.yaml}
                eventTitle={event.title}
                eventDate={formatDate(event.start_datetime)}
                eventTime={formatTime(event.start_datetime)}
                eventLocation={event.location.name}
                eventRoom={event.location.room}
              />
            </View>
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
