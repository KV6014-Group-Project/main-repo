import React from 'react';
import { Stack } from 'expo-router';

export default function OrganiserLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
