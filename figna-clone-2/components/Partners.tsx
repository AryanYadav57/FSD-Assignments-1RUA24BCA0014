import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { Colors, Spacing, Radii, FontFamily, FontSize } from '../constants/theme';
import { PARTNERS } from '../constants/data';

export default function Partners() {
  return (
    <View style={styles.section}>
      <View style={styles.inner}>
        <Text style={styles.label}>Trusted by leading travel brands worldwide</Text>
        <View style={styles.row}>
          {PARTNERS.map((partner) => (
            <Pressable
              key={partner.id}
              style={({ hovered }: any) => [styles.partnerItem, hovered && styles.partnerItemHovered]}
              accessibilityRole="button"
              accessibilityLabel={partner.name}
            >
              {({ hovered }: any) => (
                <Text style={[styles.partnerName, hovered && styles.partnerNameHovered]}>
                  {partner.name}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: Spacing.xxxl,
    backgroundColor: Colors.lavenderLight,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  inner: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  label: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.slateLight,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: Spacing.xl,
    width: '100%',
  },
  partnerItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.sm,
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {}),
  },
  partnerItemHovered: {
    backgroundColor: Colors.white,
  },
  partnerName: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.xl,
    color: Colors.slateLighter,
    letterSpacing: 0.5,
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {}),
  },
  partnerNameHovered: {
    color: Colors.navy,
  },
});
