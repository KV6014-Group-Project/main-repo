import { AuthForm } from '@/components/auth';
import { ScreenLayout } from '@/components/layouts';
import { useSession } from '@/providers/SessionProvider';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function OrganiserAuth() {
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
        const session = await signIn(params.email, params.password);
        if (session?.role === 'organiser') router.replace('/organiser');
      } else {
        const session = await signUp({
          email: params.email,
          password: params.password,
          role: 'organiser',
          firstName: params.firstName,
          lastName: params.lastName,
        });
        if (session?.role === 'organiser') router.replace('/organiser');
      }
    },
    [signIn, signUp, router]
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenLayout
        title="Organiser access"
        subtitle="Create and manage events with full control."
        showBackButton={true}
        onBackPress={router.back}
      >
        <AuthForm role="organiser" router={router} onSubmit={handleSubmit} />
      </ScreenLayout>
    </>
  );
}
