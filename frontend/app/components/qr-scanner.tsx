import { CameraView, useCameraPermissions } from 'expo-camera';
import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function QRScannerComponent() {
  const [lastScanned, setLastScanned] = useState('');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setLastScanned(data);
    console.log(`Type: ${type}, Data: ${data}`);

    // Reset scanned state after 2 seconds to allow new scans
    setTimeout(() => setScanned(false), 2000);
  };

  const goBack = () => {
    // Try to use browser history first
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // If no history, go to home or referrer
      window.location.href = document.referrer || '/';
    }
  };

  // Handle permission states
  if (!permission) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.message}>Camera access is needed to scan QR codes.</Text>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Enable Camera</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={goBack}>
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      </View>

      <View style={styles.dataContainer}>
        <Text style={styles.dataValue}>
          {lastScanned || 'Point the camera at a QR code'}
        </Text>
        {scanned && (
          <Text style={styles.helperText}>Waiting a moment before scanning again…</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  primaryButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1a73e8',
    fontSize: 15,
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 18,
    color: '#111827',
    textAlign: 'center',
  },
  helperText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});