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

type Role = 'participant' | 'organiser' | 'promoter';

type RoleRouteConfig = {
  role: Role;
  home: string;
  protectedPrefixes: string[];
};

const ROLE_CONFIG: Record<Role, RoleRouteConfig> = {
  participant: {
    role: 'participant',
    home: '/',
    protectedPrefixes: ['/participant'],
  },
  organiser: {
    role: 'organiser',
    home: '/organiser',
    protectedPrefixes: ['/organiser'],
  },
  promoter: {
    role: 'promoter',
    home: '/promoter',
    protectedPrefixes: ['/promoter'],
  },
};

const PUBLIC_ROUTES = ['/welcome', '/auth'];
const PUBLIC_PREFIXES = ['/auth'];

function isPublicPath(pathname: string | null): boolean {
  if (!pathname) return true;
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function resolveRoleConfig(role: Role | undefined | null): RoleRouteConfig | null {
  if (!role) return null;
  return ROLE_CONFIG[role] ?? null;
}

function getFirstSegment(pathname: string | null): string | null {
  if (!pathname) return null;
  const [, first] = pathname.split('/');
  return first || null;
}

/**
 * Compute the appropriate redirect path for a given session + pathname.
 * Returns null when the current location is allowed.
 */
function getRedirectPath(params: { session: { role: Role } | null; pathname: string | null }): string | null {
  const { session, pathname } = params;

  // No session: keep user on public entry points, otherwise send to welcome
  if (!session) {
    if (isPublicPath(pathname)) return null;
    return '/welcome';
  }

  const roleConfig = resolveRoleConfig(session.role);
  if (!roleConfig) {
    // Unknown role, send to generic entry
    return '/welcome';
  }

  const current = pathname ?? '/';
  const firstSegment = getFirstSegment(current);

  // If on an auth/welcome route while authenticated, push to home
  if (isPublicPath(current)) {
    return roleConfig.home;
  }

  // Allow root for participants, redirect other roles to their dashboards
  if (current === '/') {
    return roleConfig.role === 'participant' ? null : roleConfig.home;
  }

  // Basic protected segment check: if route segment mismatches role expectation, send home
  if (firstSegment && !roleConfig.protectedPrefixes.some((prefix) => current.startsWith(prefix))) {
    // Participant hitting organiser/promoter routes or vice versa
    // Let participant access generic routes; others go home if in wrong segment
    if (roleConfig.role === 'participant') {
      return null;
    }
    // Non-participant in a segment they do not own
    if (['organiser', 'promoter', 'participant'].includes(firstSegment)) {
      return roleConfig.home;
    }
  }

  return null;
}

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

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments(); // retained in case nested stacks are introduced

  React.useEffect(() => {
    const redirect = getRedirectPath({
      session,
      pathname,
    });

    if (redirect && redirect !== pathname) {
      router.replace(redirect);
    }
  }, [session, pathname, router, segments]);

  return <>{children}</>;
}
