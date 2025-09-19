import QRScanner from '@/components/qr-scanner';
import RecordsList from '@/components/records-list';
import RegistrationForm from '@/components/registration-form';
import { QRRecord, getAllRecords, initDatabase } from '@/utils/database';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [qrCode, setQrCode] = useState('');
  const [records, setRecords] = useState<QRRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const setup = async () => {
      try {
        await initDatabase();
        await loadRecords();
      } catch (error) {
        console.error('Setup error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    setup();
  }, []);

  const loadRecords = async () => {
    try {
      const allRecords = await getAllRecords();
      allRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecords(allRecords);
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  const handleScan = (data: string) => {
    setQrCode(data);
  };

  const handleRegistrationComplete = () => {
    setQrCode('');
    loadRecords();
  };

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <View style={styles.scannerSection}>
        <QRScanner onScan={handleScan} />
      </View>
      <View style={styles.formSection}>
        <RegistrationForm 
          qrCode={qrCode}
          onRegistrationComplete={handleRegistrationComplete}
        />
      </View>
      {records.length > 0 && (
        <Text style={[styles.recordsTitle, { color: theme.colors.onSurface }]}>Recent Scans</Text>
      )}
    </View>
  ), [qrCode, records.length, theme]);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
        {isLoading ? 'Loading...' : 'No records yet. Scan a QR code to begin.'}
      </Text>
    </View>
  ), [isLoading, theme]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header>
        <Appbar.Content title="📱 QR Registration" />
      </Appbar.Header>

      <FlatList
        data={records}
        renderItem={({ item }) => (
          <RecordsList
            records={[item]}
            onRecordChange={loadRecords}
            isLoading={false}
          />
        )}
        keyExtractor={item => item.qrcode}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 48,
  },
  headerContainer: {
    gap: 16,
    marginBottom: 16,
  },
  scannerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  formSection: {
    paddingVertical: 8,
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});