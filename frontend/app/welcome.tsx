import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Image, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../lib/AuthContext";
import { useParticipant } from "../lib/ParticipantContext";

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, isHydrated } = useAuth();
  const { profile, isLoading: participantLoading } = useParticipant();
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
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

    setCheckingRole(false);
  }, [isHydrated, participantLoading, profile, user, router]);

  if (checkingRole) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#28B900" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Image
          source={require("../assets/rose.png")}
          resizeMode="contain"
          className="w-72 h-72 mb-10"
        />

        <TouchableOpacity
          className="w-[70%] bg-neutral-800 rounded-xl py-4"
          onPress={() => router.push("/auth")}
        >
          <Text className="text-white text-lg text-center font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
