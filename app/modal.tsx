import { Link } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title">QR Registration App</ThemedText>
        
        <View style={styles.section}>
          <ThemedText type="subtitle">About</ThemedText>
          <ThemedText>
            This app allows you to scan QR codes and register them with associated names.
            All data is stored locally on your device and can be exported as CSV.
          </ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle">Version</ThemedText>
          <ThemedText>1.0.0</ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle">Developer</ThemedText>
          <ThemedText>Sahara QR Registration Team</ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle">Privacy</ThemedText>
          <ThemedText>
            This app does not collect or transmit any personal data.
            All information is stored locally on your device.
            Camera access is used only for scanning QR codes.
          </ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle">Support</ThemedText>
          <ThemedText>
            For support or feedback, please contact us at:
            Sahara Designs
          </ThemedText>
        </View>
        
        <Link href="/" dismissTo style={styles.link}>
          <ThemedText type="link">Return to App</ThemedText>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  section: {
    marginTop: 24,
    gap: 8,
  },
  link: {
    marginTop: 30,
    paddingVertical: 15,
    alignSelf: 'center',
  },
});
