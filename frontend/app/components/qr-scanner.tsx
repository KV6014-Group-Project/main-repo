import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useParticipant } from '../lib/ParticipantContext';

export default function QRScannerComponent() {
  const [lastScanned, setLastScanned] = useState('');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const { addScannedEvent, isSyncing } = useParticipant();

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;

    setScanned(true);
    setLastScanned(data);
    console.log(`Type: ${type}, Data: ${data}`);

    // Try to add the event to the queue
    const success = addScannedEvent(data);

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
            onPress: () => setScanned(false),
            style: "cancel",
          },
        ]
      );
    } else {
      Alert.alert(
        "Invalid QR Code",
        "This doesn't appear to be a valid event QR code. Please try scanning a different code.",
        [
          {
            text: "Try Again",
            onPress: () => setScanned(false),
          },
        ]
      );
    }
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
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      </View>

      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-lg text-gray-900 text-center">
          {lastScanned ? 'Scanned!' : 'Point the camera at an event QR code'}
        </Text>
        {scanned && (
          <>
            <Text className="mt-3 text-sm text-gray-500 text-center">Tap a button above to continue</Text>
          </>
        )}
        {!scanned && (
          <Pressable className="mt-4 py-3 px-5 rounded-lg bg-gray-200" onPress={goBack}>
            <Text className="text-gray-700 font-semibold">Cancel</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}