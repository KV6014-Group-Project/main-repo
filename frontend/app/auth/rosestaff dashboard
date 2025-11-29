import React from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity } from "react-native";

export default function ParticipantDashboard() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        
        {/* HEADER */}
        <View style={{ paddingHorizontal: 9, marginBottom: 11 }}>
          <View style={{ marginTop: 87 }}>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 9,
                shadowColor: "#00000040",
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Text
                style={{
                  color: "#000000",
                  fontSize: 11,
                  fontWeight: "bold",
                  marginTop: 18,
                  marginBottom: 7,
                  marginLeft: 13,
                  width: 135,
                }}
              >
                Your Impact This Month
              </Text>

              <View style={{ flexDirection: "row", marginBottom: 6, marginLeft: 24, marginRight: 37 }}>
                <Text style={{ color: "#000000", fontSize: 36, fontWeight: "bold" }}>48</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ color: "#000000", fontSize: 36, fontWeight: "bold", marginRight: 70 }}>3</Text>
                <Text style={{ color: "#000000", fontSize: 36, fontWeight: "bold" }}>120</Text>
              </View>

              <View style={{ alignItems: "flex-end", marginBottom: 5 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginRight: 35 }}>
                  <Text style={{ color: "#000000", fontSize: 12, marginRight: 44 }}>Active Events</Text>
                  <Text style={{ color: "#000000", fontSize: 12, textAlign: "center", width: 64 }}>
                    WhatsApp{`\n`}Shares
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                position: "absolute",
                bottom: -1,
                left: 20,
                color: "#000000",
                fontSize: 12,
                textAlign: "center",
                width: 72,
              }}
            >
              Participants{`\n`}Registered
            </Text>
          </View>

          {/* NAME BAR */}
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              alignItems: "center",
              backgroundColor: "#D9D9D9",
              borderRadius: 9,
            }}
          >
            <Text style={{ color: "#000000", fontSize: 40, marginTop: 23, marginBottom: 37 }}>
              JOHN DOE
            </Text>
          </View>
        </View>

        {/* ACTIVE EVENTS SECTION */}
        <Text
          style={{
            color: "#000000",
            fontSize: 13,
            fontWeight: "bold",
            marginBottom: 18,
            marginLeft: 31,
          }}
        >
          Active Events
        </Text>

        {/* EVENT CARD 1 */}
        <TouchableOpacity
          style={{
            backgroundColor: "#D9D9D9",
            borderRadius: 9,
            paddingVertical: 13,
            marginBottom: 16,
            marginHorizontal: 9,
          }}
        >
          <Text style={{ color: "#000000", fontSize: 13, fontWeight: "bold", marginBottom: 9, marginLeft: 27 }}>
            Health Screening - Community Hall
          </Text>
          <Text style={{ color: "#000000", fontSize: 13, marginBottom: 8, marginLeft: 27 }}>
            Saturday, Oct 21st
          </Text>
          <Text style={{ color: "#000000", fontSize: 13, marginBottom: 9, marginLeft: 27 }}>
            2:00 PM
          </Text>
          <Text style={{ color: "#28B900", fontSize: 13, marginLeft: 27, fontWeight: "bold" }}>
            VIEW DETAILS
          </Text>
        </TouchableOpacity>

        {/* EVENT CARD 2 */}
        <TouchableOpacity
          style={{
            backgroundColor: "#D9D9D9",
            borderRadius: 9,
            paddingVertical: 13,
            marginBottom: 16,
            marginHorizontal: 9,
          }}
        >
          <Text style={{ color: "#000000", fontSize: 13, fontWeight: "bold", marginBottom: 9, marginLeft: 27 }}>
            Charity Walk - Riverside Park
          </Text>
          <Text style={{ color: "#000000", fontSize: 13, marginBottom: 8, marginLeft: 27 }}>
            Sunday, Nov 5th
          </Text>
          <Text style={{ color: "#000000", fontSize: 13, marginBottom: 9, marginLeft: 27 }}>
            10:00 AM
          </Text>
          <Text style={{ color: "#28B900", fontSize: 13, marginLeft: 27, fontWeight: "bold" }}>
            VIEW DETAILS
          </Text>
        </TouchableOpacity>

        {/* CREATE BUTTON AT BOTTOM */}
        <View
          style={{
            alignItems: "center",
            marginTop: 10,
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#28B900",
              borderRadius: 9,
              paddingVertical: 12,
              paddingHorizontal: 60,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              CREATE
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
