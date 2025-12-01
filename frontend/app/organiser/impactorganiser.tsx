import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OrganiserImpact() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>JOHN DOE</Text>
          <Text style={styles.headerSubtitle}>Your efforts are helping your community stay healthy.</Text>
        </View>

        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>YOUR TOTAL IMPACT</Text>
          
          <View style={styles.impactRow}>
            <Text style={[styles.impactNumber, { color: '#D9534F' }]}>120</Text>
            <Text style={styles.impactLabel}>Participants Registered</Text>
          </View>
          
          <View style={styles.impactRow}>
            <Text style={[styles.impactNumber, { color: '#009412' }]}>250</Text>
            <Text style={styles.impactLabel}>WhatsApp Shares</Text>
          </View>
          
          <View style={styles.impactRow}>
            <Text style={[styles.impactNumber, { color: '#C70000' }]}>10</Text>
            <Text style={styles.impactLabel}>Events Promoted</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgesRow}>
          <View style={[styles.badge, { backgroundColor: '#EF8B8B' }]}>
            <Text style={styles.badgeText}>Community Connector</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#78C857' }]}>
            <Text style={styles.badgeText}>Top Sharer</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Events</Text>
        
        <View style={styles.eventRow}>
          <Text style={styles.eventTitle}>Health Screening – Community Hall</Text>
          <Text style={styles.eventCount}>50</Text>
        </View>
        
        <View style={styles.eventRow}>
          <Text style={styles.eventTitle}>Women Wellness Workshop</Text>
          <Text style={styles.eventCount}>30</Text>
        </View>

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
    padding: 20,
  },
  header: {
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
  },
  impactCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  impactLabel: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  badge: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eventRow: {
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  eventCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
