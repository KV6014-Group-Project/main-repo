import { CameraView, useCameraPermissions } from 'expo-camera';
import React from 'react';
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function QRScannerComponent() {
  const [lastScanned, setLastScanned] = useState('');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setLastScanned(data);
    console.log(`Type: ${type}, Data: ${data}`);

    // Reset scanned state after 2 seconds to allow new scans
    setTimeout(() => setScanned(false), 2000);
  };

  const goBack = () => {
    router.replace('/participant');
  };

  // Handle permission states
  if (!permission) {
    return (
      <View className="flex-1 w-full max-w-[600px] self-center">
        <Text className="text-center text-base text-gray-700 mb-3">Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 w-full max-w-[600px] self-center">
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
          {lastScanned || 'Point the camera at a QR code'}
        </Text>
        {scanned && (
          <>
            <Text className="mt-3 text-sm text-gray-500 text-center">Waiting a moment before scanning again…</Text>
            <Pressable className="mt-4 py-3 px-5 rounded-lg bg-blue-600" onPress={() => router.replace('/participant')}>
              <Text className="text-white font-semibold">Back to Participant Home</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}