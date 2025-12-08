import React from 'react';
import { View, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import { useRouter } from "expo-router";

export default function OrganiserAnalytics() {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;

  const handleBack = () => {
    router.back();
  };

  const stats = [
    { id: 1, title: "Participants Signed Up", value: "2,847" },
    { id: 2, title: "Events Created", value: "156" },
    { id: 3, title: "Cancer Detections", value: "43" },
  ];

  const data = [
    { label: 'Jan', value: 125 },
    { label: 'Feb', value: 200 },
    { label: 'Mar', value: 245 },
    { label: 'Apr', value: 260 },
    { label: 'May', value: 285 },
    { label: 'Jun', value: 300 },
    { label: 'Jul', value: 310 },
    { label: 'Aug', value: 315 },
    { label: 'Sep', value: 290 },
    { label: 'Oct', value: 210 },
    { label: 'Nov', value: 175 },
    { label: 'Dec', value: 130 },
  ];

  const eventData = [
    { label: 'Jan', value: 5 },
    { label: 'Feb', value: 7 },
    { label: 'Mar', value: 9 },
    { label: 'Apr', value: 11 },
    { label: 'May', value: 13 },
    { label: 'Jun', value: 13 },
    { label: 'Jul', value: 15 },
    { label: 'Aug', value: 17 },
    { label: 'Sep', value: 14 },
    { label: 'Oct', value: 10 },
    { label: 'Nov', value: 8 },
    { label: 'Dec', value: 6 },
  ];

  const detectionData = [
    { label: 'Jan', value: 2 },
    { label: 'Feb', value: 2 },
    { label: 'Mar', value: 3 },
    { label: 'Apr', value: 4 },
    { label: 'May', value: 4 },
    { label: 'Jun', value: 6 },
    { label: 'Jul', value: 7 },
    { label: 'Aug', value: 7 },
    { label: 'Sep', value: 5 },
    { label: 'Oct', value: 3 },
    { label: 'Nov', value: 2 },
    { label: 'Dec', value: 3 },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
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
          data={data}
          frontColor={'#28B900'}
          barWidth={12}
          initialSpacing={5}
          spacing={20}
          width = {screenWidth - 40}
          barBorderRadius={4}
          yAxisLabelTexts={['0', '100', '200', '300', '400']}
          noOfSections={4}
          isAnimated
        />

        <Text className="text-lg font-bold mt-8 mb-4 text-center">Events Held / Month</Text>
        <BarChart
          data={eventData}
          frontColor={'#28B900'}
          barWidth={12}
          width={screenWidth - 40}
          initialSpacing={5}
          spacing={20}
          barBorderRadius={4}
          yAxisLabelTexts={['0', '4', '8', '12', '16']}
          noOfSections={4}
          isAnimated
        />

        <Text className="text-lg font-bold mt-8 mb-4 text-center">Cancer Detections in Events / Month</Text>
        <BarChart
          data={detectionData}
          frontColor={'#28B900'}
          barWidth={12}
          width={screenWidth - 40}
          initialSpacing={5}
          spacing={20}
          barBorderRadius={4}
          yAxisLabelTexts={['0', '3', '6', '9', '12']}
          noOfSections={4}
          isAnimated
        />
      </View>
    </ScrollView>
  );
}