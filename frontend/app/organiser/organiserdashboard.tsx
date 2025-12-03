import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function OrganiserDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="bg-neutral-300 rounded-xl p-6 items-center mb-4">
          <Text className="text-3xl font-bold">JOHN DOE</Text>
        </View>

        <View className="bg-neutral-100 rounded-xl p-5 mb-6">
          <Text className="text-sm font-bold mb-4">Your Impact This Month</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-3xl font-bold">48</Text>
              <Text className="text-xs text-gray-500 mt-1">Participants</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold">3</Text>
              <Text className="text-xs text-gray-500 mt-1">Events</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold">120</Text>
              <Text className="text-xs text-gray-500 mt-1">Shares</Text>
            </View>
          </View>
        </View>

        <Text className="text-base font-bold mb-4">Active Events</Text>

        <TouchableOpacity className="bg-neutral-300 rounded-xl p-4 mb-3">
          <Text className="text-sm font-bold mb-1">Health Screening - Community Hall</Text>
          <Text className="text-sm text-gray-700">Saturday, Oct 21st</Text>
          <Text className="text-sm text-gray-700">2:00 PM</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-neutral-300 rounded-xl p-4 mb-3">
          <Text className="text-sm font-bold mb-1">Charity Walk - Riverside Park</Text>
          <Text className="text-sm text-gray-700">Sunday, Nov 5th</Text>
          <Text className="text-sm text-gray-700">10:00 AM</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-5 p-4 items-center" onPress={() => router.back()}>
          <Text className="text-blue-500 text-base">← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
