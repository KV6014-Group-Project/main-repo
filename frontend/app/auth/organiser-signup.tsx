import * as React from 'react';
import { Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, Stack } from 'expo-router';

export default function OrganiserSignup() {
  const router = useRouter();

  const handleSignup = () => {
    // Clear stack and set organiser home as root
    router.replace('/organiser');
  };

  const handleLogin = () => {
    router.push('/auth/organiser-login');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white p-5">
        <Text className="text-2xl font-bold text-center mt-12 mb-10">Organiser Sign Up</Text>

        <TextInput placeholder="First Name" className="border border-gray-300 p-3 rounded-lg mb-4 text-base" />
        <TextInput placeholder="Last Name" className="border border-gray-300 p-3 rounded-lg mb-4 text-base" />
        <TextInput placeholder="Email" className="border border-gray-300 p-3 rounded-lg mb-4 text-base" keyboardType="email-address" />
        <TextInput placeholder="Password" secureTextEntry className="border border-gray-300 p-3 rounded-lg mb-4 text-base" />
        <TextInput placeholder="Confirm Password" secureTextEntry className="border border-gray-300 p-3 rounded-lg mb-4 text-base" />

        <TouchableOpacity className="bg-[#28B900] p-4 rounded-lg items-center mt-2.5" onPress={handleSignup}>
          <Text className="text-white text-base font-bold">SIGN UP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} className="mt-5">
          <Text className="text-center text-gray-700">Already have an account? Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBack} className="mt-8">
          <Text className="text-center text-blue-500 text-base">← Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}
