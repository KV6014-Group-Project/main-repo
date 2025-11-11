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
            title: 'Event Manager',
            headerTransparent: true,
            headerRight: () => <ThemeToggle />,
          }}
        />
      </AuthGuard>
    </ThemeProvider>
  );
}

// Role to home route mapping
const ROLE_HOME_ROUTES: Record<string, string> = {
  organiser: '/organiser',
  promoter: '/promoter',
  participant: '/',
};

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();

  React.useEffect(() => {
    const isAuthScreen = pathname?.startsWith('/auth');
    const isWelcomeScreen = pathname === '/welcome';
    const publicRoutes = isAuthScreen || isWelcomeScreen;

    // Redirect unauthenticated users to welcome screen
    if (!session) {
      if (!publicRoutes) {
        router.replace('/welcome');
      }
      return;
    }

    // User is authenticated - enforce role-based routing
    const userRole = session.role;
    const homeRoute = ROLE_HOME_ROUTES[userRole] || '/';
    const firstSegment = segments[0];
    const protectedRoute = firstSegment === 'organiser' || firstSegment === 'promoter';

    // Redirect authenticated users away from public routes
    if (publicRoutes) {
      router.replace(homeRoute);
      return;
    }

    // Enforce role-based access for protected routes
    if (protectedRoute && userRole !== firstSegment) {
      router.replace(homeRoute);
      return;
    }

    // Root route is participant-only
    if ((pathname === '/' || pathname === null) && userRole !== 'participant') {
      router.replace(homeRoute);
      return;
    }
  }, [session, segments, pathname, router]);

  return <>{children}</>;
}
