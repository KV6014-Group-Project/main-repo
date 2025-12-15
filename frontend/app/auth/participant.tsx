import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useParticipant } from "../../lib/ParticipantContext";

export default function ParticipantScreen() {
  const router = useRouter();
  const { profile, saveProfile, isLoading, otpVerified, setOtpVerified } = useParticipant();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && profile) {
      if (!otpVerified) {
        router.replace('/auth/participant-otp' as any);
        return;
      }

      router.replace("/participant");
    }
  }, [isLoading, otpVerified, profile, router]);

  const handleContinue = async () => {
    // Basic validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      Alert.alert("Missing Information", "Please fill in your first name, last name, email, and phone number.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await setOtpVerified(false);

      await saveProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      // Navigate to OTP step
      router.replace('/auth/participant-otp' as any);
    } catch (error) {
      Alert.alert("Error", "Failed to save your profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading || profile) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView className="flex-1 bg-white items-center justify-center">
          <ActivityIndicator size="large" color="#28B900" />
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1" contentContainerClassName="p-6">
          <Text className="text-2xl font-bold text-center mt-10 mb-2">Participant Registration</Text>
          <Text className="text-sm text-center text-gray-500 mb-10">Join events in your community</Text>

          <View className="mb-5">
            <Text className="text-base font-medium mb-2 text-gray-700">First Name</Text>
            <TextInput
              className="border border-gray-300 p-3 rounded-lg text-base"
              placeholder="Enter first name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          <View className="mb-5">
            <Text className="text-base font-medium mb-2 text-gray-700">Last Name</Text>
            <TextInput
              className="border border-gray-300 p-3 rounded-lg text-base"
              placeholder="Enter last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          <View className="mb-5">
            <Text className="text-base font-medium mb-2 text-gray-700">Email</Text>
            <TextInput
              className="border border-gray-300 p-3 rounded-lg text-base"
              placeholder="Enter email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className="mb-5">
            <Text className="text-base font-medium mb-2 text-gray-700">Phone</Text>
            <TextInput
              className="border border-gray-300 p-3 rounded-lg text-base"
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <TouchableOpacity
            className={`p-4 rounded-xl items-center mt-5 ${isSubmitting ? 'bg-gray-400' : 'bg-[#28B900]'}`}
            onPress={handleContinue}
            disabled={isSubmitting}
          >
            <Text className="text-white text-lg font-bold">
              {isSubmitting ? "Saving..." : "Continue"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBack} className="mt-8">
            <Text className="text-center text-blue-500 text-base">← Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
