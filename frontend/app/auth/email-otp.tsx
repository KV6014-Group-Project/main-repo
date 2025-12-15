import * as React from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';

export default function EmailOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const { user, otpVerified, setOtpVerified } = useAuth();

  const [code, setCode] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (otpVerified) {
      const roleName = (params.role || user?.role?.name || '').toLowerCase();
      if (roleName === 'organiser') {
        router.replace('/organiser');
      } else if (roleName === 'promoter') {
        router.replace('/promoter');
      }
    }
  }, [otpVerified, params.role, router, user?.role?.name]);

  const handleVerify = async () => {
    if (submitting) return;
    if (!code.trim()) {
      setError('Please enter the code.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await setOtpVerified(true);

      const roleName = (params.role || user?.role?.name || '').toLowerCase();
      if (roleName === 'organiser') {
        router.replace('/organiser');
      } else if (roleName === 'promoter') {
        router.replace('/promoter');
      } else {
        router.replace('/');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to verify code.');
    } finally {
      setSubmitting(false);
    }
  };

  const email = user?.email || '';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white p-6">
        <Text className="text-2xl font-bold text-center mt-12">Email Verification</Text>
        <Text className="text-sm text-center text-gray-500 mt-2 mb-10">
          Enter the code we sent to {email || 'your email'}.
        </Text>

        {error && <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>}

        <View className="mb-6">
          <Text className="text-base font-medium mb-2 text-gray-700">OTP Code</Text>
          <TextInput
            placeholder="Enter 6-digit code"
            className="border border-gray-300 p-3 rounded-lg text-base"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
        </View>

        <TouchableOpacity
          className={`p-4 rounded-xl items-center ${submitting ? 'bg-gray-400' : 'bg-[#28B900]'}`}
          onPress={handleVerify}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white text-lg font-bold">Verify</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCode('123456')}
          className="mt-5"
          disabled={submitting}
        >
          <Text className="text-center text-gray-500">Use demo code</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}
