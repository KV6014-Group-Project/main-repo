import * as React from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
import { useParticipant } from "../../lib/ParticipantContext";

export default function AuthIndexScreen() {
  const router = useRouter();
  const { user, isHydrated, otpVerified } = useAuth();
  const { profile, isLoading: participantLoading } = useParticipant();
  const [showOrganiserOptions, setShowOrganiserOptions] = React.useState(false);

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
      if (!otpVerified) {
        router.replace({ pathname: '/auth/email-otp' as any, params: { role: 'organiser' } } as any);
        return;
      }

      router.replace("/organiser");
      return;
    }

    if (roleName === "promoter") {
      if (!otpVerified) {
        router.replace({ pathname: '/auth/email-otp' as any, params: { role: 'promoter' } } as any);
        return;
      }

      router.replace("/promoter");
      return;
    }
  }, [isHydrated, participantLoading, profile, user, router, otpVerified]);

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
            className="bg-[#28B900] py-8 rounded-3xl items-center shadow-lg shadow-[#28B900]/30 active:shadow-md"
            onPress={() => router.push("/auth/participant")}
          >
            <Text className="text-white text-2xl font-bold tracking-wide">CONTINUE AS PARTICIPANT</Text>
            <Text className="text-[#E8F7E6] text-base mt-2 font-medium">Add and manage your events</Text>
          </TouchableOpacity>

          {!showOrganiserOptions ? (
            <TouchableOpacity
              className="bg-neutral-100 rounded-2xl p-4 items-center"
              onPress={() => setShowOrganiserOptions(true)}
            >
              <Text className="text-sm text-center text-gray-500 font-medium">Not a Participant?</Text>
              <Text className="text-xs text-center text-gray-400 mt-1">Tap to reveal organiser & promoter options</Text>
            </TouchableOpacity>
          ) : (
            <View className="bg-neutral-100 rounded-2xl p-4">
              <Text className="text-sm text-center mb-3 text-gray-500 font-medium">Not a Participant?</Text>
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
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
