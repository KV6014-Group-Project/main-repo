import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  title?: string;
  subtitle?: string;
}

export interface QRCodeDisplayRef {
  getDataURL: () => Promise<string>;
}

const QRCodeDisplay = forwardRef<QRCodeDisplayRef, QRCodeDisplayProps>(({ 
  value, 
  size = 250,
  title,
  subtitle 
}, ref) => {
  const qrRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    getDataURL: () => {
      return new Promise<string>((resolve, reject) => {
        if (!qrRef.current) {
          reject(new Error('QR Code reference not available'));
          return;
        }
        
        qrRef.current.toDataURL((dataURL: string) => {
          resolve(dataURL);
        });
      });
    }
  }));

  if (!value) {
    return (
      <View className="items-center justify-center p-8 bg-neutral-100 rounded-xl">
        <Text className="text-gray-500">No QR code data available</Text>
      </View>
    );
  }

  return (
    <View className="items-center bg-white rounded-xl p-6">
      {title && (
        <Text className="text-lg font-bold mb-2 text-center">{title}</Text>
      )}
      {subtitle && (
        <Text className="text-sm text-gray-500 mb-4 text-center">{subtitle}</Text>
      )}
      <View className="bg-white p-4 rounded-lg">
        <QRCode
          value={value}
          size={size}
          backgroundColor="white"
          color="black"
          ecl="H"  // Changed from "M" to "H" for high error correction
          quietZone={10}  // Add padding around QR code
          getRef={(ref) => (qrRef.current = ref)}
        />
      </View>
      <Text className="text-xs text-gray-400 mt-4 text-center">
        Scan to RSVP for this event
      </Text>
      {/* Debug info */}
      <Text className="text-xs text-gray-300 mt-2 text-center">
        Data size: {value.length} chars
      </Text>
    </View>
  );
});

QRCodeDisplay.displayName = 'QRCodeDisplay';

export default QRCodeDisplay;