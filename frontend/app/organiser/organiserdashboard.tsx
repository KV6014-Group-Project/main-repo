import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OrganiserDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>JOHN DOE</Text>
        </View>

        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>Your Impact This Month</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Participants</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>120</Text>
              <Text style={styles.statLabel}>Shares</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Active Events</Text>

        <TouchableOpacity style={styles.eventCard}>
          <Text style={styles.eventTitle}>Health Screening - Community Hall</Text>
          <Text style={styles.eventDate}>Saturday, Oct 21st</Text>
          <Text style={styles.eventTime}>2:00 PM</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.eventCard}>
          <Text style={styles.eventTitle}>Charity Walk - Riverside Park</Text>
          <Text style={styles.eventDate}>Sunday, Nov 5th</Text>
          <Text style={styles.eventTime}>10:00 AM</Text>
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
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  impactCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#333',
  },
  eventTime: {
    fontSize: 14,
    color: '#333',
  },
  backButton: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
