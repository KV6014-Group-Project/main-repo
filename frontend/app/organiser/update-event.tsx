import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  updateEvent, 
  fetchEventStatuses, 
  fetchEvent,
  EventStatus,
  UpdateEventParams 
} from '../../lib/api';

export default function UpdateEvent() {
  const router = useRouter();
  
  // Form state
  const [eventId, setEventId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [capacity, setCapacity] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueRoom, setVenueRoom] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string>('');
  
  // Loading states
  const [statuses, setStatuses] = useState<EventStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatuses();
    loadEvent();
  }, []);

  async function loadStatuses() {
    try {
      const data = await fetchEventStatuses();
      setStatuses(data);
    } catch (err) {
      console.error('Failed to load statuses:', err);
      setError('Failed to load event statuses');
    } finally {
      setLoadingStatuses(false);
    }
  }

  async function loadEvent() {
    try {
      // Get eventId from route params
      const params = new URLSearchParams(window.location.search);
      const id = params.get('eventId');
      
      if (!id) {
        throw new Error('Event ID is required');
      }
      
      setEventId(id);
      const event = await fetchEvent(id);
      
      // Populate form with existing data
      setTitle(event.title);
      setDescription(event.description || '');
      
      // Parse datetime
      const startDateTime = new Date(event.start_datetime);
      const endDateTime = new Date(event.end_datetime);

      console.log(event)
      
      setStartDate(startDateTime.toISOString().split('T')[0]);
      setStartTime(startDateTime.toTimeString().slice(0, 5));
      setEndDate(endDateTime.toISOString().split('T')[0]);
      setEndTime(endDateTime.toTimeString().slice(0, 5));
      
      setCapacity(event.capacity?.toString() || '');
      setVenueName(event.location?.name || '');
      setVenueRoom(event.location?.room || '');
      setVenueAddress(event.location?.address || '');
      setIsPrivate(event.is_private || false);
      setSelectedStatusId(event.status.id || '');
      
    } catch (err) {
      console.error('Failed to load event:', err);
      setError('Failed to load event details');
    } finally {
      setLoadingEvent(false);
    }
  }

  function validateForm(): string | null {
    // Validate only if fields are provided
    if (title.trim() && title.trim().length < 3) {
      return 'Title must be at least 3 characters';
    }
    
    // Validate date/time format if provided
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;
    
    if (startDate && !dateRegex.test(startDate)) {
      return 'Start date format should be YYYY-MM-DD';
    }
    if (startTime && !timeRegex.test(startTime)) {
      return 'Start time format should be HH:MM';
    }
    if (endDate && !dateRegex.test(endDate)) {
      return 'End date format should be YYYY-MM-DD';
    }
    if (endTime && !timeRegex.test(endTime)) {
      return 'End time format should be HH:MM';
    }
    
    // Validate capacity format if provided
    const capacityRegex = /^\d+$/;
    if (capacity && !capacityRegex.test(capacity)) {
      return 'Capacity format should be a number';
    }

    return null;
  }

  async function handleUpdate() {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params: UpdateEventParams = {};
      
      // Only include fields that have been modified
      if (title.trim()) params.title = title.trim();
      if (description.trim()) params.description = description.trim();
      
      if (startDate && startTime) {
        params.start_datetime = `${startDate}T${startTime}:00`;
      }
      if (endDate && endTime) {
        params.end_datetime = `${endDate}T${endTime}:00`;
      }
      
      if (capacity) params.capacity = capacity;
      
      // Only include location if at least one field is provided
      if (venueName.trim() || venueRoom.trim() || venueAddress.trim()) {
        params.location = {
          name: venueName.trim(),
          room: venueRoom.trim(),
          address: venueAddress.trim(),
        };
      }
      
      if (selectedStatusId) params.status = selectedStatusId;
      params.is_private = isPrivate;

      const event = await updateEvent(eventId, params);

      // Cross-platform alerts
      if (Platform.OS === 'web') {
        router.push(`/organiser/organiserevent?eventId=${event.id}` as any);
      } else {
        Alert.alert('Success', 'Event updated successfully!', [
          { text: 'OK', onPress: () => router.push(`/organiser/organiserevent?eventId=${event.id}` as any) }
        ]);
      }
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update event';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }

  if (loadingStatuses || loadingEvent) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#28B900" />
        <Text className="mt-4 text-gray-500">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <Text className="text-2xl font-bold text-center mb-6">Edit Event</Text>

        {error && (
          <View className="bg-red-100 p-3 rounded-lg mb-4">
            <Text className="text-red-700">{error}</Text>
          </View>
        )}

        {/* Title */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2">Event Title</Text>
          <TextInput
            className="bg-neutral-100 p-4 rounded-xl"
            placeholder="Enter event title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2">Description</Text>
          <TextInput
            className="bg-neutral-100 p-4 rounded-xl"
            placeholder="Describe your event"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Start Date/Time */}
        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <Text className="text-sm font-semibold mb-2">Start Date</Text>
            <TextInput
              className="bg-neutral-100 p-4 rounded-xl"
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-sm font-semibold mb-2">Start Time</Text>
            <TextInput
              className="bg-neutral-100 p-4 rounded-xl"
              placeholder="HH:MM"
              value={startTime}
              onChangeText={setStartTime}
            />
          </View>
        </View>

        {/* End Date/Time */}
        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <Text className="text-sm font-semibold mb-2">End Date</Text>
            <TextInput
              className="bg-neutral-100 p-4 rounded-xl"
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-sm font-semibold mb-2">End Time</Text>
            <TextInput
              className="bg-neutral-100 p-4 rounded-xl"
              placeholder="HH:MM"
              value={endTime}
              onChangeText={setEndTime}
            />
          </View>
        </View>

        {/* Capacity */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2">Capacity</Text>
          <TextInput
            className="bg-neutral-100 p-4 rounded-xl"
            placeholder="Enter capacity"
            value={capacity}
            onChangeText={setCapacity}
          />
        </View>

        {/* Location */}
        <View className="bg-neutral-50 p-4 rounded-xl mb-4">
          <Text className="text-base font-semibold mb-3">Location Details</Text>
          
          <View className="mb-3">
            <Text className="text-sm font-medium mb-1">Name</Text>
            <TextInput
              className="bg-white p-3 rounded-lg border border-neutral-200"
              placeholder="e.g., Community Hall"
              value={venueName}
              onChangeText={setVenueName}
            />
          </View>
          
          <View className="mb-3">
            <Text className="text-sm font-medium mb-1">Room</Text>
            <TextInput
              className="bg-white p-3 rounded-lg border border-neutral-200"
              placeholder="e.g., Main Hall"
              value={venueRoom}
              onChangeText={setVenueRoom}
            />
          </View>
          
          <View>
            <Text className="text-sm font-medium mb-1">Address</Text>
            <TextInput
              className="bg-white p-3 rounded-lg border border-neutral-200"
              placeholder="e.g., 123 Main Street"
              value={venueAddress}
              onChangeText={setVenueAddress}
            />
          </View>
        </View>

        {/* Status Selection */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2">Event Status</Text>
          <View className="flex-row flex-wrap">
            {statuses.map((status) => (
              <TouchableOpacity
                key={status.id}
                className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                  selectedStatusId === status.id
                    ? 'bg-[#28B900]'
                    : 'bg-neutral-200'
                }`}
                onPress={() => setSelectedStatusId(status.id)}
              >
                <Text
                  className={`text-sm font-medium capitalize ${
                    selectedStatusId === status.id ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {status.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Private Toggle */}
        <View className="flex-row items-center justify-between bg-neutral-100 p-4 rounded-xl mb-6">
          <View>
            <Text className="text-sm font-semibold">Private Event</Text>
            <Text className="text-xs text-gray-500">Only visible to invited participants</Text>
          </View>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: '#d1d5db', true: '#86efac' }}
            thumbColor={isPrivate ? '#28B900' : '#f4f3f4'}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className={`p-4 rounded-xl items-center mb-4 ${
            loading ? 'bg-gray-400' : 'bg-[#28B900]'
          }`}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base font-bold">Update Event</Text>
          )}
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          className="p-4 items-center"
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text className="text-blue-500 text-base">← Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}