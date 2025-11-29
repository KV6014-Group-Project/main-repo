// Screen: Promoter Login (UI Only)
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function PromoterLogin() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 50 }}>
        Promoter Access
      </Text>
      <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 40 }}>
        Connect organiser events to participants with shareable links.
      </Text>

      {/* Email */}
      <TextInput placeholder="Promoter Email" style={styles.input} />
      {/* Password */}
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />

      {/* Remember me + Forgot password */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Text>Remember me</Text>
        <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
          <Text style={{ color: '#007AFF' }}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login button */}
      <TouchableOpacity style={styles.btn}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>LOGIN</Text>
      </TouchableOpacity>

      {/* Go to signup */}
      <TouchableOpacity onPress={() => router.push('/auth/promoter-signup')} style={{ marginTop: 20 }}>
        <Text style={{ textAlign: 'center' }}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20
  },
  btn: {
    backgroundColor: '#00b300',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  }
};
