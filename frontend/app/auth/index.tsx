import React from "react";
import { SafeAreaView, ScrollView, View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function AuthIndexScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Image
          source={require("../../assets/rose.png")}
          resizeMode="contain"
          style={styles.logo}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>PICK YOUR ROLE</Text>
        </View>

        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => router.push("/auth/staff-login")}
        >
          <Text style={styles.roleText}>ROSE STAFF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => router.push("/auth/leader-login")}
        >
          <Text style={styles.roleText}>COMMUNITY LEADER</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => router.push("/auth/participant")}
        >
          <Text style={styles.roleText}>PARTICIPANT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  logo: {
    width: 70,
    height: 70,
    marginTop: 60,
    marginBottom: 60,
    marginLeft: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    color: "#000000",
    fontSize: 28,
    fontWeight: "bold",
  },
  roleButton: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 40,
    marginHorizontal: 36,
    marginBottom: 20,
  },
  roleText: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "500",
  },
});
