import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ParticipantHome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <Text className="text-3xl font-bold text-center mt-5 mb-2">Participant Profile</Text>
        <Text className="text-sm text-gray-500 text-center mb-8">Your event participation details</Text>

        <View className="bg-neutral-100 rounded-xl p-5 mb-5">
          <Text className="text-lg font-semibold mb-4">Your Info</Text>
          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-1">Name</Text>
            <Text className="text-base">John Doe</Text>
          </View>
          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-1">Email</Text>
            <Text className="text-base">john@example.com</Text>
          </View>
        </View>

        <View className="bg-neutral-100 rounded-xl p-5 mb-5">
          <Text className="text-lg font-semibold mb-4">Your Upcoming Event</Text>
          <View className="bg-neutral-100 rounded-xl p-4 mt-3">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-semibold flex-1 mr-3">Medical Screening - Community Hall</Text>
              <View className="bg-[#28B900] rounded-md px-2 py-1">
                <Text className="text-white text-xs font-bold">DEC 15</Text>
              </View>
            </View>
            <View className="gap-1">
              <Text className="text-sm text-gray-500">📍 Community Hall, Main Street</Text>
              <Text className="text-sm text-gray-500">🕐 10:00 AM - 2:00 PM</Text>
              <Text className="text-sm text-gray-500">👥 Registered: Yes</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-neutral-200 p-4 rounded-xl items-center mt-5" 
          onPress={() => router.push('/participant/qr-code-page')}
        >
          <Text className="text-gray-700 text-base font-semibold">Add Event with QR</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-neutral-200 p-4 rounded-xl items-center mt-5" 
          onPress={() => router.replace('/welcome')}
        >
          <Text className="text-gray-700 text-base font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
