import AsyncStorage from '@react-native-async-storage/async-storage';

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

const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

let authToken: string | null = null;
let authUser: AuthUser | null = null;
let authHydrated = false;
let hydrationPromise: Promise<void> | null = null;

export async function setAuthSession(token: string, user: AuthUser) {
  authToken = token;
  authUser = user;

  await AsyncStorage.multiSet([
    [TOKEN_STORAGE_KEY, token],
    [USER_STORAGE_KEY, JSON.stringify(user)],
  ]);
}

export async function clearAuthSession() {
  authToken = null;
  authUser = null;

  await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
}

export function getAuthToken() {
  return authToken;
}

export function getCurrentUser() {
  return authUser;
}

export function hasHydratedAuth() {
  return authHydrated;
}

export async function hydrateAuthSession() {
  if (authHydrated) {
    return;
  }

  if (hydrationPromise) {
    return hydrationPromise;
  }

  hydrationPromise = (async () => {
    try {
      const entries = await AsyncStorage.multiGet([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
      const tokenEntry = entries.find(([key]) => key === TOKEN_STORAGE_KEY);
      const userEntry = entries.find(([key]) => key === USER_STORAGE_KEY);

      const storedToken = tokenEntry?.[1] ?? null;
      const storedUser = userEntry?.[1] ?? null;

      authToken = storedToken;
      authUser = storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
    } catch (error) {
      authToken = null;
      authUser = null;
    } finally {
      authHydrated = true;
      hydrationPromise = null;
    }
  })();

  return hydrationPromise;
}
