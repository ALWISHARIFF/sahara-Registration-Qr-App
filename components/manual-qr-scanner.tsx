import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ManualQRScannerProps {
  onScan: (data: string) => void;
}

export default function ManualQRScanner({ onScan }: ManualQRScannerProps) {
  const [qrValue, setQrValue] = useState('');
  const [scanned, setScanned] = useState(false);
  const colorScheme = useColorScheme();

  const handleScan = () => {
    if (!qrValue.trim()) return;
    
    setScanned(true);
    
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Pass data to parent component
    onScan(qrValue.trim());
    
    // Reset scanner after a short delay
    setTimeout(() => {
      setScanned(false);
      setQrValue('');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.scannerHeader}>
        <Text style={styles.scannerTitle}>📱 QR Input</Text>
        <View style={styles.scannerStatus}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: scanned ? Colors[colorScheme ?? 'light'].warning : Colors[colorScheme ?? 'light'].success }
          ]} />
          <Text style={styles.statusText}>
            {scanned ? 'Processing...' : 'Ready'}
          </Text>
        </View>
      </View>
      
      <View style={[
        styles.scannerContainer, 
        { borderColor: scanned ? Colors[colorScheme ?? 'light'].warning : Colors[colorScheme ?? 'light'].success }
      ]}>
        <View style={styles.inputContainer}>
          <Text style={styles.infoText}>
            Enter QR code value manually:
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].card,
                borderColor: Colors[colorScheme ?? 'light'].border,
                color: Colors[colorScheme ?? 'light'].text
              }
            ]}
            value={qrValue}
            onChangeText={setQrValue}
            placeholder="Enter QR code value"
            placeholderTextColor="#999"
          />
          <Button
            title="Submit QR Value"
            onPress={handleScan}
            disabled={!qrValue.trim() || scanned}
            color={Colors[colorScheme ?? 'light'].primary}
          />
          <Text style={styles.noteText}>
            Note: Camera scanning will be enabled after fixing dependencies.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scannerHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  scannerTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  scannerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  scannerContainer: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#f8f9fa',
  },
  inputContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
