import "../global.css";
import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text } from 'react-native';

export { ErrorBoundary } from 'expo-router';

function BackButtonOverlay() {
  const router = useRouter();

  if (!router.canGoBack()) {
    return null;
  }

  return (
    <Pressable
      className="absolute top-10 left-4 z-20 bg-black/5 px-3.5 py-2 rounded-full active:bg-black/10"
      onPress={router.back}
    >
      <Text className="text-sm font-semibold text-gray-900">← Back</Text>
    </Pressable>
  );
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <BackButtonOverlay />
    </>
  );
}
