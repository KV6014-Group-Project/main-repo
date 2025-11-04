import '@/global.css';

import { SessionProvider, useSession } from '@/providers/SessionProvider';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/lib/useTheme';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

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
        <RootLayoutContent />
      </SessionProvider>
      <PortalHost />
    </ThemeProvider>
  );
}

function RootLayoutContent() {
  const { navTheme } = useTheme();
  const { status } = useSession();

  // Show loading screen while session is being initialized
  if (status !== 'ready') {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="currentColor" />
      </View>
    );
  }

  return (
    <ThemeProvider value={navTheme}>
      <AuthGuard>
        <Stack
          screenOptions={{
            title: 'React Native Reusables',
            headerTransparent: true,
            headerRight: () => <ThemeToggle />,
          }}
        />
      </AuthGuard>
    </ThemeProvider>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();

  React.useEffect(() => {
    // Get route info
    const first = segments[0];
    const isProtected = first === 'organiser' || first === 'promoter';
    const isAuthScreen = pathname?.startsWith('/auth');
    const isRoot = pathname === '/' || pathname === null;
    const isWelcomeScreen = pathname === '/welcome';
    const isParticipantRoute = pathname === '/participant';

    // No session: guide to welcome
    if (!session) {
      if (!isWelcomeScreen && !isAuthScreen) {
        router.replace('/welcome');
      }
      return;
    }

    // User is authenticated - enforce role-based access
    const userRole = session.role;

    // If user is on a protected route that doesn't match their role, redirect
    if (isProtected && userRole !== first) {
      // Redirect to appropriate home screen
      if (userRole === 'organiser') router.replace('/organiser');
      else if (userRole === 'promoter') router.replace('/promoter');
      else if (userRole === 'participant') router.replace('/');
      return;
    }

    // If user is on root (/) they must be a participant
    if (isRoot && userRole !== 'participant') {
      if (userRole === 'organiser') router.replace('/organiser');
      else if (userRole === 'promoter') router.replace('/promoter');
      return;
    }

    // If authenticated user is on welcome or auth screen, redirect to their home
    if ((isWelcomeScreen || isAuthScreen) && session) {
      if (userRole === 'organiser') router.replace('/organiser');
      else if (userRole === 'promoter') router.replace('/promoter');
      else if (userRole === 'participant') router.replace('/');
      return;
    }
  }, [session, segments, pathname, router]);

  return <>{children}</>;
}
