import React from 'react';
import QRScannerComponent from '../components/qr-scanner';
import { View, StyleSheet } from 'react-native';

export default function QRCodePage() {
  return (
    <View style={styles.container}>
      <QRScannerComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});