import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';

export default function PromoterLogin() {
  const router = useRouter();

  const handleLogin = () => {
    // Clear stack and set promoter home as root
    router.replace('/promoter');
  };

  const handleBack = () => {
    router.replace('/auth');
  };

  const handleSignup = () => {
    router.push('/auth/promoter-signup');
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Promoter Login</Text>
        <Text style={styles.subtitle}>Connect events to participants with shareable links.</Text>

        <TextInput placeholder="Email" style={styles.input} />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} />

        <View style={styles.row}>
          <Text>Remember me</Text>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignup} style={styles.signupLink}>
          <Text style={styles.signupText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBack} style={styles.backLink}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  link: {
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#28B900',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 20,
  },
  signupText: {
    textAlign: 'center',
    color: '#333',
  },
  backLink: {
    marginTop: 30,
  },
  backText: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 16,
  },
});
