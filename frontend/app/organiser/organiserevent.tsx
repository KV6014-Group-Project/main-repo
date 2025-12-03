import React from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function OrganiserEvent() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <View className="bg-neutral-300 rounded-xl p-6 mb-5">
          <Text className="text-xl font-bold">Health Screening - Yang Community</Text>
        </View>

        <View className="bg-neutral-300 rounded-xl p-5 mb-5">
          <Text className="text-sm font-bold mb-1">Date</Text>
          <Text className="text-sm mb-4">Saturday, Nov 21st</Text>

          <Text className="text-sm font-bold mb-1">Time</Text>
          <Text className="text-sm mb-4">2:00 PM</Text>

          <Text className="text-sm font-bold mb-1">Location</Text>
          <Text className="text-sm">Community Hall</Text>
        </View>

        <View className="bg-neutral-100 rounded-xl p-4 mb-5">
          <Text className="text-base font-bold mb-2">About This Event</Text>
          <Text className="text-sm text-gray-700">
            A free health screening and wellness event for women in the community.
          </Text>
        </View>

        <View className="bg-[#D5E0CB] rounded-xl p-4 mb-5">
          <Text className="text-base font-bold">10 people</Text>
          <Text className="text-sm text-gray-700">registered via your link</Text>
        </View>

        <TouchableOpacity className="bg-[#F88080] rounded-xl p-4 items-center mb-3">
          <Text className="text-white text-base font-bold">View Your Share Link</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#48C44B] rounded-xl p-4 items-center mb-3">
          <Text className="text-white text-base font-bold">Share On WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-neutral-200 rounded-xl p-4 items-center mb-5">
          <Text className="text-base font-medium">Download Poster</Text>
        </TouchableOpacity>

        <TouchableOpacity className="p-4 items-center" onPress={() => router.back()}>
          <Text className="text-blue-500 text-base">← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
