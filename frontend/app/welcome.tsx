import React from "react";
import { SafeAreaView, View, Image, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

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
