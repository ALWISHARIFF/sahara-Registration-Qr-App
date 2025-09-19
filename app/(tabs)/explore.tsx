import { StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="qrcode"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          About QR Registration App
        </ThemedText>
      </ThemedView>
      <ThemedText>
        The QR Registration App is a powerful tool designed to help you manage QR code scans efficiently. Whether you&apos;re tracking event attendees, managing inventory, or organizing data, this app simplifies the process.
      </ThemedText>
      
      <Collapsible title="Key Features">  
        <ThemedText>• Scan QR codes with your device&apos;s camera</ThemedText>
        <ThemedText>• Register QR codes with names and timestamps</ThemedText>
        <ThemedText>• View, edit, and delete records easily</ThemedText>
        <ThemedText>• Export data to CSV for further analysis</ThemedText>
        <ThemedText>• Works offline with local database storage</ThemedText>
      </Collapsible>
      
      <Collapsible title="How to Use">
        <ThemedText>
          1. Open the Scanner tab and scan a QR code.
        </ThemedText>
        <ThemedText>
          2. Enter a name for the scanned QR code in the registration form.
        </ThemedText>
        <ThemedText>
          3. View all registered codes in the records list.
        </ThemedText>
        <ThemedText>
          4. Edit or delete records as needed.
        </ThemedText>
        <ThemedText>
          5. Export your data to CSV for backup or analysis.
        </ThemedText>
      </Collapsible>
      
      <Collapsible title="Privacy & Security">
        <ThemedText>
          All data is stored locally on your device. No information is shared with external servers. Your privacy is our priority.
        </ThemedText>
      </Collapsible>
      
      <Collapsible title="Support">
        <ThemedText>
          For support or feedback, please contact us at: Sahara QR Registration Team
        </ThemedText>
        <ExternalLink href="tel:+254725711017">
          <ThemedText type="link">+254725711017</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});