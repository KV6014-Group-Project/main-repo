import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';

export default function OrganiserProfile() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace('/');
  }

  const displayName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
    : 'Organiser';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <View className="bg-neutral-300 rounded-2xl p-6 mb-5">
          <Text className="text-3xl font-bold text-center">{displayName}</Text>
          {!!user?.email && (
            <Text className="text-sm text-gray-600 text-center mt-2">{user.email}</Text>
          )}
          {!!user?.phone && (
            <Text className="text-sm text-gray-600 text-center mt-1">{user.phone}</Text>
          )}
        </View>

        <View className="bg-neutral-100 rounded-2xl p-5 mb-6">
          <Text className="text-sm font-bold mb-2">Account</Text>
          <Text className="text-sm text-gray-700">Role: {user?.role?.name ?? 'organiser'}</Text>
          {!!user?.date_joined && (
            <Text className="text-sm text-gray-700 mt-1">Joined: {new Date(user.date_joined).toLocaleDateString()}</Text>
          )}
        </View>

        <TouchableOpacity
          className="bg-neutral-200 p-4 rounded-xl items-center"
          onPress={handleSignOut}
        >
          <Text className="text-gray-700 text-base font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
