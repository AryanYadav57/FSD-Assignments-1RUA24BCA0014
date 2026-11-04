import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path, Circle, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, FontFamily, FontSize, Shadows } from '../constants/theme';
import { TRUST_STATS } from '../constants/data';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface HeroProps {
  onSearchPress?: () => void;
}

function FloatAnim({ children, delay = 0, amplitude = 10 }: { children: React.ReactNode; delay?: number; amplitude?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: -amplitude, duration: 2800 + delay * 0.3, delay, useNativeDriver: true, easing: (t) => Math.sin(t * Math.PI) }),
        Animated.timing(anim, { toValue: 0, duration: 2800 + delay * 0.3, useNativeDriver: true, easing: (t) => Math.sin(t * Math.PI) }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={{ transform: [{ translateY: anim }] }}>{children}</Animated.View>
  );
}

function PaperPlane({ size = 48, color = Colors.sky }: any) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path d="M42 6L6 22L20 28L26 42L42 6Z" fill={color} opacity={0.9} />
      <Path d="M20 28L42 6L26 42L20 28Z" fill={Colors.skyDark} opacity={0.6} />
      <Path d="M20 28L30 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
    </Svg>
  );
}

function BlobBackground() {
  return (
    <Svg width="560" height="580" viewBox="0 0 560 580" style={StyleSheet.absoluteFillObject}>
      <Defs>
        <LinearGradient id="blobGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={Colors.cream} stopOpacity="1" />
          <Stop offset="1" stopColor={Colors.lavender} stopOpacity="0.5" />
        </LinearGradient>
      </Defs>
      <Ellipse
        cx="280" cy="290" rx="250" ry="270"
        fill="url(#blobGrad)"
        transform="rotate(-10, 280, 290)"
      />
    </Svg>
  );
}

