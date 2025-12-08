import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Alert, AppState, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useParticipant } from '../lib/ParticipantContext';
import { formatEventTime, parseQRPayload } from '../lib/offlineParser';

export default function QRScannerComponent() {
  const [lastScanned, setLastScanned] = useState('');
  const [pendingPayload, setPendingPayload] = useState<string | null>(null);
  const [pendingEventTitle, setPendingEventTitle] = useState<string | null>(null);
  const [pendingEventTime, setPendingEventTime] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const { addScannedEvent, isSyncing } = useParticipant();
  const isConfirming = useMemo(() => pendingPayload !== null, [pendingPayload]);
  
  // 1. Get navigation focus state
  const isFocused = useIsFocused();
  
  // 2. Get App background/foreground state
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // 3. Determine if camera should be active
  // Only active if permissions granted, screen is focused, and app is in foreground
  const isCameraActive = isFocused && appStateVisible === 'active' && permission?.granted;

  const resetPendingScan = () => {
    setPendingPayload(null);
    setPendingEventTitle(null);
    setPendingEventTime(null);
  };

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (isConfirming) return;

    console.log(`Type: ${type}, Data: ${data}`);
    const parsed = parseQRPayload(data);

    if (!parsed) {
      Alert.alert(
        "Invalid QR Code",
        "This doesn't appear to be a valid event QR code. Please try scanning a different code.",
        [
          {
            text: "Try Again",
          },
        ]
      );
      return;
    }

    setPendingPayload(data);
    setPendingEventTitle(parsed.title);
    setPendingEventTime(formatEventTime(parsed.startTime));
  };

  const confirmScan = () => {
    if (!pendingPayload) return;

    const success = addScannedEvent(pendingPayload);
    setLastScanned(pendingEventTitle || pendingPayload);

    if (success) {
      Alert.alert(
        "Event Added! 🎉",
        "The event has been added to your list. It will sync when you're online.",
        [
          {
            text: "View Events",
            onPress: () => router.replace('/participant'),
          },
          {
            text: "Scan Another",
            onPress: () => resetPendingScan(),
            style: "cancel",
          },
        ]
      );
    } else {
      Alert.alert(
        "Unable to Save",
        "Something went wrong while saving this event. Please try again.",
        [
          {
            text: "Okay",
            onPress: () => resetPendingScan(),
          },
        ]
      );
    }

    resetPendingScan();
  };

  const goBack = () => {
    router.replace('/participant');
  };

  // Handle permission states
  if (!permission) {
    return (
      <View className="flex-1 w-full max-w-[600px] self-center justify-center items-center p-5">
        <Text className="text-center text-base text-gray-700 mb-3">Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 w-full max-w-[600px] self-center justify-center items-center p-5">
        <Text className="text-center text-base text-gray-700 mb-3">Camera access is needed to scan QR codes.</Text>
        <Pressable className="bg-blue-600 py-3 px-6 rounded-lg items-center mb-2" onPress={requestPermission}>
          <Text className="text-white text-base font-semibold">Enable Camera</Text>
        </Pressable>
        <Pressable className="py-2.5 items-center" onPress={goBack}>
          <Text className="text-blue-600 text-base font-medium">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 w-full max-w-[600px] self-center">
      <View className="flex-1 w-full bg-black relative">
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          active={isCameraActive}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={isConfirming ? undefined : handleBarcodeScanned}
        />
        {/* QR Code scanning overlay */}
        <View className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <View className="w-48 h-48 border-2 border-white rounded-lg opacity-50">
            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
          </View>
        </View>
      </View>

      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-lg text-gray-900 text-center">
          {isConfirming
            ? 'Confirm this event?'
            : lastScanned
              ? 'Scanned!'
              : 'Point the camera at an event QR code'}
        </Text>
        {isConfirming ? (
          <View className="w-full max-w-sm mt-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-900 text-center">
              {pendingEventTitle || 'Unknown Event'}
            </Text>
            <Text className="mt-1 text-sm text-gray-500 text-center">
              {pendingEventTime || 'Time TBD'}
            </Text>
            <View className="mt-5 gap-3">
              <Pressable
                className="bg-blue-600 py-3 px-6 rounded-lg items-center"
                onPress={confirmScan}
                disabled={isSyncing}
              >
                <Text className="text-white text-base font-semibold">
                  {isSyncing ? 'Saving…' : 'Add to My Events'}
                </Text>
              </Pressable>
              <Pressable
                className="py-2.5 items-center border border-gray-200 rounded-lg"
                onPress={resetPendingScan}
              >
                <Text className="text-gray-700 text-base font-medium">Scan Again</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable className="mt-3 py-2.5 items-center" onPress={goBack}>
            <Text className="text-blue-600 text-base font-medium">Back</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}