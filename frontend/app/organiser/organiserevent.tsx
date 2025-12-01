import React from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function OrganiserEvent() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Health Screening - Yang Community</Text>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>Saturday, Nov 21st</Text>

          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>2:00 PM</Text>

          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>Community Hall</Text>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About This Event</Text>
          <Text style={styles.aboutText}>
            A free health screening and wellness event for women in the community.
          </Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsBold}>10 people</Text>
          <Text style={styles.statsText}>registered via your link</Text>
        </View>

        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>View Your Share Link</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.whatsappButton}>
          <Text style={styles.whatsappButtonText}>Share On WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Download Poster</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
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
  scrollContent: {
    padding: 20,
  },
  header: {
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  detailsCard: {
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    marginBottom: 16,
  },
  aboutCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: "#333",
  },
  statsCard: {
    backgroundColor: "#D5E0CB",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  statsBold: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statsText: {
    fontSize: 13,
    color: "#333",
  },
  shareButton: {
    backgroundColor: "#F88080",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  whatsappButton: {
    backgroundColor: "#48C44B",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  whatsappButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  downloadButton: {
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  downloadButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  backButton: {
    padding: 16,
    alignItems: "center",
  },
  backText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
