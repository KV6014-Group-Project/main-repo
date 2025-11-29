import React from "react";
import { SafeAreaView, View, ScrollView, Image, Text } from "react-native";

export default () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>

        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#D9D9D9",
            borderRadius: 11,
            paddingTop: 24,
            marginBottom: 11,
          }}
        >
          <Image
            source={require("./assets/back.png")} // replace local files
            resizeMode="contain"
            style={{ width: 35, height: 35, marginLeft: 23, marginRight: 32 }}
          />
          <Text style={{ fontSize: 32, fontWeight: "bold" }}>JOHN DOE</Text>
        </View>

        {/* TOTAL IMPACT CARD */}
        <View
          style={{
            backgroundColor: "#D9D9D9",
            borderRadius: 11,
            marginBottom: 18,
            marginHorizontal: 22,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 13 },
            shadowRadius: 15,
            elevation: 15,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginTop: 34,
              marginLeft: 23,
            }}
          >
            YOUR TOTAL IMPACT
          </Text>

          {/* IMPACT - PARTICIPANTS */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              marginLeft: 24,
              marginBottom: 30,
            }}
          >
            <Image
              source={require("./assets/participants.png")}
              resizeMode="contain"
              style={{ width: 24, height: 24, marginRight: 7 }}
            />
            <View>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#C70000" }}>
                57
              </Text>
              <Text style={{ fontSize: 11 }}>Participants Registered</Text>
            </View>
          </View>

          {/* IMPACT - WHATSAPP */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 24,
              marginBottom: 30,
            }}
          >
            <Image
              source={require("./assets/share.png")}
              resizeMode="contain"
              style={{ width: 24, height: 24, marginRight: 7 }}
            />
            <View>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#009013" }}>
                19
              </Text>
              <Text style={{ fontSize: 11 }}>WhatsApp Shares</Text>
            </View>
          </View>

          {/* IMPACT - EVENTS PROMOTED */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 24,
              marginBottom: 30,
            }}
          >
            <Image
              source={require("./assets/calendar.png")}
              resizeMode="contain"
              style={{ width: 24, height: 24, marginRight: 7 }}
            />
            <View>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#C70000" }}>
                5
              </Text>
              <Text style={{ fontSize: 11 }}>Events Promoted</Text>
            </View>
          </View>
        </View>

        {/* BADGES TITLE */}
        <Text style={{ fontSize: 24, fontWeight: "bold", marginLeft: 23, marginBottom: 10 }}>
          Badges
        </Text>

        {/* BADGE BLOCK */}
        <View style={{ flexDirection: "row", marginHorizontal: 22, marginBottom: 20 }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: "#F27E7E",
              borderRadius: 9,
              paddingVertical: 25,
              marginRight: 20,
            }}
          >
            <Image
              source={require("./assets/medal.png")}
              resizeMode="contain"
              style={{ width: 34, height: 34, marginBottom: 10 }}
            />
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "#FFFFFF" }}>
              Community Connector
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: "#8BC34A",
              borderRadius: 9,
              paddingVertical: 25,
            }}
          >
            <Image
              source={require("./assets/chat.png")}
              resizeMode="contain"
              style={{ width: 34, height: 34, marginBottom: 10 }}
            />
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "#FFFFFF" }}>
              Top Sharer
            </Text>
          </View>
        </View>

        {/* LIST OF EVENTS */}
        {[
          { title: "Health Screening - Community Hall", count: "10 registered" },
          { title: "Wellness Workshop", count: "28 registered" },
          { title: "Nutrition Talk", count: "19 registered" },
        ].map((item, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F3F3F3",
              borderRadius: 9,
              paddingVertical: 16,
              paddingHorizontal: 20,
              marginHorizontal: 22,
              marginBottom: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15 }}>{item.title}</Text>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#009013" }}>
                {item.count}
              </Text>
            </View>

            <Image
              source={require("./assets/users.png")}
              resizeMode="contain"
              style={{ width: 28, height: 28 }}
            />
          </View>
        ))}

        {/* FINAL MESSAGE */}
        <View
          style={{
            backgroundColor: "#F6C7C7",
            borderRadius: 9,
            paddingVertical: 18,
            paddingHorizontal: 20,
            marginHorizontal: 22,
            marginBottom: 120,
          }}
        >
          <Text>
            Your outreach helped <Text style={{ color: "#D01F1F" }}>57 women</Text> access
            free health screenings.
          </Text>
        </View>
      </ScrollView>

      {/* BOTTOM NAV BAR */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#F8F8F8",
          paddingHorizontal: 45,
          paddingVertical: 25,
          borderTopWidth: 1,
          borderColor: "#E4E4E4",
        }}
      >
        <Image source={require("./assets/home.png")} style={{ width: 40, height: 40 }} />
        <Image source={require("./assets/calendar.png")} style={{ width: 40, height: 40 }} />
        <Image source={require("./assets/profile.png")} style={{ width: 40, height: 40 }} />
      </View>
    </SafeAreaView>
  );
};
