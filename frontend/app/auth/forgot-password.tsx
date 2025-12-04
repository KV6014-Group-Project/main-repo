import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const handleSendReset = () => {
    // In a real app, this would send a reset email
    // For now, just go back to the previous screen
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 p-6 items-center">
          <Image
            source={require('../../assets/rose.png')}
            resizeMode="contain"
            className="w-24 h-24 mt-10 mb-8"
          />

          <Text className="text-2xl font-bold mb-2.5">Reset Password</Text>
          <Text className="text-sm text-gray-500 text-center mb-8">
            Enter your email and we'll send you a reset link
          </Text>

          <TextInput
            className="w-full border border-gray-300 p-3.5 rounded-lg text-base mb-5"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity className="w-full bg-[#28B900] p-4 rounded-xl items-center" onPress={handleSendReset}>
            <Text className="text-white text-lg font-bold">Send Reset Link</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBack} className="mt-8">
            <Text className="text-blue-500 text-base">← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
