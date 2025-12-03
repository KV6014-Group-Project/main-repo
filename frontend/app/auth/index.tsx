import * as React from 'react';
import { SafeAreaView, ScrollView, View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, Stack } from "expo-router";

export default function AuthIndexScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.primaryRoleButton}
            onPress={() => router.push("/auth/participant")}
          >
            <Text style={styles.primaryRoleText}>CONTINUE AS PARTICIPANT</Text>
            <Text style={styles.primaryHint}>Add and manage your events</Text>
          </TouchableOpacity>

          <View style={styles.secondaryGroup}>
            <Text style={styles.secondaryLabel}>Need organiser tools?</Text>
            <View style={styles.secondaryButtons}>
              <TouchableOpacity
                style={styles.secondaryRoleButton}
                onPress={() => router.push("/auth/organiser-login")}
              >
                <Text style={styles.secondaryText}>Organiser</Text>
                <Text style={styles.secondaryHint}>Create events and track impact</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryRoleButton}
                onPress={() => router.push("/auth/promoter-login")}
              >
                <Text style={styles.secondaryText}>Promoter</Text>
                <Text style={styles.secondaryHint}>Share events with your community</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingBottom: 32,
    paddingTop: 200,
    gap: 24,
    justifyContent: "flex-start",
  },
  header: {
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  lede: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 12,
  },
  primaryRoleButton: {
    backgroundColor: "#28B900",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryRoleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  primaryHint: {
    color: "#E8F7E6",
    fontSize: 13,
    marginTop: 6,
  },
  secondaryGroup: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 16,
  },
  secondaryLabel: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
    color: "#666",
    fontWeight: "500",
  },
  secondaryButtons: {
    flexDirection: "column",
    gap: 12,
  },
  secondaryRoleButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F8F8F8",
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryHint: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
});
