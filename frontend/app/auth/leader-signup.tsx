// Screen: Promoter Signup (UI Only)
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function PromoterSignup() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 50 }}>
        Promoter Sign Up
      </Text>

      <TextInput placeholder="First Name" style={styles.input} />
      <TextInput placeholder="Last Name" style={styles.input} />
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm Password" secureTextEntry style={styles.input} />

      {/* Signup button */}
      <TouchableOpacity style={styles.btn}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Go to login */}
      <TouchableOpacity onPress={() => router.push('/auth/promoter-login')} style={{ marginTop: 20 }}>
        <Text style={{ textAlign: 'center' }}>Already have an account? Login</Text>
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
