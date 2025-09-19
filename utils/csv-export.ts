// utils/csv-export.ts
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';

export const exportToCSV = async (records: any[]): Promise<boolean> => {
  try {
    // Generate CSV content
    const headers = ['QR Code', 'Name', 'Timestamp', 'Timezone Offset'];
    const csvRows = records.map(record => [
      `"${record.qrcode}"`,
      `"${record.name}"`,
      `"${record.timestamp}"`,
      record.timezoneOffset
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Define file path using new API
    const fileName = `qr-records-${new Date().toISOString().slice(0, 10)}.csv`;
    const file = new File(Paths.document, fileName);

    // ✅ FIXED: Remove { encoding: 'utf8' } — not supported
    await file.write(csvContent);

    // Share or open file
    if (Platform.OS === 'web') {
      // Web: Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } else {
      // Mobile: Use Sharing
      if (!(await Sharing.isAvailableAsync())) {
        console.warn('Sharing is not available on this device');
        return false;
      }

      await Sharing.shareAsync(file.uri);
      return true;
    }
  } catch (error) {
    console.error('CSV Export Error:', error);
    return false;
  }
};