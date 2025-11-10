import React from "react";
import { SafeAreaView, ScrollView, View, Image, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";

export default function AuthIndexScreen() {
  const router = useRouter();

  const continueAsStaff = () => {
    router.push("/auth/organiser"); // if staff path exists, otherwise adjust
  };

  const continueAsOrganiser = () => {
    router.push("/auth/promoter");
  };

  const continueAsParticipant = () => {
    router.push("/auth/participant");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>

        {/* Rose logo */}
        <Image
          source={require("../../assets/rose.png")}
          resizeMode="contain"
          style={{
            width: 70,
            height: 70,
            marginTop: 47,
            marginBottom: 133,
            marginLeft: 7,
          }}
        />

        {/* Title */}
        <View style={{ alignItems: "center", marginBottom: 94 }}>
          <Text style={{ color: "#000000", fontSize: 32, fontWeight: "bold" }}>
            PICK YOUR ROLE
          </Text>
        </View>

        {/* ROSE STAFF */}
        <TouchableOpacity
          onPress={continueAsStaff}
          style={{
            backgroundColor: "#F8F8F8",
            borderRadius: 16,
            paddingVertical: 26,
            paddingHorizontal: 45,
            marginHorizontal: 36,
            marginBottom: 57,
          }}
        >
          <Text style={{ color: "#000000", fontSize: 24 }}>ROSE STAFF</Text>
        </TouchableOpacity>

        {/* COMMUNITY LEADER */}
        <TouchableOpacity
          onPress={continueAsOrganiser}
          style={{
            backgroundColor: "#F8F8F8",
            borderRadius: 16,
            paddingVertical: 26,
            paddingHorizontal: 45,
            marginHorizontal: 37,
            marginBottom: 35,
          }}
        >
          <Text style={{ color: "#000000", fontSize: 24 }}>COMMUNITY LEADER</Text>
        </TouchableOpacity>

        {/* PARTICIPANTS */}
        <TouchableOpacity
          onPress={continueAsParticipant}
          style={{
            backgroundColor: "#F8F8F8",
            borderRadius: 16,
            paddingVertical: 26,
            paddingHorizontal: 45,
            marginLeft: 45,
            marginRight: 28,
            marginBottom: 142,
          }}
        >
          <Text style={{ color: "#000000", fontSize: 24 }}>Participants</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
