import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface QRScannerProps {
  onScan: (data: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [useManualInput, setUseManualInput] = useState(false);
  const [manualQRValue, setManualQRValue] = useState('');
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (permission == null) return;
    setHasPermission(permission.granted);
  }, [permission]);

  useEffect(() => {
    if (permission == null) {
      (async () => {
        try {
          const res = await requestPermission();
          setHasPermission(!!res?.granted);
        } catch {
          setHasPermission(false);
          setUseManualInput(true);
        }
      })();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBarCodeScanned = useCallback(
    ({ data }: { data: string; type: string }) => {
      if (scanned || !data || !data.trim()) return;
      setScanned(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onScan(data.trim());
      setTimeout(() => setScanned(false), 2000);
    },
    [onScan, scanned]
  );

  const handleManualSubmit = () => {
    if (!manualQRValue.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onScan(manualQRValue.trim());
    setManualQRValue('');
  };

  const requestCamera = async () => {
    try {
      const res = await requestPermission();
      setHasPermission(!!res?.granted);
      if (!res?.granted) setUseManualInput(true);
    } catch {
      setHasPermission(false);
      setUseManualInput(true);
    }
  };

  if (hasPermission === false || useManualInput) {
    return (
      <View style={styles.container}>
        <View style={styles.scannerHeader}>
          <Text style={styles.scannerTitle}>📱 QR Input</Text>
          <View style={styles.scannerStatus}>
            <View style={[styles.statusDot, { backgroundColor: Colors[colorScheme ?? 'light'].warning }]} />
            <Text style={styles.statusText}>Manual input mode</Text>
          </View>
        </View>
        <View style={[styles.scannerContainer, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
          <View style={styles.manualInputContainer}>
            <Text style={styles.manualInputLabel}>Enter QR code value manually:</Text>
            <TextInput
              style={[
                styles.manualInput,
                {
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  borderColor: Colors[colorScheme ?? 'light'].border,
                  color: Colors[colorScheme ?? 'light'].text,
                },
              ]}
              value={manualQRValue}
              onChangeText={setManualQRValue}
              placeholder="Enter QR code value"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.buttonRow}>
              <Button
                title="Submit QR Value"
                onPress={handleManualSubmit}
                disabled={!manualQRValue.trim()}
                color={Colors[colorScheme ?? 'light'].primary}
              />
              <Button title="Try Camera Again" onPress={requestCamera} color={Colors[colorScheme ?? 'light'].secondary} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.scannerHeader}>
          <Text style={styles.scannerTitle}>📸 QR Scanner</Text>
          <View style={styles.scannerStatus}>
            <View style={[styles.statusDot, { backgroundColor: Colors[colorScheme ?? 'light'].warning }]} />
            <Text style={styles.statusText}>Requesting camera permission...</Text>
          </View>
        </View>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Initializing camera...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerHeader}>
        <Text style={styles.scannerTitle}>📸 QR Scanner</Text>
        <View style={styles.scannerStatus}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: scanned ? Colors[colorScheme ?? 'light'].warning : Colors[colorScheme ?? 'light'].success },
            ]}
          />
          <Text style={styles.statusText}>{scanned ? 'Processing scan...' : 'Ready to scan'}</Text>
        </View>
      </View>

      <View style={[styles.scannerContainer, { borderColor: scanned ? Colors[colorScheme ?? 'light'].warning : Colors[colorScheme ?? 'light'].success }]}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerTarget} />
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
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTarget: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  loading: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
  },
  manualInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  manualInputLabel: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  manualInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
});