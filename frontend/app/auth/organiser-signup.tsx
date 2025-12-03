import * as React from 'react';
import { Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';

export default function OrganiserSignup() {
  const router = useRouter();

  const handleSignup = () => {
    // Clear stack and set organiser home as root
    router.replace('/organiser');
  };

  const handleLogin = () => {
    router.push('/auth/organiser-login');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Organiser Sign Up</Text>

        <TextInput placeholder="First Name" style={styles.input} />
        <TextInput placeholder="Last Name" style={styles.input} />
        <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} />
        <TextInput placeholder="Confirm Password" secureTextEntry style={styles.input} />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
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
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
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
  loginLink: {
    marginTop: 20,
  },
  loginText: {
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
