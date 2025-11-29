import React from "react";
import { SafeAreaView, View, ScrollView, Image, Text, TouchableOpacity } from "react-native";

export default () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>

        {/* HEADER */}
        <View style={{ flexDirection: "row", backgroundColor: "#D9D9D9", borderRadius: 11, marginBottom: 20 }}>
          <Image
            source={require("./assets/back.png")} // replace with your own file
            resizeMode={"contain"}
            style={{ width: 35, height: 35, marginTop: 35, marginLeft: 15, marginRight: 20 }}
          />
          <Text style={{ fontSize: 21, marginVertical: 38, flex: 1 }}>
            Health Screening - Yang Community
          </Text>
        </View>

        {/* EVENT DETAILS CARD */}
        <View
          style={{
            backgroundColor: "#D9D9D9",
            borderRadius: 12,
            paddingVertical: 20,
            marginBottom: 35,
            marginHorizontal: 20,
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "bold", marginLeft: 32, marginBottom: 5 }}>Date</Text>
          <Text style={{ fontSize: 14, marginLeft: 32, marginBottom: 16 }}>Saturday, nov 21st</Text>

          <Text style={{ fontSize: 14, fontWeight: "bold", marginLeft: 32, marginBottom: 5 }}>Time</Text>
          <Text style={{ fontSize: 14, marginLeft: 32, marginBottom: 16 }}>2:00 PM</Text>

          <Text style={{ fontSize: 14, fontWeight: "bold", marginLeft: 32, marginBottom: 5 }}>Location</Text>
          <Text style={{ fontSize: 14, marginLeft: 32 }}>Community Hall</Text>
        </View>

        {/* ABOUT CARD */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            padding: 18,
            marginHorizontal: 20,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 4,
            elevation: 4,
            marginBottom: 25,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12 }}>About This Event</Text>
          <Text style={{ fontSize: 15 }}>
            A free health screening and wellness event for women in the community.
          </Text>
        </View>

        {/* 10 PEOPLE REGISTERED */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#D5E0CB",
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 20,
            marginHorizontal: 25,
            marginBottom: 20,
          }}
        >
          <Image
            source={require("./assets/user_icon.png")} // replace with your own file
            resizeMode="contain"
            style={{ width: 35, height: 35, marginRight: 15 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 2 }}>10 people</Text>
            <Text style={{ fontSize: 13 }}>registered via your link</Text>
          </View>
        </View>

        {/* BUTTON: VIEW YOUR SHARE LINK */}
        <TouchableOpacity
          style={{
            backgroundColor: "#F88080",
            borderRadius: 12,
            paddingVertical: 15,
            marginHorizontal: 25,
            marginBottom: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#FFFFFF" }}>
            View Your Share Link
          </Text>
        </TouchableOpacity>

        {/* BUTTON: SHARE ON WHATSAPP */}
        <TouchableOpacity
          style={{
            backgroundColor: "#48C44B",
            borderRadius: 12,
            paddingVertical: 15,
            marginHorizontal: 25,
            marginBottom: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#FFFFFF" }}>
            Share On Whatsapp
          </Text>
        </TouchableOpacity>

        {/* BUTTON: DOWNLOAD POSTER */}
        <TouchableOpacity
          style={{
            backgroundColor: "#E8E8E8",
            borderRadius: 12,
            paddingVertical: 15,
            marginHorizontal: 25,
            marginBottom: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            Download Poster
          </Text>
        </TouchableOpacity>

        {/* REMINDER BOX */}
        <View
          style={{
            backgroundColor: "#F9C9C9",
            borderRadius: 12,
            paddingVertical: 15,
            paddingHorizontal: 20,
            marginHorizontal: 25,
            marginBottom: 100,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15 }}>
            Share your link again before the event day.
          </Text>
        </View>

      </ScrollView>

      {/* BOTTOM NAVBAR */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#F8F8F8",
          paddingVertical: 22,
          paddingHorizontal: 45,
          borderTopWidth: 1,
          borderColor: "#E4E4E4",
        }}
      >
        <Image source={require("./assets/home.png")} style={{ width: 37, height: 37 }} />
        <Image source={require("./assets/calendar.png")} style={{ width: 37, height: 37 }} />
        <Image source={require("./assets/profile.png")} style={{ width: 37, height: 37 }} />
      </View>
    </SafeAreaView>
  );
};
