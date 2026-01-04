import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchPromoterEvents, fetchPromoterEventStats, EventStats } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';

export default function PromoterImpact() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalRsvps: 0,
    totalEvents: 0,
    totalShares: 0,
  });

  useEffect(() => {
    loadTotalStats();
  }, []);

  async function loadTotalStats() {
    try {
      const events = await fetchPromoterEvents();
      let totalRsvps = 0;
      
      for (const event of events) {
        const stats = await fetchPromoterEventStats(event.id);
        totalRsvps += stats.total_rsvps;
      }

      setTotalStats({
        totalRsvps,
        totalEvents: events.length,
        totalShares: 0, // TODO: Add share tracking when backend supports it
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#28B900" />
        <Text className="mt-4 text-gray-500">Loading your impact...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <View className="bg-neutral-300 rounded-2xl p-6 mb-5">
          <Text className="text-3xl font-bold text-center">
            {user?.first_name && user?.last_name 
              ? `${user.first_name} ${user.last_name}` 
              : user?.email || 'PROMOTER'
            }
          </Text>
          <Text className="text-sm text-gray-600 text-center mt-2">Your efforts are helping your community stay healthy.</Text>
        </View>

        <View className="bg-neutral-100 rounded-2xl p-5 mb-6">
          <Text className="text-lg font-bold mb-4">YOUR TOTAL IMPACT</Text>
          
          <View className="flex-row items-center mb-3">
            <Text className="text-base font-bold mr-2 text-red-500">{totalStats.totalRsvps}</Text>
            <Text className="text-sm">Participants Registered</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <Text className="text-base font-bold mr-2 text-green-600">{totalStats.totalShares}</Text>
            <Text className="text-sm">WhatsApp Shares</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <Text className="text-base font-bold mr-2 text-red-700">{totalStats.totalEvents}</Text>
            <Text className="text-sm">Events Promoted</Text>
          </View>
        </View>

        <Text className="text-lg font-bold mb-3">Badges</Text>
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 rounded-xl p-5 items-center bg-red-300">
            <Text className="text-white font-bold text-center">Community Connector</Text>
          </View>
          <View className="flex-1 rounded-xl p-5 items-center bg-green-400">
            <Text className="text-white font-bold text-center">Top Sharer</Text>
          </View>
        </View>

        <Text className="text-lg font-bold mb-3">Recent Events</Text>
        
        <View className="bg-neutral-200 rounded-xl p-4 flex-row justify-between items-center mb-3">
          <Text className="text-sm font-medium flex-1">Health Screening – Community Hall</Text>
          <Text className="text-base font-bold">50</Text>
        </View>
        
        <View className="bg-neutral-200 rounded-xl p-4 flex-row justify-between items-center mb-3">
          <Text className="text-sm font-medium flex-1">Women Wellness Workshop</Text>
          <Text className="text-base font-bold">30</Text>
        </View>

        <View className="bg-[#FFE4EB] border border-[#FF9FBA] rounded-2xl p-4 mt-4 flex-row items-start gap-3">
          <Text className="text-xl">Note:</Text>
          <Text className="text-sm text-gray-700 flex-1">
            Your outreach helped{' '}
            <Text className="font-semibold text-[#E2004E]">{totalStats.totalRsvps} people</Text>{' '}
            access health services through your events.
          </Text>
        </View>

        <TouchableOpacity className="p-4 items-center mt-5" onPress={() => router.back()}>
          <Text className="text-blue-500 text-base">← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
