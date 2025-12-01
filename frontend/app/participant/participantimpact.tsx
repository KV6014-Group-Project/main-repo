import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ParticipantImpact() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>JOHN DOE</Text>
        </View>

        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>YOUR TOTAL IMPACT</Text>
          
          <View style={styles.impactRow}>
            <Text style={[styles.impactNumber, { color: '#C70000' }]}>57</Text>
            <Text style={styles.impactLabel}>Participants Registered</Text>
          </View>
          
          <View style={styles.impactRow}>
            <Text style={[styles.impactNumber, { color: '#009013' }]}>19</Text>
            <Text style={styles.impactLabel}>WhatsApp Shares</Text>
          </View>
          
          <View style={styles.impactRow}>
            <Text style={[styles.impactNumber, { color: '#C70000' }]}>5</Text>
            <Text style={styles.impactLabel}>Events Attended</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgesRow}>
          <View style={[styles.badge, { backgroundColor: '#F27E7E' }]}>
            <Text style={styles.badgeText}>Community Connector</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#8BC34A' }]}>
            <Text style={styles.badgeText}>Top Sharer</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Events Attended</Text>
        
        <View style={styles.eventRow}>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Health Screening - Community Hall</Text>
            <Text style={styles.eventCount}>10 registered</Text>
          </View>
        </View>
        
        <View style={styles.eventRow}>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Wellness Workshop</Text>
            <Text style={styles.eventCount}>28 registered</Text>
          </View>
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.messageText}>
            Your outreach helped <Text style={{ color: '#D01F1F', fontWeight: 'bold' }}>57 women</Text> access free health screenings.
          </Text>
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
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#009013',
  },
  messageCard: {
    backgroundColor: '#F6C7C7',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
