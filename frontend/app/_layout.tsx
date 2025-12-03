import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, StyleSheet } from 'react-native';

export { ErrorBoundary } from 'expo-router';

function BackButtonOverlay() {
  const router = useRouter();

  if (!router.canGoBack()) {
    return null;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.backButton,
        pressed && styles.backButtonPressed,
      ]}
      onPress={router.back}
    >
      <Text style={styles.backButtonText}>← Back</Text>
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

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  backButtonPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
});
