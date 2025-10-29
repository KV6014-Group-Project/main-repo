import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { SessionProvider, useSession } from '@/providers/SessionProvider';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <SessionProvider>
        <AuthGuard>
          <Stack
            screenOptions={{
              title: 'React Native Reusables',
              headerTransparent: true,
              headerRight: () => <ThemeToggle />,
            }}
          />
        </AuthGuard>
      </SessionProvider>
      <PortalHost />
    </ThemeProvider>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, status } = useSession();
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();

  React.useEffect(() => {
    if (status !== 'ready') return;
    const first = segments[0];
    const isProtected = first === 'organiser' || first === 'promoter';
    const isAuthScreen = pathname?.startsWith('/auth');

    if (isProtected) {
      if (!session || !session.token) {
        if (!isAuthScreen) router.replace('/auth');
      }
    }
    // If already authed and on /auth/*, send to role landing
    if (isAuthScreen && session) {
      if (session.role === 'organiser') router.replace('/organiser');
      else if (session.role === 'promoter') router.replace('/promoter');
      else if (session.role === 'participant') router.replace('/participant');
    }
  }, [status, session, segments, pathname, router]);

  return <>{children}</>;
}
