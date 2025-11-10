import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, View, Image } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >

          {/* Single centered rose */}
          <Image
            source={require("../assets/rose.png")}
            resizeMode="contain"
            style={{
              width: 300,     // larger size
              height: 300,
              marginBottom: 40,
            }}
          />

          {/* Continue Button */}
          <Button
            onPress={handleGetStarted}
            size="lg"
            style={{
              width: "70%",
              backgroundColor: "#2C2C2C",
              borderRadius: 10,
              paddingVertical: 16,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 18, textAlign: "center" }}>
              Continue
            </Text>
          </Button>

        </View>
      </SafeAreaView>
    </>
  );
}
