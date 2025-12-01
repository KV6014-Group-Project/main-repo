import React from "react";
import { SafeAreaView, View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../assets/rose.png")}
          resizeMode="contain"
          style={styles.logo}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth")}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  button: {
    width: "70%",
    backgroundColor: "#2C2C2C",
    borderRadius: 10,
    paddingVertical: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});
