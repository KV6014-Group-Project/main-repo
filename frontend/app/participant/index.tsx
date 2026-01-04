import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Alert, Platform, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useParticipant, LocalEvent } from '../../lib/ParticipantContext';
import { formatEventTime } from '../../lib/offlineParser';
import { Event, deleteParticipantDevice } from '../../lib/api';
import { getDeviceId, resetDeviceId } from '../../lib/device';

export default function ParticipantHome() {
  const router = useRouter();
  const {
    profile,
    otpVerified,
    localEvents,
    serverEvents,
    isLoading,
    isSyncing,
    isOnline,
    syncEvents,
    refreshServerEvents,
    clearProfile,
    addScannedEvent,
  } = useParticipant();
  
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isActuallyOnline, setIsActuallyOnline] = React.useState(true);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [isAddingFromLink, setIsAddingFromLink] = useState(false);

  useEffect(() => {
    if (!isLoading && profile && !otpVerified) {
      router.replace('/auth/participant-otp' as any);
    }
  }, [isLoading, otpVerified, profile, router]);

  // Merge local and server events for display
  const displayEvents = getMergedEvents(localEvents, serverEvents);
  const pendingCount = localEvents.filter(e => e.status === 'pending').length;

  // Refresh server events periodically
  useEffect(() => {
    if (isOnline && !isLoading) {
      refreshServerEvents();
    }
  }, [isOnline, isLoading]);

  // Check real-time connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/core/public-key/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        setIsActuallyOnline(response.ok);
      } catch (error) {
        setIsActuallyOnline(false);
      }
    };

    // Check immediately
    checkConnection();

    // Check every 10 seconds
    const interval = setInterval(checkConnection, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    await syncEvents();
  };

  const handleAddFromLink = async () => {
    if (!linkInput.trim()) {
      Alert.alert('Error', 'Please enter a link or token');
      return;
    }

    setIsAddingFromLink(true);
    try {
      let yamlPayload = linkInput.trim();

      // Check if it's a deep link format (rose://join?token=...)
      if (yamlPayload.startsWith('rose://join?token=')) {
        const encoded = yamlPayload.replace('rose://join?token=', '');
        try {
          yamlPayload = atob(encoded);
        } catch {
          Alert.alert('Error', 'Invalid link format');
          setIsAddingFromLink(false);
          return;
        }
      }

      // Try to add the event
      const success = addScannedEvent(yamlPayload);
      if (success) {
        setShowLinkModal(false);
        setLinkInput('');
        Alert.alert('Success', 'Event added! It will sync when you\'re online.');
        // Try to sync immediately if online
        if (isActuallyOnline) {
          await syncEvents();
        }
      } else {
        Alert.alert('Error', 'Invalid event link or token. Please check and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process the link');
    } finally {
      setIsAddingFromLink(false);
    }
  };

  const performDelete = async () => {
    let deviceId: string | null = null;
    let backendDeleteSuccess = false;
    
    try {
      // Get device ID first
      deviceId = await getDeviceId();
      
      // Call backend to deregister from all events
      const result = await deleteParticipantDevice(deviceId);
      backendDeleteSuccess = true;
      
      // Clear local data
      await clearProfile();
      
      // Reset device ID
      await resetDeviceId();
      
      // Show success message
      const successMessage = `Device data deleted successfully. You were deregistered from ${result.rsvps_deleted} event(s).`;
      
      if (Platform.OS === 'web') {
        alert(successMessage);
      } else {
        Alert.alert('Success', successMessage, [{ text: 'OK', style: 'default' }]);
      }
      
      // Navigate to welcome
      router.replace('/welcome');
    } catch (error) {
      console.error('Failed to delete device data:', error);
      
      // If backend delete failed, don't clear local data
      if (!backendDeleteSuccess) {
        const errorMessage = 'Failed to delete device data from server. Please check your connection and try again.';
        
        if (Platform.OS === 'web') {
          alert(errorMessage);
        } else {
          Alert.alert('Error', errorMessage, [{ text: 'OK', style: 'default' }]);
        }
      } else {
        // Backend succeeded but local cleanup failed - this is a partial failure
        // Try to navigate anyway since the user is deregistered on the server
        const warningMessage = 'Device data was deleted from server, but there was an issue clearing local data. You may need to clear app data manually.';
        
        if (Platform.OS === 'web') {
          alert(warningMessage);
        } else {
          Alert.alert('Warning', warningMessage, [{ text: 'OK', style: 'default' }]);
        }
        
        // Still navigate to welcome since server-side deletion is complete
        router.replace('/welcome');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteDeviceData = async () => {
    // Early return if not online (button should be disabled, but double-check)
    if (!isActuallyOnline) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const confirmed = Platform.OS === 'web'
        ? window.confirm('Delete device data?\n\nThis will remove your participant details, deregister you from all events, and clear your local event history from this device. You will need to re-enter your details next time.')
        : null;

      // For web, use confirm
      if (Platform.OS === 'web') {
        if (confirmed) {
          await performDelete();
        }
      } else {
        // For mobile, use Alert
        Alert.alert(
          'Delete device data?',
          'This will remove your participant details, deregister you from all events, and clear your local event history from this device. You will need to re-enter your details next time.',
          [
            { 
              text: 'Cancel', 
              style: 'cancel',
              onPress: () => setIsDeleting(false),
            },
            {
              text: 'Yes, delete',
              style: 'destructive',
              onPress: performDelete,
            },
          ],
        );
      }
    } catch (error) {
      console.error('Error in handleDeleteDeviceData:', error);
    } finally {
      // Always reset loading state for web
      if (Platform.OS === 'web') {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#28B900" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <Text className="text-3xl font-bold text-center mt-5 mb-2">Participant Profile</Text>
        <Text className="text-sm text-gray-500 text-center mb-8">Your event participation details</Text>

        {/* Connection Status */}
        <View className="flex-row items-center justify-center mb-4">
          <View className={`w-2 h-2 rounded-full mr-2 ${isActuallyOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          <Text className="text-sm text-gray-500">{isActuallyOnline ? 'Online' : 'Offline'}</Text>
        </View>

        {/* Profile Info */}
        <View className="bg-neutral-100 rounded-xl p-5 mb-5">
          <Text className="text-lg font-semibold mb-4">Your Info</Text>
          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-1">Name</Text>
            <Text className="text-base">
              {profile ? `${profile.firstName} ${profile.lastName}` : 'Not registered'}
            </Text>
          </View>
          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-1">Email</Text>
            <Text className="text-base">{profile?.email || 'Not provided'}</Text>
          </View>
          {profile?.phone && (
            <View>
              <Text className="text-xs text-gray-500 mb-1">Phone</Text>
              <Text className="text-base">{profile.phone}</Text>
            </View>
          )}
        </View>

        {/* Sync Button (when there are pending events) */}
        {pendingCount > 0 && (
          <TouchableOpacity
            className={`p-4 rounded-xl items-center mb-5 ${isSyncing ? 'bg-gray-400' : 'bg-blue-500'}`}
            onPress={handleSync}
            disabled={isSyncing}
          >
            <Text className="text-white text-base font-semibold">
              {isSyncing ? 'Syncing...' : `Sync ${pendingCount} Pending Event${pendingCount > 1 ? 's' : ''}`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Events List */}
        <View className="bg-neutral-100 rounded-xl p-5 mb-5">
          <Text className="text-lg font-semibold mb-4">Your Events</Text>

          {displayEvents.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">
              No events yet. Scan a QR code to add an event!
            </Text>
          ) : (
            displayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </View>

        {/* Add Event Buttons */}
        <View className="flex-row gap-3 mt-5">
          <TouchableOpacity
            className="flex-1 bg-neutral-200 p-4 rounded-xl items-center"
            onPress={() => router.push('/participant/qr-code-page')}
          >
            <Text className="text-gray-700 text-base font-semibold">Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-blue-100 p-4 rounded-xl items-center"
            onPress={() => setShowLinkModal(true)}
          >
            <Text className="text-blue-700 text-base font-semibold">Enter Link</Text>
          </TouchableOpacity>
        </View>

        {/* Link Entry Modal */}
        <Modal
          visible={showLinkModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLinkModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6">
              <Text className="text-xl font-bold mb-2">Add Event from Link</Text>
              <Text className="text-gray-500 text-sm mb-4">
                Paste the event link shared by the promoter
              </Text>
              
              <TextInput
                className="border border-gray-300 rounded-xl p-4 text-base mb-4"
                placeholder="Paste link here (rose://join?token=...)"
                value={linkInput}
                onChangeText={setLinkInput}
                autoCapitalize="none"
                autoCorrect={false}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                className={`p-4 rounded-xl items-center mb-3 ${isAddingFromLink ? 'bg-gray-400' : 'bg-[#28B900]'}`}
                onPress={handleAddFromLink}
                disabled={isAddingFromLink}
              >
                {isAddingFromLink ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-base font-bold">Add Event</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="p-4 rounded-xl items-center"
                onPress={() => {
                  setShowLinkModal(false);
                  setLinkInput('');
                }}
              >
                <Text className="text-gray-500 text-base">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Delete Device Data Button */}
        <TouchableOpacity
          className={`p-4 rounded-xl items-center mt-5 ${isActuallyOnline ? 'bg-neutral-200' : 'bg-gray-100'}`}
          onPress={handleDeleteDeviceData}
          disabled={!isActuallyOnline || isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#6B7280" />
          ) : (
            <Text className={`${isActuallyOnline ? 'text-gray-700' : 'text-gray-400'} text-base font-semibold`}>
              Delete Device Data
            </Text>
          )}
        </TouchableOpacity>
        
        {!isActuallyOnline && (
          <Text className="text-xs text-gray-500 text-center mt-2">
            Device deletion requires an internet connection
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ Helper Types & Functions ============

type DisplayEvent = {
  id: string;
  title: string;
  startTime: string;
  status: 'pending' | 'synced' | 'error';
  errorMessage?: string;
  location?: string;
};

function getMergedEvents(localEvents: LocalEvent[], serverEvents: Event[]): DisplayEvent[] {
  const eventMap = new Map<string, DisplayEvent>();

  // Ensure serverEvents is an array
  const events = Array.isArray(serverEvents) ? serverEvents : [];

  // Add server events (canonical, confirmed)
  for (const event of events) {
    eventMap.set(event.id, {
      id: event.id,
      title: event.title,
      startTime: event.start_datetime,
      status: 'synced',
      location: event.location?.name,
    });
  }

  // Add/overlay local events (may be pending or have errors)
  for (const event of localEvents) {
    const existing = eventMap.get(event.eventId);
    if (existing) {
      // Server event exists, keep it but note if there's an error
      if (event.status === 'error') {
        existing.status = 'error';
        existing.errorMessage = event.errorMessage;
      }
    } else {
      // Only in local queue
      eventMap.set(event.id, {
        id: event.id,
        title: event.title,
        startTime: event.startTime,
        status: event.status,
        errorMessage: event.errorMessage,
      });
    }
  }

  // Sort by start time (upcoming first)
  return Array.from(eventMap.values()).sort((a, b) => {
    const dateA = new Date(a.startTime).getTime() || 0;
    const dateB = new Date(b.startTime).getTime() || 0;
    return dateA - dateB;
  });
}

// ============ Event Card Component ============

function EventCard({ event }: { event: DisplayEvent }) {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
    synced: { bg: 'bg-green-100', text: 'text-green-700', label: 'Registered' },
    error: { bg: 'bg-red-100', text: 'text-red-700', label: 'Error' },
  };

  const config = statusConfig[event.status];

  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-base font-semibold flex-1 mr-3">{event.title}</Text>
        <View className={`${config.bg} rounded-md px-2 py-1`}>
          <Text className={`${config.text} text-xs font-bold`}>{config.label}</Text>
        </View>
      </View>

      <View className="gap-1">
        <Text className="text-sm text-gray-500">
          {formatEventTime(event.startTime)}
        </Text>
        {event.location && (
          <Text className="text-sm text-gray-500">{event.location}</Text>
        )}
        {event.status === 'error' && event.errorMessage && (
          <Text className="text-sm text-red-500 mt-1">{event.errorMessage}</Text>
        )}
      </View>
    </View>
  );
}
