/**
 * Device Identity Layer
 *
 * Manages a persistent, anonymous Device UUID using expo-secure-store.
 * This ID is used to identify participants without requiring account creation.
 */
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const DEVICE_ID_KEY = "participant_device_id";

/**
 * Generate a UUID v4.
 * Uses crypto.randomUUID where available, falls back to manual generation.
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Store a value securely.
 * Uses SecureStore on native, localStorage on web.
 */
async function setSecureItem(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

/**
 * Retrieve a value from secure storage.
 */
async function getSecureItem(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

/**
 * Delete a value from secure storage.
 */
async function deleteSecureItem(key: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

/**
 * Get the persistent device ID.
 * Generates and stores a new UUID if none exists.
 */
export async function getDeviceId(): Promise<string> {
  let deviceId = await getSecureItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = generateUUID();
    await setSecureItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

/**
 * Reset the device ID.
 * Useful for testing or when user wants to "reset" their identity.
 */
export async function resetDeviceId(): Promise<void> {
  await deleteSecureItem(DEVICE_ID_KEY);
}
