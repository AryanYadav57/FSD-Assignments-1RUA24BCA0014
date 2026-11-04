import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, FontFamily, FontSize, Shadows } from '../constants/theme';
import { TESTIMONIALS } from '../constants/data';
import { useBreakpoint } from '../hooks/useBreakpoint';

export default function Testimonials() {
  const { isMobile } = useBreakpoint();
  const [current, setCurrent] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const goTo = (index: number) => {
    const direction = index > current ? 1 : -1;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: direction * -20, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setCurrent(index);
      slideAnim.setValue(direction * 20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, friction: 8 }),
      ]).start();
    });
  };

  const prev = () => goTo((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => goTo((current + 1) % TESTIMONIALS.length);

  const active = TESTIMONIALS[current];
  const behind = TESTIMONIALS[(current + 1) % TESTIMONIALS.length];

  return (
    <View style={styles.section}>
      {/* Background decoration */}
      <View style={styles.bgOrb} pointerEvents="none" />

      <View style={[styles.inner, isMobile && styles.innerMobile]}>
        {/* Left — Heading + Dots + Quote icon */}
        <View style={[styles.leftCol, isMobile && { width: '100%' }]}>
          <View style={styles.eyebrowPill}>
            <Text style={styles.eyebrow}>TESTIMONIALS</Text>
          </View>
          <Text style={[styles.heading, isMobile && styles.headingMobile]}>
            What People Say{'\n'}About Us.
          </Text>
          <Text style={styles.subheading}>
            Thousands of travelers trust Jadoo every day to create unforgettable memories.
          </Text>

          {/* Dot indicators */}
          <View style={styles.dots}>
            {TESTIMONIALS.map((_, i) => (
              <Pressable
                key={i}
                onPress={() => goTo(i)}
                accessibilityRole="button"
                accessibilityLabel={`Testimonial ${i + 1}`}
              >
                <View style={[styles.dot, i === current && styles.dotActive]} />
              </Pressable>
            ))}
          </View>

          {/* Navigation buttons */}
          {!isMobile && (
            <View style={styles.navBtns}>
              <Pressable
                onPress={prev}
                style={({ hovered }: any) => [styles.navBtn, hovered && styles.navBtnHovered]}
                accessibilityRole="button"
                accessibilityLabel="Previous testimonial"
              >
                {({ hovered }: any) => (
                  <Ionicons name="arrow-back" size={18} color={hovered ? Colors.white : Colors.navy} />
                )}
              </Pressable>
              <Pressable
                onPress={next}
                style={({ hovered }: any) => [styles.navBtn, styles.navBtnFilled, hovered && styles.navBtnFilledHovered]}
                accessibilityRole="button"
                accessibilityLabel="Next testimonial"
              >
                {({ hovered }: any) => (
                  <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                )}
              </Pressable>
            </View>
          )}
        </View>

        {/* Right — Stacked Cards */}
        <View style={[styles.rightCol, isMobile && { width: '100%', minHeight: 300 }]}>
          {/* Behind card — decorative */}
          <View style={styles.behindCard} pointerEvents="none">
            <View style={styles.quoteIconBehind}>
              <Text style={styles.quoteIconText}>"</Text>
            </View>
            <Text style={styles.behindQuote} numberOfLines={3}>{behind.quote}</Text>
            <Text style={styles.behindName}>{behind.name}</Text>
          </View>

          {/* Active card */}
          <Animated.View style={[styles.activeCard, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
            {/* Large quote mark */}
            <View style={styles.quoteIconActive}>
              <Text style={styles.quoteIconTextActive}>"</Text>
            </View>

            {/* Stars */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Text key={s} style={styles.star}>★</Text>
              ))}
            </View>

            <Text style={styles.quote}>{active.quote}</Text>

            {/* Author */}
            <View style={styles.authorRow}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: active.avatarUri }}
                  style={styles.avatar}
                  contentFit="cover"
                  accessibilityLabel={`${active.name} avatar`}
                />
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={8} color={Colors.white} />
                </View>
              </View>
              <View>
                <Text style={styles.name}>{active.name}</Text>
                <Text style={styles.location}>{active.location}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </View>

      {/* Mobile nav */}
      {isMobile && (
        <View style={styles.mobileNav}>
          <Pressable
            onPress={prev}
            style={({ hovered }: any) => [styles.navBtn, hovered && styles.navBtnHovered]}
          >
            {({ hovered }: any) => (
              <Ionicons name="arrow-back" size={18} color={hovered ? Colors.white : Colors.navy} />
            )}
          </Pressable>
          <Pressable
            onPress={next}
            style={({ hovered }: any) => [styles.navBtn, styles.navBtnFilled, hovered && styles.navBtnFilledHovered]}
          >
            {({ hovered }: any) => (
              <Ionicons name="arrow-forward" size={18} color={Colors.white} />
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: Spacing.section,
    overflow: 'hidden',
    position: 'relative',
  },
  bgOrb: {
    position: 'absolute',
    top: -80,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(223,215,249,0.4)',
    ...(Platform.OS === 'web' ? { filter: 'blur(80px)' } as any : {}),
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xxxl,
  },
  innerMobile: {
    flexDirection: 'column',
    gap: Spacing.xxl,
  },
  leftCol: {
    flex: 5,
  },
  eyebrowPill: {
    backgroundColor: Colors.lavender,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  eyebrow: {
    fontFamily: FontFamily.sansBold,
    fontSize: 10,
    color: Colors.navy,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heading: {
    fontFamily: FontFamily.serif,
    fontSize: 42,
    color: Colors.navy,
    marginBottom: Spacing.sm,
    lineHeight: 54,
  },
  headingMobile: {
    fontSize: 32,
    lineHeight: 44,
  },
  subheading: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.slateLight,
    lineHeight: 22,
    marginBottom: Spacing.xl,
    maxWidth: 300,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.slateLighter,
    ...(Platform.OS === 'web' ? { transition: 'all 0.3s ease' } as any : {}),
  },
  dotActive: {
    width: 28,
    height: 8,
    backgroundColor: Colors.navy,
    borderRadius: 4,
  },
  navBtns: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {}),
  },
  navBtnHovered: {
    backgroundColor: Colors.navy,
  },
  navBtnFilled: {
    backgroundColor: Colors.coral,
    borderColor: Colors.coral,
    ...Shadows.glowCoral,
  },
  navBtnFilledHovered: {
    backgroundColor: Colors.coralDark,
  },
  rightCol: {
    flex: 7,
    position: 'relative',
    minHeight: 320,
    flexDirection: 'row',
    alignItems: 'center',
  },
  behindCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 44,
    backgroundColor: Colors.lavenderLight,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    transform: [{ translateX: 28 }, { translateY: 28 }],
    opacity: 0.6,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  quoteIconBehind: {
    marginBottom: Spacing.sm,
  },
  quoteIconText: {
    fontFamily: FontFamily.serif,
    fontSize: 48,
    color: Colors.slateLighter,
    lineHeight: 48,
  },
  behindQuote: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.slate,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  behindName: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.sm,
    color: Colors.navy,
  },
  activeCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    paddingTop: Spacing.xl,
    ...Shadows.cardLift,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    position: 'relative',
    zIndex: 2,
  },
  quoteIconActive: {
    marginBottom: Spacing.sm,
  },
  quoteIconTextActive: {
    fontFamily: FontFamily.serif,
    fontSize: 56,
    color: Colors.coral,
    lineHeight: 56,
    opacity: 0.6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: Spacing.md,
  },
  star: {
    color: Colors.ratingYellow,
    fontSize: 16,
  },
  quote: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.base,
    color: Colors.slate,
    lineHeight: 28,
    marginBottom: Spacing.xl,
    fontStyle: 'italic',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  avatarWrapper: {
    position: 'relative',
    width: 52,
    height: 52,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: Colors.lavender,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  name: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.md,
    color: Colors.navy,
  },
  location: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.slateLight,
    marginTop: 2,
  },
  mobileNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
});
