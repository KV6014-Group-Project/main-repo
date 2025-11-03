import { AuthForm } from '@/components/auth';
import { useSession } from '@/providers/SessionProvider';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

export default function PromoterAuth() {
  const { signIn, signUp } = useSession();
  const router = useRouter();

  const handleSubmit = React.useCallback(async (params: {
    mode: 'signin' | 'signup';
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  }) => {
    if (params.mode === 'signin') {
      const session = await signIn(params.email, params.password, 'promoter');
      if (session?.role === 'promoter') router.replace('/promoter');
    } else {
      const fullName = `${params.firstName} ${params.lastName}`;
      const session = await signUp({ 
        email: params.email, 
        password: params.password, 
        role: 'promoter',
        firstName: params.firstName,
        lastName: params.lastName
      });
      if (session?.role === 'promoter') router.replace('/promoter');
    }
  }, [signIn, signUp, router]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.select({ ios: 'padding', android: undefined })} 
      className="flex-1 items-center justify-center p-6"
    >
      <View className="w-full max-w-md gap-6">
        <AuthForm role="promoter" onSubmit={handleSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
}


