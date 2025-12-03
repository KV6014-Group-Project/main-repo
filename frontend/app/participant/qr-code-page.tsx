import React from 'react';
import QRScannerComponent from '../components/qr-scanner';
import { View } from 'react-native';

export default function QRCodePage() {
  return (
    <View className="flex-1 bg-white">
      <QRScannerComponent />
    </View>
  );
}