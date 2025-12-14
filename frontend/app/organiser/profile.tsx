import React, { useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';

export default function OrganiserProfile() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const displayName = useMemo(() => {
    if (!user) return 'Organiser';
    const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return name || user.email;
  }, [user]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      router.replace('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      Alert.alert('Error', message);
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <View className="bg-neutral-300 rounded-2xl p-6 mb-5">
          <Text className="text-2xl font-bold">{displayName}</Text>
          {user?.email ? <Text className="text-sm text-gray-600 mt-2">{user.email}</Text> : null}
          {user?.role?.name ? (
            <Text className="text-xs text-gray-500 mt-1">Role: {user.role.name}</Text>
          ) : null}
        </View>

        <View className="bg-neutral-100 rounded-2xl p-5 mb-6">
          <Text className="text-sm font-bold mb-4">Account</Text>

          <View className="flex-row justify-between mb-3">
            <Text className="text-sm text-gray-600">First name</Text>
            <Text className="text-sm font-medium">{user?.first_name || '-'}</Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-sm text-gray-600">Last name</Text>
            <Text className="text-sm font-medium">{user?.last_name || '-'}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-600">Phone</Text>
            <Text className="text-sm font-medium">{user?.phone || '-'}</Text>
          </View>
        </View>

        <TouchableOpacity
          className={`rounded-xl p-4 items-center ${signingOut ? 'bg-gray-300' : 'bg-neutral-200'}`}
          onPress={handleSignOut}
          disabled={signingOut}
        >
          <Text className="text-gray-700 text-base font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
