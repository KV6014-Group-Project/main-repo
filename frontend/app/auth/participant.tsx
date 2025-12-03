import React from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter, Stack } from "expo-router";

export default function ParticipantScreen() {
  const router = useRouter();

  const handleContinue = () => {
    // Clear stack and set participant home as root
    router.replace('/participant');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1" contentContainerClassName="p-6">
          <Text className="text-2xl font-bold text-center mt-10 mb-2">Participant Registration</Text>
          <Text className="text-sm text-center text-gray-500 mb-10">Join events in your community</Text>

          <View className="mb-5">
            <Text className="text-base font-medium mb-2 text-gray-700">First Name</Text>
            <TextInput className="border border-gray-300 p-3 rounded-lg text-base" placeholder="Enter first name" />
          </View>

          <View className="mb-5">
            <Text className="text-base font-medium mb-2 text-gray-700">Last Name</Text>
            <TextInput className="border border-gray-300 p-3 rounded-lg text-base" placeholder="Enter last name" />
          </View>

          <View className="mb-5">
            <Text className="text-base font-medium mb-2 text-gray-700">Email</Text>
            <TextInput className="border border-gray-300 p-3 rounded-lg text-base" placeholder="Enter email" keyboardType="email-address" />
          </View>

          <View className="mb-5">
            <Text className="text-base font-medium mb-2 text-gray-700">Phone (optional)</Text>
            <TextInput className="border border-gray-300 p-3 rounded-lg text-base" placeholder="Enter phone number" keyboardType="phone-pad" />
          </View>

          <TouchableOpacity className="bg-[#28B900] p-4 rounded-xl items-center mt-5" onPress={handleContinue}>
            <Text className="text-white text-lg font-bold">Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBack} className="mt-8">
            <Text className="text-center text-blue-500 text-base">← Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
