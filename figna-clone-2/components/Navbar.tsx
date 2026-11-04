import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Pressable,
} from 'react-native';
import { Colors, Spacing, Radii, FontFamily, FontSize, Shadows } from '../constants/theme';
import { NAV_LINKS } from '../constants/data';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { Ionicons } from '@expo/vector-icons';

interface NavbarProps {
  onScrollToSection?: (section: string) => void;
}

export default function Navbar({ onScrollToSection }: NavbarProps) {
  const { isMobile } = useBreakpoint();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const menuAnim = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = menuOpen ? 0 : 1;
    Animated.parallel([
      Animated.spring(menuAnim, {
        toValue,
        useNativeDriver: false,
        friction: 8,
        tension: 60,
      }),
      Animated.timing(menuOpacity, {
        toValue,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    setMenuOpen(!menuOpen);
  };

  const menuHeight = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  const handleNavPress = (href: string) => {
    const section = href.replace('#', '');
    setActiveLink(section);
    onScrollToSection?.(section);
    if (isMobile) {
      setMenuOpen(false);
      Animated.parallel([
        Animated.spring(menuAnim, { toValue: 0, useNativeDriver: false, friction: 8 }),
        Animated.timing(menuOpacity, { toValue: 0, duration: 150, useNativeDriver: false }),
      ]).start();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Logo */}
        <TouchableOpacity style={styles.logo} accessibilityRole="link" accessibilityLabel="Jadoo Home">
          <Text style={styles.logoText}>Jadoo</Text>
          <View style={styles.logoDot} />
        </TouchableOpacity>

        {/* Desktop Nav */}
        {!isMobile && (
          <View style={styles.desktopNav}>
            {NAV_LINKS.map((link) => {
              const section = link.href.replace('#', '');
              const isActive = activeLink === section;
              return (
                <Pressable
                  key={link.label}
                  onPress={() => handleNavPress(link.href)}
                  accessibilityRole="link"
                  style={({ hovered }: any) => [
                    styles.navLink,
                    (hovered || isActive) && styles.navLinkActive,
                  ]}
                >
                  {({ hovered }: any) => (
                    <View>
                      <Text style={[
                        styles.navLinkText,
                        (hovered || isActive) && styles.navLinkTextActive,
                      ]}>
                        {link.label}
                      </Text>
                      {(hovered || isActive) && <View style={styles.navUnderline} />}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Desktop Actions */}
        {!isMobile && (
          <View style={styles.actions}>
            <Pressable accessibilityRole="link" accessibilityLabel="Login">
              {({ hovered }: any) => (
                <Text style={[styles.loginText, hovered && styles.loginHovered]}>Login</Text>
              )}
            </Pressable>
            <Pressable
              style={({ hovered }: any) => [
                styles.signupBtn,
                hovered && styles.signupBtnHovered,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Sign up"
            >
              {({ hovered }: any) => (
                <Text style={[styles.signupText, hovered && styles.signupTextHovered]}>Sign up</Text>
              )}
            </Pressable>
            <View style={styles.langPicker}>
              <Text style={styles.langText}>EN</Text>
              <Ionicons name="chevron-down" size={12} color={Colors.slate} />
            </View>
          </View>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <Pressable
            onPress={toggleMenu}
            style={({ pressed }: any) => [styles.hamburger, pressed && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel="Toggle navigation menu"
          >
            <View style={[styles.hamburgerLine, menuOpen && styles.hamburgerLineTop]} />
            <View style={[styles.hamburgerLine, styles.hamburgerLineMid, menuOpen && styles.hamburgerLineMidOpen]} />
            <View style={[styles.hamburgerLine, menuOpen && styles.hamburgerLineBot]} />
          </Pressable>
        )}
      </View>

      {/* Mobile Menu */}
      {isMobile && (
        <Animated.View style={[styles.mobileMenu, { height: menuHeight, opacity: menuOpacity, overflow: 'hidden' }]}>
          <View style={styles.mobileMenuInner}>
            {NAV_LINKS.map((link, i) => (
              <TouchableOpacity
                key={link.label}
                onPress={() => handleNavPress(link.href)}
                style={[styles.mobileNavLink, i < NAV_LINKS.length - 1 && styles.mobileNavLinkBorder]}
              >
                <Text style={styles.mobileNavLinkText}>{link.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.slateLighter} />
              </TouchableOpacity>
            ))}
            <View style={styles.mobileActions}>
              <TouchableOpacity style={styles.mobileLoginBtn}>
                <Text style={styles.mobileLoginText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileSignup}>
                <Text style={styles.mobileSignupText}>Sign up free</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    zIndex: 100,
    ...(Platform.OS === 'web' ? {
      position: 'sticky' as any,
      top: 0,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    } : {}),
    ...Shadows.soft,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  logoText: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.xl,
    color: Colors.navy,
    letterSpacing: -0.5,
  },
  logoDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.coral,
    marginTop: -8,
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl + 4,
  },
  navLink: {
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  navLinkActive: {},
  navLinkText: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.sm,
    color: Colors.slate,
    ...(Platform.OS === 'web' ? { transition: 'color 0.2s ease' } as any : {}),
  },
  navLinkTextActive: {
    color: Colors.navy,
    fontFamily: FontFamily.sansSemibold,
  },
  navUnderline: {
    height: 2,
    backgroundColor: Colors.coral,
    borderRadius: 1,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  loginText: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.sm,
    color: Colors.navy,
    ...(Platform.OS === 'web' ? { transition: 'color 0.2s ease' } as any : {}),
  },
  loginHovered: {
    color: Colors.coral,
  },
  signupBtn: {
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1.5,
    borderColor: Colors.navy,
    borderRadius: Radii.sm,
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {}),
  },
  signupBtnHovered: {
    borderColor: Colors.coral,
    backgroundColor: Colors.coralLight,
  },
  signupText: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.sm,
    color: Colors.navy,
    ...(Platform.OS === 'web' ? { transition: 'color 0.2s ease' } as any : {}),
  },
  signupTextHovered: {
    color: Colors.coral,
  },
  langPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langText: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.xs,
    color: Colors.slate,
  },
  hamburger: {
    padding: Spacing.sm,
    gap: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  hamburgerLine: {
    width: 24,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.navy,
    ...(Platform.OS === 'web' ? { transition: 'transform 0.2s ease' } as any : {}),
  },
  hamburgerLineTop: {},
  hamburgerLineMid: { width: 18 },
  hamburgerLineMidOpen: { opacity: 0 },
  hamburgerLineBot: {},
  mobileMenu: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    overflow: 'hidden',
  },
  mobileMenuInner: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  mobileNavLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  mobileNavLinkBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  mobileNavLinkText: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.base,
    color: Colors.navy,
  },
  mobileActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  mobileLoginBtn: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radii.sm,
    borderWidth: 1.5,
    borderColor: Colors.navy,
    alignItems: 'center',
  },
  mobileLoginText: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.sm,
    color: Colors.navy,
  },
  mobileSignup: {
    flex: 1,
    backgroundColor: Colors.coral,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radii.sm,
    alignItems: 'center',
    ...Shadows.glowCoral,
  },
  mobileSignupText: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
});
