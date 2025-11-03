import '@/global.css';

import { SessionProvider, useSession } from '@/providers/SessionProvider';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/lib/useTheme';
import React from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { navTheme, isDark } = useTheme();

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
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
    const first = segments[0];
    const isProtected = first === 'organiser' || first === 'promoter';
    const isAuthScreen = pathname?.startsWith('/auth');
    const isRoot = pathname === '/' || pathname === null;
    const isWelcomeScreen = pathname === '/welcome';

    // If no session and not on welcome or auth screen, redirect to welcome
    if (!session && !isWelcomeScreen && !isAuthScreen) {
      router.replace('/welcome');
      return;
    }

    // Protect organiser and promoter routes - require token
    if (isProtected) {
      if (!session || !session.token) {
        if (!isAuthScreen && !isWelcomeScreen) router.replace('/auth');
        return;
      }
    }

    // Protect root route - require participant session
    if (isRoot) {
      if (!session || session.role !== 'participant') {
        if (!isAuthScreen && !isWelcomeScreen) router.replace('/auth');
        return;
      }
    }

    // Redirect authenticated users away from auth and welcome screens
    if ((isAuthScreen || isWelcomeScreen) && session) {
      if (session.role === 'organiser') router.replace('/organiser');
      else if (session.role === 'promoter') router.replace('/promoter');
      else if (session.role === 'participant') router.replace('/');
    }
  }, [status, session, segments, pathname, router]);

  if (status !== 'ready') return null;
  return <>{children}</>;
}
