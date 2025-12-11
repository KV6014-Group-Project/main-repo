import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { login } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';

export default function OrganiserLogin() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    if (loading) return;
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await login(email.trim(), password);
      await signIn(response.token, response.user);

      const roleName = response.user.role?.name;
      if (roleName === 'organiser') {
        router.replace('/organiser');
      } else if (roleName === 'promoter') {
        router.replace('/promoter');
      } else {
        router.replace('/');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSignup = () => {
    router.push('/auth/organiser-signup');
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white p-5">
        <Text className="text-2xl font-bold text-center mt-12">Organiser Login</Text>
        <Text className="text-sm text-center mb-10 text-gray-500">Create and manage events with full control.</Text>

        {error && (
          <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
        )}

        <TextInput
          placeholder="Email"
          className="border border-gray-300 p-3 rounded-lg mb-5 text-base"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          className="border border-gray-300 p-3 rounded-lg mb-5 text-base"
          value={password}
          onChangeText={setPassword}
        />

        <View className="flex-row justify-between my-2.5">
          <Text>Remember me</Text>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text className="text-blue-500">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-[#28B900] p-4 rounded-lg items-center mt-2.5 opacity-100"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-base font-bold">LOGIN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignup} className="mt-5">
          <Text className="text-center text-gray-700">Don't have an account? Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBack} className="mt-8">
          <Text className="text-center text-blue-500 text-base">← Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}
