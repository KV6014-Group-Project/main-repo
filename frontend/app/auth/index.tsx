import * as React from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
import { useParticipant } from "../../lib/ParticipantContext";

export default function AuthIndexScreen() {
  const router = useRouter();
  const { user, isHydrated } = useAuth();
  const { profile, isLoading: participantLoading } = useParticipant();

  React.useEffect(() => {
    if (!isHydrated || participantLoading) {
      return;
    }

    if (profile) {
      router.replace("/participant");
      return;
    }

    const roleName = user?.role?.name?.toLowerCase();
    if (roleName === "organiser") {
      router.replace("/organiser");
      return;
    }

    if (roleName === "promoter") {
      router.replace("/promoter");
      return;
    }
  }, [isHydrated, participantLoading, profile, user, router]);

  if (!isHydrated || participantLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#28B900" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView contentContainerClassName="flex-grow px-8 pb-8 pt-52 gap-6 justify-start">
          <TouchableOpacity
            className="bg-[#28B900] py-5 rounded-2xl items-center"
            onPress={() => router.push("/auth/participant")}
          >
            <Text className="text-white text-lg font-semibold tracking-wide">CONTINUE AS PARTICIPANT</Text>
            <Text className="text-[#E8F7E6] text-sm mt-1.5">Add and manage your events</Text>
          </TouchableOpacity>

          <View className="bg-neutral-100 rounded-2xl p-4">
            <Text className="text-sm text-center mb-3 text-gray-500 font-medium">Need organiser tools?</Text>
            <View className="flex-col gap-3">
              <TouchableOpacity
                className="py-3.5 px-4 rounded-xl border border-neutral-200 bg-neutral-100"
                onPress={() => router.push("/auth/organiser-login")}
              >
                <Text className="text-base font-semibold">Organiser</Text>
                <Text className="text-sm text-gray-400 mt-1">Create events and track impact</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="py-3.5 px-4 rounded-xl border border-neutral-200 bg-neutral-100"
                onPress={() => router.push("/auth/promoter-login")}
              >
                <Text className="text-base font-semibold">Promoter</Text>
                <Text className="text-sm text-gray-400 mt-1">Share events with your community</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
