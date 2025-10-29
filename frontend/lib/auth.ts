import type { AppStateStatus } from 'react-native';

// Optional AsyncStorage import with graceful fallback on web or when not installed
let AsyncStorage: {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
} | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (_err) {
  AsyncStorage = null;
}

export type Role = 'organiser' | 'promoter' | 'participant';

export type Session = {
  token?: string;
  role: Role;
} | null;

const SESSION_KEY = 'app.session.v1';

function isWeb(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (globalThis as any).document !== 'undefined';
}

async function storageGet(key: string): Promise<string | null> {
  if (AsyncStorage) return AsyncStorage.getItem(key);
  if (isWeb() && 'localStorage' in globalThis) {
    try {
      return globalThis.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return null;
}

async function storageSet(key: string, value: string): Promise<void> {
  if (AsyncStorage) return AsyncStorage.setItem(key, value);
  if (isWeb() && 'localStorage' in globalThis) {
    try {
      globalThis.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }
}

async function storageRemove(key: string): Promise<void> {
  if (AsyncStorage) return AsyncStorage.removeItem(key);
  if (isWeb() && 'localStorage' in globalThis) {
    try {
      globalThis.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

export async function getSession(): Promise<Session> {
  const raw = await storageGet(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function setSession(session: Session): Promise<void> {
  if (!session) {
    await clearSession();
    return;
  }
  await storageSet(SESSION_KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await storageRemove(SESSION_KEY);
}

// Stubbed auth flows — replace with real API when backend is ready
export async function signIn(email: string, password: string): Promise<Session> {
  // simple stub validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  // Default users sign in without selecting role here; caller should determine role context
  const session: Session = { token: `stub-${Date.now()}`, role: 'organiser' };
  await setSession(session);
  return session;
}

export async function signUp(params: {
  email: string;
  password: string;
  role: Role;
  name?: string;
}): Promise<Session> {
  const { email, password, role } = params;
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  if (role === 'participant') {
    // Participant acts as guest (no token)
    const session: Session = { role: 'participant' };
    await setSession(session);
    return session;
  }
  const session: Session = { token: `stub-${Date.now()}`, role };
  await setSession(session);
  return session;
}

export async function signOut(): Promise<void> {
  await clearSession();
}

// Optional: hook-friendly helper to subscribe to app state if needed later
// Kept here for future expansion without tight coupling.
export function onAppStateChange(_cb: (state: AppStateStatus) => void) {
  // no-op for now
}


