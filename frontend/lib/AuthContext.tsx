import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ============ Types ============

export type AuthRole = {
  id: string;
  name: string;
  description: string;
};

export type AuthUser = {
  id: string;
  email: string;
  role: AuthRole;
  first_name: string;
  last_name: string;
  phone: string | null;
  date_joined: string;
};

type AuthContextValue = {
  /** The currently authenticated user, or null if not logged in */
  user: AuthUser | null;
  /** The auth token, or null if not logged in */
  token: string | null;
  /** True once OTP step has been completed (fake OTP gating) */
  otpVerified: boolean;
  /** True while hydrating auth state from storage */
  isLoading: boolean;
  /** True once hydration is complete */
  isHydrated: boolean;
  /** Sign in with token and user object (typically after login/register API call) */
  signIn: (token: string, user: AuthUser) => Promise<void>;
  /** Mark OTP as verified/unverified and persist */
  setOtpVerified: (verified: boolean) => Promise<void>;
  /** Sign out and clear stored credentials */
  signOut: () => Promise<void>;
};

// ============ Storage Keys ============

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const OTP_VERIFIED_KEY = 'auth_otp_verified';

// ============ Secure Storage Helpers ============

/**
 * SecureStore is not available on web, so we fall back to localStorage.
 * In production, consider a more secure web solution or server-side sessions.
 */
async function setSecureItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getSecureItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function deleteSecureItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

// ============ Context ============

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============ In-memory token for API requests ============

let inMemoryToken: string | null = null;

/**
 * Get the current auth token synchronously (for use in API layer).
 * This reads from memory, which is populated by AuthProvider on hydration/signIn.
 */
export function getAuthToken(): string | null {
  return inMemoryToken;
}

// ============ Provider ============

type AuthProviderProps = {
  children: React.ReactNode;
  /** Called when hydration is complete */
  onHydrated?: () => void;
};

export function AuthProvider({ children, onHydrated }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [otpVerified, setOtpVerifiedState] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate auth state from secure storage on mount
  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      try {
        const [storedToken, storedUserJson, storedOtpVerified] = await Promise.all([
          getSecureItem(TOKEN_KEY),
          getSecureItem(USER_KEY),
          getSecureItem(OTP_VERIFIED_KEY),
        ]);

        if (!isMounted) return;

        if (storedToken && storedUserJson) {
          const storedUser = JSON.parse(storedUserJson) as AuthUser;
          setToken(storedToken);
          setUser(storedUser);
          inMemoryToken = storedToken;
        }

        if (storedOtpVerified === null) {
          setOtpVerifiedState(true);
        } else {
          setOtpVerifiedState(storedOtpVerified === 'true');
        }
      } catch (error) {
        // If storage read fails, start with no auth
        console.warn('Failed to hydrate auth state:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsHydrated(true);
          onHydrated?.();
        }
      }
    }

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [onHydrated]);

  const signIn = useCallback(async (newToken: string, newUser: AuthUser) => {
    // Update memory first for immediate use
    inMemoryToken = newToken;
    setToken(newToken);
    setUser(newUser);

    // Persist to secure storage
    await Promise.all([
      setSecureItem(TOKEN_KEY, newToken),
      setSecureItem(USER_KEY, JSON.stringify(newUser)),
    ]);
  }, []);

  const setOtpVerified = useCallback(async (verified: boolean) => {
    setOtpVerifiedState(verified);
    await setSecureItem(OTP_VERIFIED_KEY, verified ? 'true' : 'false');
  }, []);

  const signOut = useCallback(async () => {
    // Clear memory
    inMemoryToken = null;
    setToken(null);
    setUser(null);
    setOtpVerifiedState(true);

    // Clear storage
    await Promise.all([
      deleteSecureItem(TOKEN_KEY),
      deleteSecureItem(USER_KEY),
      deleteSecureItem(OTP_VERIFIED_KEY),
    ]);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      otpVerified,
      isLoading,
      isHydrated,
      signIn,
      setOtpVerified,
      signOut,
    }),
    [user, token, otpVerified, isLoading, isHydrated, signIn, setOtpVerified, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============ Hook ============

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
