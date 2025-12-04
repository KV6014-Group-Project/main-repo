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
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  createEvent, 
  fetchEventStatuses, 
  EventStatus,
  CreateEventParams 
} from '../lib/api';

export default function CreateEvent() {
  const router = useRouter();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueRoom, setVenueRoom] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string>('');
  
  // Loading states
  const [statuses, setStatuses] = useState<EventStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatuses();
  }, []);

  async function loadStatuses() {
    try {
      const data = await fetchEventStatuses();
      setStatuses(data);
      // Default to first status (likely 'draft')
      if (data.length > 0) {
        const draftStatus = data.find(s => s.name === 'draft') || data[0];
        setSelectedStatusId(draftStatus.id);
      }
    } catch (err) {
      console.error('Failed to load statuses:', err);
      setError('Failed to load event statuses');
    } finally {
      setLoadingStatuses(false);
    }
  }

  function validateForm(): string | null {
    if (!title.trim()) return 'Title is required';
    if (title.trim().length < 3) return 'Title must be at least 3 characters';
    if (!startDate.trim()) return 'Start date is required (YYYY-MM-DD)';
    if (!startTime.trim()) return 'Start time is required (HH:MM)';
    if (!endDate.trim()) return 'End date is required (YYYY-MM-DD)';
    if (!endTime.trim()) return 'End time is required (HH:MM)';
    if (!venueName.trim()) return 'Venue name is required';
    if (!selectedStatusId) return 'Event status is required';
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;
    
    if (!dateRegex.test(startDate)) return 'Start date format should be YYYY-MM-DD';
    if (!timeRegex.test(startTime)) return 'Start time format should be HH:MM';
    if (!dateRegex.test(endDate)) return 'End date format should be YYYY-MM-DD';
    if (!timeRegex.test(endTime)) return 'End time format should be HH:MM';
    
    return null;
  }

  async function handleCreate() {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params: CreateEventParams = {
        title: title.trim(),
        description: description.trim(),
        start_datetime: `${startDate}T${startTime}:00`,
        end_datetime: `${endDate}T${endTime}:00`,
        venue: {
          name: venueName.trim(),
          room: venueRoom.trim(),
          address: venueAddress.trim(),
        },
        status: selectedStatusId,
        is_private: isPrivate,
      };

      const event = await createEvent(params);
      Alert.alert('Success', 'Event created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create event';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }

  if (loadingStatuses) {
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
        <Text className="text-2xl font-bold text-center mb-6">Create Event</Text>

        {error && (
          <View className="bg-red-100 p-3 rounded-lg mb-4">
            <Text className="text-red-700">{error}</Text>
          </View>
        )}

        {/* Title */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2">Event Title *</Text>
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
            <Text className="text-sm font-semibold mb-2">Start Date *</Text>
            <TextInput
              className="bg-neutral-100 p-4 rounded-xl"
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-sm font-semibold mb-2">Start Time *</Text>
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
            <Text className="text-sm font-semibold mb-2">End Date *</Text>
            <TextInput
              className="bg-neutral-100 p-4 rounded-xl"
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-sm font-semibold mb-2">End Time *</Text>
            <TextInput
              className="bg-neutral-100 p-4 rounded-xl"
              placeholder="HH:MM"
              value={endTime}
              onChangeText={setEndTime}
            />
          </View>
        </View>

        {/* Venue */}
        <View className="bg-neutral-50 p-4 rounded-xl mb-4">
          <Text className="text-base font-semibold mb-3">Venue Details</Text>
          
          <View className="mb-3">
            <Text className="text-sm font-medium mb-1">Venue Name *</Text>
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
          <Text className="text-sm font-semibold mb-2">Event Status *</Text>
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
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base font-bold">Create Event</Text>
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