export default function Hero({ onSearchPress }: HeroProps) {
  const { isMobile, isDesktop } = useBreakpoint();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const rightFadeAnim = useRef(new Animated.Value(0)).current;
  const rightSlideAnim = useRef(new Animated.Value(30)).current;
  const badgeScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, friction: 8 }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(rightFadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(rightSlideAnim, { toValue: 0, useNativeDriver: true, friction: 8 }),
        Animated.spring(badgeScale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 100 }),
      ]).start();
    }, 300);
  }, []);

  return (
    <View style={styles.section}>
      {/* Background gradient blobs */}
      <View style={styles.blobTopRight} pointerEvents="none" />
      <View style={styles.blobLeft} pointerEvents="none" />
      <View style={styles.blobBottom} pointerEvents="none" />

      <View style={[styles.inner, !isDesktop && styles.innerMobile]}>
        {/* ── Left Column ── */}
        <Animated.View
          style={[
            styles.leftCol,
            isDesktop ? { flex: 1 } : { width: '100%' },
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Eyebrow pill */}
          <View style={styles.eyebrowPill}>
            <View style={styles.eyebrowDot} />
            <Text style={styles.eyebrow}>BEST DESTINATIONS AROUND THE WORLD</Text>
          </View>

          {/* Headline */}
          <Text style={[styles.headline, isMobile && styles.headlineMobile]}>
            Travel, <Text style={styles.highlightWord}>enjoy</Text>
            {'\n'}and live a new{'\n'}and full life
          </Text>

          {/* Sub */}
          <Text style={styles.sub}>
            Discover breathtaking destinations, curated boutique stays, and seamless flight
            booking crafted for unforgettable adventures.
          </Text>

          {/* CTA Row */}
          <View style={styles.ctaRow}>
            <Pressable
              style={({ hovered, pressed }: any) => [
                styles.primaryBtn,
                hovered && styles.primaryBtnHovered,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Find out more"
            >
              <Text style={styles.primaryBtnText}>Find out more</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.white} style={{ marginLeft: 6 }} />
            </Pressable>

            <TouchableOpacity style={styles.playRow} accessibilityLabel="Play Demo video">
              <View style={styles.playCircle}>
                <View style={styles.playRipple} />
                <Ionicons name="play" size={16} color={Colors.white} style={{ marginLeft: 3 }} />
              </View>
              <Text style={styles.playLabel}>Play Demo</Text>
            </TouchableOpacity>
          </View>

          {/* Search Widget */}
          <View style={styles.searchWidget}>
            {/* Destination */}
            <View style={[styles.searchField, { borderRightWidth: isMobile ? 0 : 1, borderBottomWidth: isMobile ? 1 : 0 }]}>
              <View style={[styles.searchIcon, { backgroundColor: Colors.yellowLight }]}>
                <Ionicons name="location-outline" size={18} color={Colors.yellow} />
              </View>
              <View>
                <Text style={styles.fieldLabel}>DESTINATION</Text>
                <Text style={styles.fieldValue}>Rome, Italy</Text>
              </View>
            </View>
            {/* Dates */}
            <View style={[styles.searchField, { borderRightWidth: isMobile ? 0 : 1, borderBottomWidth: isMobile ? 1 : 0 }]}>
              <View style={[styles.searchIcon, { backgroundColor: Colors.coralLight }]}>
                <Ionicons name="calendar-outline" size={18} color={Colors.coral} />
              </View>
              <View>
                <Text style={styles.fieldLabel}>DATES</Text>
                <Text style={styles.fieldValue}>18 – 25 Oct</Text>
              </View>
            </View>
            {/* Travelers */}
            <View style={styles.searchField}>
              <View style={[styles.searchIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="people-outline" size={18} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.fieldLabel}>TRAVELERS</Text>
                <Text style={styles.fieldValue}>2 Adults</Text>
              </View>
            </View>
            {/* Search Btn */}
            <Pressable
              style={({ hovered, pressed }: any) => [
                styles.searchBtn,
                hovered && styles.searchBtnHovered,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Search packages"
              onPress={onSearchPress}
            >
              <Ionicons name="search" size={18} color={Colors.white} />
              {isMobile && <Text style={styles.searchBtnText}>Search</Text>}
            </Pressable>
          </View>
        </Animated.View>

        {/* ── Right Column ── */}
        {(isDesktop || !isMobile) && (
          <Animated.View
            style={[
              styles.rightCol,
              isDesktop ? { flex: 1 } : { width: '100%', marginTop: Spacing.xxl },
              { opacity: rightFadeAnim, transform: [{ translateY: rightSlideAnim }] },
            ]}
          >
            {/* Blob */}
            <View style={styles.blobWrapper} pointerEvents="none">
              <BlobBackground />
            </View>

            {/* Paper Planes */}
            <View style={{ position: 'absolute', top: -10, left: 20, zIndex: 5 }}>
              <FloatAnim>
                <PaperPlane size={58} />
              </FloatAnim>
            </View>
            <View style={{ position: 'absolute', top: '32%', right: -16, zIndex: 5 }}>
              <FloatAnim delay={1600} amplitude={8}>
                <PaperPlane size={42} color={Colors.coral} />
              </FloatAnim>
            </View>

            {/* Main Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&q=80' }}
                style={styles.heroImage}
                contentFit="cover"
                accessibilityLabel="Happy traveler at airport ready for vacation"
              />

              {/* Gradient overlay on image */}
              <View style={styles.imageGradient} pointerEvents="none" />

              {/* Floating badge - Instant Confirm */}
              <Animated.View style={[styles.instantBadge, { transform: [{ scale: badgeScale }] }]}>
                <Ionicons name="checkmark-circle" size={14} color="rgba(255,255,255,0.9)" />
                <Text style={styles.instantBadgeText}>Instant Confirm</Text>
              </Animated.View>

              {/* Floating card - Curated Gems */}
              <View style={styles.curatedCard}>
                <View style={styles.curatedIcon}>
                  <Text style={{ color: Colors.coral, fontSize: 20 }}>★</Text>
                </View>
                <View>
                  <Text style={styles.curatedLabel}>Curated Gems</Text>
                  <Text style={styles.curatedValue}>500+ Verified Stays</Text>
                  <View style={styles.ratingRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Text key={s} style={styles.ratingStar}>★</Text>
                    ))}
                    <Text style={styles.ratingText}> 4.9</Text>
                  </View>
                </View>
              </View>

              {/* Top traveler count badge */}
              <View style={styles.travelerBadge}>
                <View style={styles.travelerAvatars}>
                  {['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80'].map((uri, i) => (
                    <Image
                      key={i}
                      source={{ uri }}
                      style={[styles.travelerAvatar, { marginLeft: i > 0 ? -8 : 0 }]}
                      contentFit="cover"
                    />
                  ))}
                </View>
                <Text style={styles.travelerText}>+2.3k joined</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      {/* ── Trust Strip ── */}
      <View style={[styles.trustStrip, isMobile && styles.trustStripMobile]}>
        {TRUST_STATS.map((stat, i) => (
          <View key={stat.label} style={[styles.trustItem, i < TRUST_STATS.length - 1 && !isMobile && styles.trustDivider]}>
            <Text style={styles.trustValue}>{stat.value}</Text>
            <Text style={styles.trustLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    overflow: 'hidden',
    backgroundColor: Colors.heroGradientStart,
  },
  blobTopRight: {
    position: 'absolute',
    top: -100,
    right: -60,
    width: 560,
    height: 560,
    borderRadius: 280,
    backgroundColor: 'rgba(255,241,218,0.6)',
    ...(Platform.OS === 'web' ? { filter: 'blur(100px)' } as any : {}),
    zIndex: -1,
  },
  blobLeft: {
    position: 'absolute',
    top: '20%',
    left: -120,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(223,215,249,0.35)',
    ...(Platform.OS === 'web' ? { filter: 'blur(80px)' } as any : {}),
    zIndex: -1,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -80,
    right: '30%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(223,105,81,0.07)',
    ...(Platform.OS === 'web' ? { filter: 'blur(60px)' } as any : {}),
    zIndex: -1,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xxl,
    paddingTop: Spacing.xl,
  },
  innerMobile: {
    flexDirection: 'column',
  },
  leftCol: {
    paddingTop: Spacing.lg,
  },
  eyebrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.coralLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.coral,
  },
  eyebrow: {
    fontFamily: FontFamily.sansBold,
    fontSize: 10,
    color: Colors.coral,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headline: {
    fontFamily: FontFamily.serif,
    fontSize: 56,
    lineHeight: 68,
    color: Colors.navy,
    marginBottom: Spacing.lg,
  },
  headlineMobile: {
    fontSize: 38,
    lineHeight: 50,
  },
  highlightWord: {
    color: Colors.navy,
    fontFamily: FontFamily.serif,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.coral,
    textDecorationStyle: 'solid',
  },
  sub: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.slate,
    lineHeight: 28,
    maxWidth: 460,
    marginBottom: Spacing.xl,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    flexWrap: 'wrap',
    marginBottom: Spacing.xl,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.yellow,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.lg,
    ...Shadows.glowYellow,
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {}),
  },
  primaryBtnHovered: {
    backgroundColor: Colors.yellowDark,
    transform: [{ translateY: -2 }],
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  primaryBtnText: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  playRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.coral,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glowCoral,
    position: 'relative',
    overflow: 'visible',
  },
  playRipple: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(223,105,81,0.3)',
    transform: [{ scale: 1.3 }],
  },
  playLabel: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.base,
    color: Colors.navy,
  },
  searchWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    flexWrap: 'wrap',
    ...Shadows.cardLift,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    maxWidth: 560,
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRightColor: Colors.border,
    minWidth: 100,
  },
  searchIcon: {
    width: 38,
    height: 38,
    borderRadius: Radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldLabel: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: 9,
    color: Colors.slateLighter,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  fieldValue: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.sm,
    color: Colors.navy,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.coral,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radii.sm,
    ...Shadows.glowCoral,
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {}),
  },
  searchBtnHovered: { backgroundColor: Colors.coralDark, transform: [{ scale: 1.03 }] },
  searchBtnText: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  rightCol: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 540,
  },
  blobWrapper: {
    position: 'absolute',
    width: 560,
    height: 580,
    top: -30,
    right: -50,
    zIndex: 0,
  },
  imageContainer: {
    position: 'relative',
    width: 420,
    maxWidth: '100%',
    zIndex: 2,
  },
  heroImage: {
    width: '100%',
    height: 460,
    borderRadius: Radii.xl,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    borderBottomLeftRadius: Radii.xl,
    borderBottomRightRadius: Radii.xl,
    ...(Platform.OS === 'web' ? {
      background: 'linear-gradient(to top, rgba(20,24,62,0.3), transparent)',
    } as any : { backgroundColor: 'transparent' }),
  },
  instantBadge: {
    position: 'absolute',
    top: 24,
    right: -16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.coral,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.full,
    transform: [{ rotate: '-6deg' }],
    ...Shadows.glowCoral,
  },
  instantBadgeText: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.xs,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  curatedCard: {
    position: 'absolute',
    bottom: -24,
    left: -28,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.cardLift,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  curatedIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.coralLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  curatedLabel: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: 10,
    color: Colors.slateLighter,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  curatedValue: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.sm,
    color: Colors.navy,
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingStar: {
    color: Colors.ratingYellow,
    fontSize: 10,
  },
  ratingText: {
    fontFamily: FontFamily.sansBold,
    fontSize: 10,
    color: Colors.slate,
  },
  travelerBadge: {
    position: 'absolute',
    top: 20,
    left: -16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.lg,
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  travelerAvatars: {
    flexDirection: 'row',
  },
  travelerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  travelerText: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.xs,
    color: Colors.navy,
  },
  trustStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    marginTop: Spacing.xxl + 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.lg,
  },
  trustStripMobile: {
    gap: Spacing.xl,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: 120,
    paddingRight: Spacing.lg,
  },
  trustDivider: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  trustValue: {
    fontFamily: FontFamily.sansExtrabold,
    fontSize: FontSize.xxl,
    color: Colors.navy,
  },
  trustLabel: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.slateLight,
    marginTop: 4,
    textAlign: 'center',
  },
});
