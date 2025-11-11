import { AuthForm } from '@/components/auth';
import { ScreenLayout } from '@/components/layouts';
import { useSession } from '@/providers/SessionProvider';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function PromoterAuth() {
  const { signIn, signUp } = useSession();
  const router = useRouter();

  const handleSubmit = React.useCallback(
    async (params: {
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
        const session = await signUp({
          email: params.email,
          password: params.password,
          role: 'promoter',
          firstName: params.firstName,
          lastName: params.lastName,
        });
        if (session?.role === 'promoter') router.replace('/promoter');
      }
    },
    [signIn, signUp, router]
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenLayout
        title="Promoter access"
        subtitle="Connect organiser events to participants with shareable links."
      >
        <AuthForm role="promoter" onSubmit={handleSubmit} />
      </ScreenLayout>
    </>
  );
}


