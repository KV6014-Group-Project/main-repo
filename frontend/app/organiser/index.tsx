import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function OrganiserHome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <Text className="text-3xl font-bold text-center mt-5 mb-2">Organiser Dashboard</Text>
        <Text className="text-sm text-gray-500 text-center mb-8">Manage your events</Text>

        <View className="bg-neutral-100 rounded-xl p-5 mb-5">
          <Text className="text-lg font-semibold mb-2">Your Events</Text>
          <Text className="text-sm text-gray-500">No events yet. Create one to get started.</Text>
        </View>

        <TouchableOpacity 
          className="bg-[#28B900] p-4 rounded-xl items-center mb-3" 
          onPress={() => router.push('/organiser/organiserevent')}
        >
          <Text className="text-white text-base font-semibold">View Event Details</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-[#28B900] p-4 rounded-xl items-center mb-3" 
          onPress={() => router.push('/organiser/organiserdashboard')}
        >
          <Text className="text-white text-base font-semibold">Dashboard View</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-[#28B900] p-4 rounded-xl items-center mb-3" 
          onPress={() => router.push('/organiser/impactorganiser')}
        >
          <Text className="text-white text-base font-semibold">View Impact</Text>
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
