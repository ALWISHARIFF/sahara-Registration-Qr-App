import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { addRecord, recordExists } from '@/utils/database';

interface RegistrationFormProps {
  qrCode: string;
  onRegistrationComplete: () => void;
}

export default function RegistrationForm({ qrCode, onRegistrationComplete }: RegistrationFormProps) {
  const [personName, setPersonName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const colorScheme = useColorScheme();
  const warningOpacity = useState(new Animated.Value(0))[0];
  
  // Reset form when QR code changes
  useEffect(() => {
    if (qrCode) {
      setPersonName('');
      setShowWarning(false);
      setShowSuccess(false);
    }
  }, [qrCode]);
  
  // Animate warning message
  useEffect(() => {
    if (showWarning) {
      Animated.sequence([
        Animated.timing(warningOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(warningOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setShowWarning(false));
      
      // Provide warning haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [showWarning, warningOpacity]);
  
  const handleSubmit = async () => {
    if (!qrCode) return;
    
    setIsSubmitting(true);
    
    try {
      // Check if QR code already exists
      const exists = await recordExists(qrCode);
      
      if (exists) {
        setShowWarning(true);
        setIsSubmitting(false);
        return;
      }
      
      // Add new record with proper East African Time (GMT+3)
      const now = new Date();
      const newRecord = {
        qrcode: qrCode,
        name: personName.trim() || 'Unnamed',
        timestamp: now.toISOString(),
        timezoneOffset: 180 // Store GMT+3 offset in minutes
      };
      
      await addRecord(newRecord);
      
      // Success feedback
      setShowSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      setTimeout(() => {
        setShowSuccess(false);
        setPersonName('');
        onRegistrationComplete();
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to register QR code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>📝 Registration Form</Text>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>🔗 QR Code Value</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: Colors[colorScheme ?? 'light'].card,
              borderColor: Colors[colorScheme ?? 'light'].border,
              color: Colors[colorScheme ?? 'light'].text
            }
          ]}
          value={qrCode}
          placeholder="Scan a QR code above"
          placeholderTextColor="#999"
          editable={false}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>👤 Person Name</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: Colors[colorScheme ?? 'light'].card,
              borderColor: Colors[colorScheme ?? 'light'].border,
              color: Colors[colorScheme ?? 'light'].text
            }
          ]}
          value={personName}
          onChangeText={setPersonName}
          placeholder="Enter person's name"
          placeholderTextColor="#999"
        />
      </View>
      
      <TouchableOpacity
        style={[
          styles.button,
          { 
            backgroundColor: showSuccess 
              ? Colors[colorScheme ?? 'light'].success 
              : Colors[colorScheme ?? 'light'].primary,
            opacity: !qrCode || isSubmitting ? 0.6 : 1
          }
        ]}
        onPress={handleSubmit}
        disabled={!qrCode || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {showSuccess ? '✅ Registered Successfully!' : '✅ Register QR Code'}
          </Text>
        )}
      </TouchableOpacity>
      
      {showWarning && (
        <Animated.View 
          style={[
            styles.warning,
            { 
              opacity: warningOpacity,
              backgroundColor: Colors[colorScheme ?? 'light'].warning
            }
          ]}
        >
          <Text style={styles.warningText}>⚠️ This QR code is already registered!</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 18,
    borderRadius: 16,
    backgroundColor: 'white',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  formHeader: {
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
    fontSize: 13,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 15,
  },
  button: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  warning: {
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  warningText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
});
