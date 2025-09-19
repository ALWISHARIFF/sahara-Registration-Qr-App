import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function ExploreScreen() {
  const { width } = useWindowDimensions();
  
  const dynamicStyles = useMemo(() => {
    return StyleSheet.create({
      container: {
        width: width - 24,
        alignSelf: 'center',
        marginHorizontal: 12,
      },
      card: {
        marginVertical: 10,
        padding: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(150, 150, 150, 0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    });
  }, [width]);
  
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
      <ThemedView style={[dynamicStyles.container, styles.titleContainer]}>
        <IconSymbol
          size={32}
          color="#4A90E2"
          name="info.circle.fill"
          style={styles.titleIcon}
        />
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
            fontSize: width > 500 ? 28 : 24,
          }}>
          About QR Registration App
        </ThemedText>
      </ThemedView>
      <ThemedView style={dynamicStyles.card}>
        <ThemedText style={styles.descriptionText}>
          The QR Registration App is a powerful tool designed to help you manage QR code scans efficiently. Whether you&apos;re tracking event attendees, managing inventory, or organizing data, this app simplifies the process.
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={dynamicStyles.container}>
        <Collapsible 
          title="Key Features" 
          style={dynamicStyles.card}>  
          <ThemedView style={styles.featureList}>
            <IconSymbol size={18} color="#4A90E2" name="qrcode" style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Scan QR codes with your device&apos;s camera</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureList}>
            <IconSymbol size={18} color="#4A90E2" name="chevron.right" style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Register QR codes with names and timestamps</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureList}>
            <IconSymbol size={18} color="#4A90E2" name="chevron.right" style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>View, edit, and delete records easily</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureList}>
            <IconSymbol size={18} color="#4A90E2" name="chevron.right" style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Export data to CSV for further analysis</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureList}>
            <IconSymbol size={18} color="#4A90E2" name="chevron.right" style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>Works offline with local database storage</ThemedText>
          </ThemedView>
        </Collapsible>
        
        <Collapsible 
          title="How to Use" 
          style={[dynamicStyles.card, {marginTop: 16}]}>
          <ThemedView style={styles.stepList}>
            <ThemedView style={styles.stepNumber}>
              <ThemedText style={styles.stepNumberText}>1</ThemedText>
            </ThemedView>
            <ThemedText style={styles.stepText}>
              Open the Scanner tab and scan a QR code.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepList}>
            <ThemedView style={styles.stepNumber}>
              <ThemedText style={styles.stepNumberText}>2</ThemedText>
            </ThemedView>
            <ThemedText style={styles.stepText}>
              Enter a name for the scanned QR code in the registration form.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepList}>
            <ThemedView style={styles.stepNumber}>
              <ThemedText style={styles.stepNumberText}>3</ThemedText>
            </ThemedView>
            <ThemedText style={styles.stepText}>
              View all registered codes in the records list.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepList}>
            <ThemedView style={styles.stepNumber}>
              <ThemedText style={styles.stepNumberText}>4</ThemedText>
            </ThemedView>
            <ThemedText style={styles.stepText}>
              Edit or delete records as needed.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepList}>
            <ThemedView style={styles.stepNumber}>
              <ThemedText style={styles.stepNumberText}>5</ThemedText>
            </ThemedView>
            <ThemedText style={styles.stepText}>
              Export your data to CSV for backup or analysis.
            </ThemedText>
          </ThemedView>
        </Collapsible>
        
        <Collapsible 
          title="Privacy & Security" 
          style={[dynamicStyles.card, {marginTop: 16}]}>
          <ThemedView style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconSymbol size={24} color="#4A90E2" name="info.circle.fill" style={{marginRight: 12}} />
            <ThemedText style={styles.privacyText}>
              All data is stored locally on your device. No information is shared with external servers. Your privacy is our priority.
            </ThemedText>
          </ThemedView>
        </Collapsible>
        
        <Collapsible 
          title="Support" 
          style={[dynamicStyles.card, {marginTop: 16}]}>
          <ThemedText style={{marginBottom: 8}}>
            For support or feedback, please contact us at: Sahara QR Registration Team
          </ThemedText>
          <ExternalLink href="tel:+254725711017">
            <ThemedView
              style={[
                styles.contactButton,
                { flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap', maxWidth: 240 },
              ]}
            >
              <IconSymbol size={20} color="#FFFFFF" name="paperplane.fill" style={{ marginRight: 8 }} />
              <ThemedText
                style={[
                  styles.contactButtonText,
                  { flexShrink: 1, flexWrap: 'nowrap', overflow: 'hidden' },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                +254725711017
              </ThemedText>
            </ThemedView>
          </ExternalLink>
        </Collapsible>
      </ThemedView>
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
    alignItems: 'center',
    marginVertical: 16,
  },
  titleIcon: {
    marginRight: 8,
  },
  descriptionText: {
    lineHeight: 22,
    fontSize: 16,
  },
  featureList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
  },
  stepList: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  privacyText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});