import React from 'react';
import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-lg mb-4">This screen doesn't exist.</Text>
        <Link href="/">
          <Text className="text-blue-500 text-base">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
