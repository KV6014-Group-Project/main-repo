import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, Stack } from 'expo-router';

export default function OrganiserLogin() {
  const router = useRouter();

  const handleLogin = () => {
    // Clear stack and set organiser home as root
    router.replace('/organiser');
  };

  const handleBack = () => {
    router.back();
  };

  const handleSignup = () => {
    router.push('/auth/organiser-signup');
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white p-5">
        <Text className="text-2xl font-bold text-center mt-12">Organiser Login</Text>
        <Text className="text-sm text-center mb-10 text-gray-500">Create and manage events with full control.</Text>

        <TextInput placeholder="Email" className="border border-gray-300 p-3 rounded-lg mb-5 text-base" />
        <TextInput placeholder="Password" secureTextEntry className="border border-gray-300 p-3 rounded-lg mb-5 text-base" />

        <View className="flex-row justify-between my-2.5">
          <Text>Remember me</Text>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text className="text-blue-500">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="bg-[#28B900] p-4 rounded-lg items-center mt-2.5" onPress={handleLogin}>
          <Text className="text-white text-base font-bold">LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignup} className="mt-5">
          <Text className="text-center text-gray-700">Don't have an account? Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBack} className="mt-8">
          <Text className="text-center text-blue-500 text-base">← Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}
