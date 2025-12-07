import "../global.css";
import React, { useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './lib/AuthContext';
import ServerStatusIndicator from './components/ServerStatusIndicator';
import BottomNav from './components/BottomNav';

export { ErrorBoundary } from 'expo-router';

// Prevent splash screen from auto-hiding until we finish loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  const onAuthHydrated = useCallback(async () => {
    // Auth is ready, hide splash screen and show app
    setAppReady(true);
    await SplashScreen.hideAsync();
  }, []);

  // Show loading indicator while auth is hydrating
  // (Splash screen is still visible, this is a fallback)
  if (!appReady) {
    return (
      <SafeAreaProvider>
        <AuthProvider onHydrated={onAuthHydrated}>
          <View className="flex-1 items-center justify-center bg-white">
            <StatusBar style="dark" />
            <ActivityIndicator size="large" color="#28B900" />
          </View>
        </AuthProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider onHydrated={onAuthHydrated}>
        <StatusBar style="dark" />
        <View className="flex-1 max-w-2xl mx-auto w-full">
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <ServerStatusIndicator />
          <BottomNav />
        </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
