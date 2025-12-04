import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  title?: string;
  subtitle?: string;
}

export default function QRCodeDisplay({ 
  value, 
  size = 250,
  title,
  subtitle 
}: QRCodeDisplayProps) {
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
          ecl="M"
        />
      </View>
      <Text className="text-xs text-gray-400 mt-4 text-center">
        Scan to RSVP for this event
      </Text>
    </View>
  );
}
