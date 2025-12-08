import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
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
      <View className="flex-1 w-full aspect-square rounded-2xl overflow-hidden">
        <CameraView
          className="flex-1 w-full"
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={isConfirming ? undefined : handleBarcodeScanned}
        />
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