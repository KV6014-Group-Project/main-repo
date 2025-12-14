import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import { useRouter } from "expo-router";
import { Event, EventStats, fetchEventStats, fetchOrganiserEvents } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';

export default function OrganiserAnalytics() {
  const router = useRouter();
  const { user } = useAuth();
  const screenWidth = Dimensions.get('window').width;

  const [events, setEvents] = useState<Event[]>([]);
  const [eventStats, setEventStats] = useState<Record<string, EventStats>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const monthLabels = useMemo(
    () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const,
    []
  );

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const loadAnalytics = useCallback(async () => {
    try {
      setError(null);

      const all = await fetchOrganiserEvents();
      const list = Array.isArray(all) ? all : [];
      const organiserOnly = user?.id ? list.filter((e) => e.organiser?.id === user.id) : list;
      setEvents(organiserOnly);

      const inYear = organiserOnly.filter((e) => {
        const d = new Date(e.start_datetime);
        return d.getFullYear() === currentYear;
      });

      const statsEntries = await Promise.all(
        inYear.map(async (e) => {
          try {
            const stats = await fetchEventStats(e.id);
            return [e.id, stats] as const;
          } catch {
            return [e.id, { total_rsvps: 0, total_interested: 0, total_cancelled: 0, by_promoter: {}, by_source: {} }] as const;
          }
        })
      );

      setEventStats(Object.fromEntries(statsEntries));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load analytics';
      setError(message);
      setEvents([]);
      setEventStats({});
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentYear, user?.id]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAnalytics();
  }, [loadAnalytics]);

  const totals = useMemo(() => {
    const totalEvents = events.length;
    const totalParticipants = Object.values(eventStats).reduce((sum, s) => sum + (s?.total_rsvps || 0), 0);
    return { totalEvents, totalParticipants };
  }, [eventStats, events.length]);

  const charts = useMemo(() => {
    const eventsHeld = new Array(12).fill(0);
    const participants = new Array(12).fill(0);

    for (const e of events) {
      const d = new Date(e.start_datetime);
      if (d.getFullYear() !== currentYear) continue;
      const m = d.getMonth();
      eventsHeld[m] += 1;
      participants[m] += eventStats[e.id]?.total_rsvps || 0;
    }

    const participantsData = monthLabels.map((label, idx) => ({ label, value: participants[idx] }));
    const eventsData = monthLabels.map((label, idx) => ({ label, value: eventsHeld[idx] }));

    return {
      participantsData,
      eventsData,
      maxParticipants: Math.max(...participants, 0),
      maxEvents: Math.max(...eventsHeld, 0),
    };
  }, [currentYear, eventStats, events, monthLabels]);

  function buildYAxisLabelTexts(max: number, sections: number): string[] {
    if (max <= 0) {
      return new Array(sections + 1).fill(0).map((_, idx) => String((max * idx) / sections));
    }
    const step = Math.ceil(max / sections);
    return new Array(sections + 1).fill(0).map((_, idx) => String(step * idx));
  }

  const stats = useMemo(
    () => [
      { id: 1, title: 'Participants Signed Up', value: String(totals.totalParticipants) },
      { id: 2, title: 'Events Created', value: String(totals.totalEvents) },
    ],
    [totals.totalEvents, totals.totalParticipants]
  );

  const participantYAxisTexts = useMemo(
    () => buildYAxisLabelTexts(charts.maxParticipants, 4),
    [charts.maxParticipants]
  );

  const eventsYAxisTexts = useMemo(
    () => buildYAxisLabelTexts(charts.maxEvents, 4),
    [charts.maxEvents]
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#28B900" />
        <Text className="mt-4 text-gray-500">Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4">
        <Text className="text-2xl font-bold text-gray-900 text-center">Organiser Analytics Dashboard</Text>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        className="bg-[#28B900] p-4 mx-4 rounded-lg items-center mt-4"
        onPress={handleBack}
      >
        <Text className="text-white text-base font-semibold">Back to Main Dashboard</Text>
      </TouchableOpacity>

      {error && (
        <View className="bg-red-100 p-4 rounded-xl mx-4 mt-4">
          <Text className="text-red-700">{error}</Text>
          <TouchableOpacity onPress={loadAnalytics} className="mt-2">
            <Text className="text-blue-500">Tap to retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Statistics Cards */}
      <View className="flex-row flex-wrap justify-center bg-white p-4">
        {stats.map((stat) => (
          <View
            key={stat.id}
            className="w-[30%] items-center p-3 m-2 bg-white border border-gray-300 rounded-xl"
          >
            <Text className="text-2xl font-bold text-gray-900">{stat.value}</Text>
            <Text className="text-xs text-gray-600 text-center">{stat.title}</Text>
          </View>
        ))}
      </View>

      {/* Charts Section */}
      <View className="flex-1 items-centerbg-white p-4">
        <Text className="text-lg font-bold mb-4 text-center">Participants Registered / Month</Text>
        <BarChart
          data={charts.participantsData}
          frontColor={'#28B900'}
          barWidth={12}
          initialSpacing={5}
          spacing={20}
          width = {screenWidth - 40}
          barBorderRadius={4}
          yAxisLabelTexts={participantYAxisTexts}
          noOfSections={4}
          isAnimated
        />

        <Text className="text-lg font-bold mt-8 mb-4 text-center">Events Held / Month</Text>
        <BarChart
          data={charts.eventsData}
          frontColor={'#28B900'}
          barWidth={12}
          width={screenWidth - 40}
          initialSpacing={5}
          spacing={20}
          barBorderRadius={4}
          yAxisLabelTexts={eventsYAxisTexts}
          noOfSections={4}
          isAnimated
        />
      </View>
    </ScrollView>
  );
}