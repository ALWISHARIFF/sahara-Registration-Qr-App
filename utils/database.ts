import * as SQLite from 'expo-sqlite';

// Define record type
export interface QRRecord {
  qrcode: string;
  name: string;
  timestamp: string;
  timezoneOffset: number;
}

// Open database synchronously
const db = SQLite.openDatabaseSync('qrregistration.db');

// Initialize database
export const initDatabase = async (): Promise<void> => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS records (
      qrcode TEXT PRIMARY KEY,
      name TEXT,
      timestamp TEXT,
      timezoneOffset INTEGER
    );
  `);
};

// Add a new record
export const addRecord = async (record: QRRecord): Promise<void> => {
  await db.runAsync(
    'INSERT OR REPLACE INTO records (qrcode, name, timestamp, timezoneOffset) VALUES (?, ?, ?, ?)',
    [record.qrcode, record.name, record.timestamp, record.timezoneOffset]
  );
};

// Check if a record exists
export const recordExists = async (qrcode: string): Promise<boolean> => {
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM records WHERE qrcode = ?',
    [qrcode]
  );
  return (result?.count ?? 0) > 0;
};

// Get all records
export const getAllRecords = async (): Promise<QRRecord[]> => {
  const rows = await db.getAllAsync<QRRecord>('SELECT * FROM records');
  return rows;
};

// Update a record
export const updateRecord = async (qrcode: string, name: string): Promise<void> => {
  await db.runAsync(
    'UPDATE records SET name = ? WHERE qrcode = ?',
    [name, qrcode]
  );
};

// Delete a record
export const deleteRecord = async (qrcode: string): Promise<void> => {
  await db.runAsync(
    'DELETE FROM records WHERE qrcode = ?',
    [qrcode]
  );
};