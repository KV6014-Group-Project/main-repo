import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OrganiserHome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Organiser Dashboard</Text>
        <Text style={styles.subtitle}>Manage your events</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Events</Text>
          <Text style={styles.cardText}>No events yet. Create one to get started.</Text>
        </View>

        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/organiser/organiserevent')}
        >
          <Text style={styles.navButtonText}>View Event Details</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/organiser/organiserdashboard')}
        >
          <Text style={styles.navButtonText}>Dashboard View</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/organiser/impactorganiser')}
        >
          <Text style={styles.navButtonText}>View Impact</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={() => router.replace('/welcome')}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  navButton: {
    backgroundColor: '#28B900',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
