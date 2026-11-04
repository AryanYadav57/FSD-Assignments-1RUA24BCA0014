import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, FontFamily, FontSize, Shadows } from '../constants/theme';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const checkAnim = useRef(new Animated.Value(0)).current;

  const handleSubmit = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
    Animated.spring(checkAnim, { toValue: 1, useNativeDriver: true, friction: 5, tension: 100 }).start();
  };

  return (
    <View style={styles.section}>
      <View style={styles.inner}>
        <View style={styles.card}>
          {/* Decorative elements */}
          <View style={[styles.ring, { width: 360, height: 360, top: -150, left: -150 }]} pointerEvents="none" />
          <View style={[styles.ring, { width: 240, height: 240, top: -90, left: -90 }]} pointerEvents="none" />
          <View style={[styles.ring, { width: 360, height: 360, bottom: -150, right: -150 }]} pointerEvents="none" />
          <View style={styles.orbTopRight} pointerEvents="none" />
          <View style={styles.orbBottomLeft} pointerEvents="none" />

          {/* Send plane badge */}
          <View style={styles.planeBadge}>
            <Ionicons name="send" size={20} color={Colors.white} />
          </View>

          <View style={styles.content}>
            {/* Badge */}
            <View style={styles.sectionBadge}>
              <Ionicons name="mail-open-outline" size={14} color={Colors.navy} />
              <Text style={styles.sectionBadgeText}>NEWSLETTER</Text>
            </View>

            <Text style={styles.heading}>
              Get exclusive deals and{'\n'}travel inspiration weekly
            </Text>
            <Text style={styles.sub}>
              Join 50,000+ travelers. No spam, unsubscribe anytime.
            </Text>

            {submitted ? (
              <Animated.View
                style={[styles.successCard, { transform: [{ scale: checkAnim }] }]}
              >
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark" size={28} color={Colors.white} />
                </View>
                <View>
                  <Text style={styles.successTitle}>You're in! 🎉</Text>
                  <Text style={styles.successText}>Welcome to the Jadoo family.</Text>
                </View>
              </Animated.View>
            ) : (
              <View style={styles.formRow}>
                <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused, !!error && styles.inputWrapperError]}>
                  <Ionicons name="mail-outline" size={18} color={focused ? Colors.navy : '#94A3B8'} style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={(t) => { setEmail(t); setError(''); }}
                    placeholder="your@email.com"
                    placeholderTextColor="#C4C5D6"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    accessibilityLabel="Email address input"
                    onSubmitEditing={handleSubmit}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                </View>
                <Pressable
                  onPress={handleSubmit}
                  style={({ hovered, pressed }: any) => [
                    styles.subscribeBtn,
                    hovered && styles.subscribeBtnHovered,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Subscribe to newsletter"
                >
                  {({ hovered }: any) => (
                    <View style={styles.subscribeBtnInner}>
                      <Text style={styles.subscribeBtnText}>Subscribe</Text>
                      <Ionicons name="arrow-forward" size={15} color={Colors.white} />
                    </View>
                  )}
                </Pressable>
              </View>
            )}

            {!!error && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={14} color={Colors.coral} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Trust row */}
            {!submitted && (
              <View style={styles.trustRow}>
                <Ionicons name="shield-checkmark-outline" size={14} color={Colors.slateLight} />
                <Text style={styles.trustText}>Privacy protected · No spam ever</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: Spacing.section,
  },
  inner: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.navy,
    borderRadius: Radii.xxl,
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xxxl,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.cardLiftStrong,
  },
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  orbTopRight: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(223,105,81,0.15)',
    ...(Platform.OS === 'web' ? { filter: 'blur(50px)' } as any : {}),
  },
  orbBottomLeft: {
    position: 'absolute',
    bottom: -60,
    left: 60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(167,139,250,0.12)',
    ...(Platform.OS === 'web' ? { filter: 'blur(50px)' } as any : {}),
  },
  planeBadge: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.coral,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glowCoral,
    transform: [{ rotate: '-12deg' }],
    zIndex: 2,
  },
  content: {
    maxWidth: 580,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.full,
    marginBottom: Spacing.lg,
  },
  sectionBadgeText: {
    fontFamily: FontFamily.sansBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 2,
  },
  heading: {
    fontFamily: FontFamily.serif,
    fontSize: 36,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 50,
    marginBottom: Spacing.sm,
  },
  sub: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  formRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    minWidth: 220,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {}),
  },
  inputWrapperFocused: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  inputWrapperError: {
    borderColor: Colors.coral,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.white,
    outlineStyle: 'none',
  } as any,
  subscribeBtn: {
    backgroundColor: Colors.coral,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.sm,
    ...Shadows.glowCoral,
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {}),
  },
  subscribeBtnHovered: {
    backgroundColor: Colors.coralDark,
    transform: [{ translateY: -1 }],
  },
  subscribeBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  subscribeBtnText: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
  },
  successIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.md,
    color: Colors.white,
  },
  successText: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: Spacing.sm,
  },
  errorText: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.coral,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: Spacing.md,
  },
  trustText: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.4)',
  },
});
