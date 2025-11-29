import React from "react";
import { SafeAreaView, View, ScrollView, Image, Text, ImageBackground, TouchableOpacity } from "react-native";

export default () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView style={{ flex: 1 }}>

        {/* TOP BAR */}
        <Text style={{ fontSize: 13, color: "#C0C0C0", marginLeft: 15, marginTop: 5 }}>EVENT</Text>

        {/* HEADER */}
        <View style={{ flexDirection: "row", backgroundColor: "#D9D9D9", borderRadius: 11, marginBottom: 15 }}>
          <Image
            source={{ uri: "https://storage.example.com/back.png" }} // replace with your local icon
            resizeMode="contain"
            style={{ width: 30, height: 30, marginTop: 38, marginLeft: 15, marginRight: 15 }}
          />
          <Text style={{ fontSize: 21, marginVertical: 38, flex: 1 }}>
            Health Screening - Yang Community
          </Text>
        </View>

        {/* EVENT DETAILS CARD */}
        <View
          style={{
            backgroundColor: "#D9D9D9",
            borderRadius: 9,
            paddingVertical: 29,
            marginBottom: 26,
            marginHorizontal: 31,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 13, marginBottom: 11, marginLeft: 28 }}>Date</Text>
          <Text style={{ fontSize: 13, marginBottom: 11, marginLeft: 28 }}>Saturday, nov 21st</Text>

          <Text style={{ fontWeight: "bold", fontSize: 13, marginBottom: 11, marginLeft: 28 }}>Time</Text>
          <Text style={{ fontSize: 13, marginBottom: 13, marginLeft: 28 }}>2:00 PM</Text>

          <Text style={{ fontWeight: "bold", fontSize: 13, marginBottom: 13, marginLeft: 28 }}>Location</Text>
          <Text style={{ fontSize: 13, marginLeft: 28 }}>Community Hall</Text>
        </View>

        {/* ABOUT SECTION */}
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20, marginLeft: 20 }}>
          About This Event
        </Text>
        <Text style={{ fontSize: 15, marginLeft: 20, marginRight: 7, marginBottom: 13 }}>
          A free health screening and wellness event for women in the community. Join us for comprehensive health checks and expert advice.
        </Text>

        {/* PEOPLE REGISTERED BOX */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#D9D9D9",
            borderRadius: 9,
            paddingVertical: 16,
            paddingHorizontal: 17,
            marginBottom: 26,
            marginHorizontal: 31,
          }}
        >
          <ImageBackground
            source={{ uri: "https://storage.example.com/green_circle.png" }} // place your local image or local require()
            resizeMode="cover"
            style={{
              width: 62,
              height: 62,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 11,
              borderRadius: 50,
              overflow: "hidden",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "bold" }}>10</Text>
          </ImageBackground>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 6 }}>
              People registered via link
            </Text>
            <Text style={{ fontSize: 13 }}>Keep sharing to reach more people</Text>
          </View>
        </View>

        {/* WHATSAPP BUTTON */}
        <TouchableOpacity
          style={{
            backgroundColor: "#21C400",
            borderRadius: 11,
            paddingVertical: 14,
            marginHorizontal: 31,
            marginBottom: 140,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", color: "#FFFFFF" }}>
            Share On Whatsapp
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BOTTOM NAV BAR */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#F8F8F8",
          borderTopWidth: 1,
          borderColor: "#E4E4E4",
          paddingVertical: 18,
          paddingHorizontal: 40,
        }}
      >
        <Image
          source={{ uri: "https://storage.example.com/home.png" }}  // replace with local images
          resizeMode="contain"
          style={{ width: 40, height: 40 }}
        />
        <Image
          source={{ uri: "https://storage.example.com/calendar.png" }}
          resizeMode="contain"
          style={{ width: 40, height: 40 }}
        />
        <Image
          source={{ uri: "https://storage.example.com/user.png" }}
          resizeMode="contain"
          style={{ width: 40, height: 40 }}
        />
      </View>
    </SafeAreaView>
  );
};
