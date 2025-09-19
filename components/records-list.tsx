import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput, useTheme } from 'react-native-paper';

import { exportToCSV } from '@/utils/csv-export';
import { QRRecord, deleteRecord, getAllRecords, updateRecord } from '@/utils/database';
import { formatDisplayTime } from '@/utils/date-formatter';

interface RecordsListProps {
  records: QRRecord[];
  onRecordChange: () => void;
  isLoading: boolean;
  header?: React.ReactElement | null;
}

export default function RecordsList({ records, onRecordChange, isLoading, header }: RecordsListProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const theme = useTheme();

  const handleExport = async () => {
    if (records.length === 0) {
      Alert.alert('No Records', 'There are no records to export.');
      return;
    }
  
    setIsExporting(true);
    try {
      const latestRecords = await getAllRecords();
      latestRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
      const success = await exportToCSV(latestRecords);
      
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Alert.alert('Export Failed', 'Unable to export records. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Error', 'Failed to export records. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEdit = (qrcode: string, currentName: string) => {
    setEditingRecord(qrcode);
    setEditName(currentName);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;
    
    try {
      await updateRecord(editingRecord, editName.trim() || 'Unnamed');
      setEditingRecord(null);
      setEditName('');
      onRecordChange();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Edit error:', error);
      Alert.alert('Edit Error', 'Failed to update record. Please try again.');
    }
  };

  const handleDelete = async (qrcode: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecord(qrcode);
              onRecordChange();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Delete Error', 'Failed to delete record. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: QRRecord }) => {
    const isEditing = editingRecord === item.qrcode;
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="bodyMedium" style={{ fontFamily: 'monospace', marginBottom: 8 }}>
            {item.qrcode}
          </Text>
          
          {isEditing ? (
            <TextInput
              mode="outlined"
              value={editName}
              onChangeText={setEditName}
              autoFocus
              style={{ marginBottom: 8 }}
            />
          ) : (
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
              {item.name}
            </Text>
          )}
          
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            📅 {formatDisplayTime(item.timestamp)}
          </Text>
        </Card.Content>
        
        <Card.Actions>
          {isEditing ? (
            <>
              <Button onPress={handleSaveEdit} mode="contained">
                Save
              </Button>
              <Button onPress={() => setEditingRecord(null)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onPress={() => handleEdit(item.qrcode, item.name)}>
                Edit
              </Button>
              <Button onPress={() => handleDelete(item.qrcode)} textColor={theme.colors.error}>
                Delete
              </Button>
            </>
          )}
        </Card.Actions>
      </Card>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="bodyLarge" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
        {isLoading ? 'Loading records...' : 'No QR codes registered yet. Scan your first code above!'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
     <View style={styles.header}>
  <Text variant="titleMedium" style={{ fontWeight: 'bold', flexShrink: 1 }}>
    📋 Registered Records
  </Text>
  {records.length > 0 && (
    <Button
      mode="contained"
      onPress={handleExport}
      loading={isExporting}
      disabled={isExporting}
      style={{ marginLeft: 8, flexShrink: 0 }}
    
    >
      Export CSV
    </Button>
  )}
</View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderItem}
          keyExtractor={item => item.qrcode}
          ListEmptyComponent={EmptyState}
          ListHeaderComponent={header ?? null}
          ListHeaderComponentStyle={header ? { marginBottom: 12 } : undefined}
          contentContainerStyle={[styles.listContent, records.length === 0 ? { flex: 1 } : undefined]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  card: {
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
});