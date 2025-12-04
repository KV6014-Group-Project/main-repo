import "../global.css";
import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { hydrateAuthSession, hasHydratedAuth } from './lib/authState';
import ServerStatusIndicator from './components/ServerStatusIndicator';

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
  const [authReady, setAuthReady] = React.useState(hasHydratedAuth());

  React.useEffect(() => {
    if (authReady) {
      return;
    }

    hydrateAuthSession().finally(() => setAuthReady(true));
  }, [authReady]);

  if (!authReady) {
    return (
      <View className="flex-1 items-center justify-center">
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#28B900" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <View className="flex-1 max-w-2xl mx-auto w-full">
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <ServerStatusIndicator />
      </View>
    </>
  );
}
