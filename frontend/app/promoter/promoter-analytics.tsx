import React from 'react';
import { View, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import { useRouter } from "expo-router";

export default function PromotorAnalytics() {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;

  const handleBack = () => {
    router.back();
  };

  const stats = [
    { id: 1, title: "Participants Signed Up with your Link", value: "739" },
    { id: 2, title: "Events Created a Link for", value: "23" },
  ];

  const data = [
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 50 },
    { label: 'Mar', value: 60 },
    { label: 'Apr', value: 90 },
    { label: 'May', value: 130 },
    { label: 'Jun', value: 135 },
    { label: 'Jul', value: 140 },
    { label: 'Aug', value: 150 },
    { label: 'Sep', value: 110 },
    { label: 'Oct', value: 80 },
    { label: 'Nov', value: 70 },
    { label: 'Dec', value: 25 },
  ];

  const eventData = [
    { label: 'Jan', value: 1 },
    { label: 'Feb', value: 1 },
    { label: 'Mar', value: 1 },
    { label: 'Apr', value: 2 },
    { label: 'May', value: 2 },
    { label: 'Jun', value: 3 },
    { label: 'Jul', value: 4 },
    { label: 'Aug', value: 3 },
    { label: 'Sep', value: 3 },
    { label: 'Oct', value: 2 },
    { label: 'Nov', value: 1 },
    { label: 'Dec', value: 1 },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4">
        <Text className="text-2xl font-bold text-gray-900 text-center">Analytics Dashboard</Text>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        className="bg-[#28B900] p-4 mx-4 rounded-lg items-center mt-4"
        onPress={handleBack}
      >
        <Text className="text-white text-base font-semibold">Back to Main Dashboard</Text>
      </TouchableOpacity>

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
        <Text className="text-lg font-bold mb-4 text-center">Participants Used Your Link / Month</Text>
        <BarChart
          data={data}
          frontColor={'#28B900'}
          barWidth={12}
          width = {screenWidth - 40}
          initialSpacing={5}
          barBorderRadius={4}
          yAxisLabelTexts={['0', '50', '100', '150', '200',]}
          noOfSections={4}
          isAnimated
        />

        <Text className="text-lg font-bold mt-8 mb-4 text-center">Events Created a Link For</Text>
        <BarChart
          data={eventData}
          frontColor={'#28B900'}
          barWidth={12}
          width={screenWidth - 40}
          initialSpacing={5}
          spacing={20}
          maxValue={5}
          noOfSections={5}
          barBorderRadius={4}
          isAnimated
        />

      </View>
    </ScrollView>
  );
}