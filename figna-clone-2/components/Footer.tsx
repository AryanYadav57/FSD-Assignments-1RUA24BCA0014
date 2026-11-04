import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, FontFamily, FontSize, Shadows } from '../constants/theme';
import { FOOTER_LINKS } from '../constants/data';
import { useBreakpoint } from '../hooks/useBreakpoint';

const SOCIAL_LINKS = [
  { icon: 'logo-facebook' as const, label: 'Facebook', color: '#1877F2' },
  { icon: 'logo-instagram' as const, label: 'Instagram', color: '#E4405F' },
  { icon: 'logo-twitter' as const, label: 'Twitter', color: '#1DA1F2' },
  { icon: 'logo-youtube' as const, label: 'YouTube', color: '#FF0000' },
];

export default function Footer() {
  const { isMobile } = useBreakpoint();

  return (
    <View style={styles.footer}>
      <View style={styles.inner}>
        {/* Top Grid */}
        <View style={[styles.grid, isMobile && styles.gridMobile]}>
          {/* Brand Column */}
          <View style={[styles.brandCol, isMobile && { width: '100%' }]}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>Jadoo</Text>
              <View style={styles.logoDot} />
            </View>
            <Text style={styles.tagline}>
              Book your trip in minutes, get full control for much longer. Crafting meaningful travel stories since 2020.
            </Text>

            {/* Social */}
            <View style={styles.socialIcons}>
              {SOCIAL_LINKS.map(({ icon, label, color }) => (
                <Pressable
                  key={icon}
                  style={({ hovered }: any) => [styles.socialBtn, hovered && { backgroundColor: color }]}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                >
                  {({ hovered }: any) => (
                    <Ionicons name={icon} size={16} color={hovered ? Colors.white : Colors.slate} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([col, links]) => (
            <View key={col} style={[styles.linkCol, isMobile && styles.linkColMobile]}>
              <Text style={styles.colTitle}>{col}</Text>
              {links.map((link) => (
                <Pressable key={link} style={styles.footerLink} accessibilityRole="link">
                  {({ hovered }: any) => (
                    <Text style={[styles.footerLinkText, hovered && styles.footerLinkTextHovered]}>
                      {link}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          ))}

          {/* App Download */}
          <View style={[styles.appCol, isMobile && { width: '100%' }]}>
            <Text style={styles.colTitle}>Discover our app</Text>
            <Text style={styles.appSubtext}>Download and get{'\n'}$20 off your first trip</Text>
            <Pressable
              style={({ hovered }: any) => [styles.storeBadge, hovered && styles.storeBadgeHovered]}
              accessibilityRole="button"
              accessibilityLabel="Get it on Google Play"
            >
              <Ionicons name="logo-google-playstore" size={20} color={Colors.white} />
              <View>
                <Text style={styles.badgeSmall}>GET IT ON</Text>
                <Text style={styles.badgeLarge}>Google Play</Text>
              </View>
            </Pressable>
            <Pressable
              style={({ hovered }: any) => [styles.storeBadge, hovered && styles.storeBadgeHovered]}
              accessibilityRole="button"
              accessibilityLabel="Download on App Store"
            >
              <Ionicons name="logo-apple" size={20} color={Colors.white} />
              <View>
                <Text style={styles.badgeSmall}>AVAILABLE ON</Text>
                <Text style={styles.badgeLarge}>App Store</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Bottom Bar */}
        <View style={[styles.bottomBar, isMobile && styles.bottomBarMobile]}>
          <Text style={styles.copyright}>
            © {new Date().getFullYear()} Jadoo Travel, Inc. All rights reserved.
          </Text>
          <View style={styles.bottomLinks}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((link, i) => (
              <View key={link} style={{ flexDirection: 'row', alignItems: 'center' }}>
                {i > 0 && <View style={styles.bottomDot} />}
                <Pressable accessibilityRole="link">
                  {({ hovered }: any) => (
                    <Text style={[styles.bottomLink, hovered && styles.bottomLinkHovered]}>{link}</Text>
                  )}
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingTop: Spacing.xxxl + 16,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  inner: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xxxl,
    marginBottom: Spacing.xxxl,
  },
  gridMobile: {
    flexDirection: 'column',
    gap: Spacing.xl,
  },
  brandCol: {
    flex: 3,
    minWidth: 220,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: Spacing.md,
  },
  logoText: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.xl,
    color: Colors.navy,
  },
  logoDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.coral,
    marginTop: -8,
  },
  tagline: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.slate,
    lineHeight: 24,
    maxWidth: 240,
    marginBottom: Spacing.lg,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  socialBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {}),
  },
  linkCol: {
    flex: 2,
    minWidth: 120,
  },
  linkColMobile: {
    minWidth: 140,
  },
  colTitle: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.sm,
    color: Colors.navy,
    marginBottom: Spacing.lg,
    letterSpacing: 0.3,
  },
  footerLink: {
    marginBottom: Spacing.sm + 2,
  },
  footerLinkText: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.slate,
    ...(Platform.OS === 'web' ? { transition: 'color 0.2s' } as any : {}),
  },
  footerLinkTextHovered: {
    color: Colors.coral,
  },
  appCol: {
    flex: 2,
    minWidth: 170,
  },
  appSubtext: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.slateLight,
    lineHeight: 18,
    marginBottom: Spacing.md,
    marginTop: 2,
  },
  storeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radii.sm,
    marginBottom: Spacing.sm,
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {}),
  },
  storeBadgeHovered: {
    backgroundColor: Colors.navyLight,
    transform: [{ translateY: -1 }],
  },
  badgeSmall: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
  badgeLarge: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  bottomBarMobile: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  copyright: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.slateLighter,
  },
  bottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  bottomDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.slateLighter,
    marginHorizontal: Spacing.xs,
  },
  bottomLink: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.slateLighter,
    ...(Platform.OS === 'web' ? { transition: 'color 0.2s' } as any : {}),
  },
  bottomLinkHovered: {
    color: Colors.navy,
  },
});
