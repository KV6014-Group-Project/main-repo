import * as React from 'react';
import { Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { registerUser } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';

export default function OrganiserSignup() {
  const router = useRouter();
  const { signIn, setOtpVerified } = useAuth();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSignup = async () => {
    if (loading) return;

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await registerUser({
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        roleName: 'organiser',
      });

      await signIn(response.token, response.user);

      await setOtpVerified(false);

      const roleName = response.user.role?.name;
      if (roleName === 'organiser') {
        router.replace({ pathname: '/auth/email-otp' as any, params: { role: 'organiser' } } as any);
      } else if (roleName === 'promoter') {
        router.replace({ pathname: '/auth/email-otp' as any, params: { role: 'promoter' } } as any);
      } else {
        router.replace('/');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to sign up. Please check your details.');
    } finally {
      setLoading(false);
    }
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
      <SafeAreaView className="flex-1 bg-white p-5">
        <Text className="text-2xl font-bold text-center mt-12 mb-10">Organiser Sign Up</Text>

        {error && (
          <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
        )}

        <TextInput
          placeholder="First Name"
          className="border border-gray-300 p-3 rounded-lg mb-4 text-base"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          placeholder="Last Name"
          className="border border-gray-300 p-3 rounded-lg mb-4 text-base"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          placeholder="Email"
          className="border border-gray-300 p-3 rounded-lg mb-4 text-base"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          className="border border-gray-300 p-3 rounded-lg mb-4 text-base"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          className="border border-gray-300 p-3 rounded-lg mb-4 text-base"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          className="bg-[#28B900] p-4 rounded-lg items-center mt-2.5 opacity-100"
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-base font-bold">SIGN UP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} className="mt-5">
          <Text className="text-center text-gray-700">Already have an account? Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBack} className="mt-8">
          <Text className="text-center text-blue-500 text-base">← Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}
