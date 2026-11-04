import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, FontFamily, FontSize, Shadows } from '../constants/theme';
import { SERVICES } from '../constants/data';
import { useBreakpoint } from '../hooks/useBreakpoint';

function useFadeUp(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(32)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 650, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, useNativeDriver: true, friction: 8 }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY }] };
}

export default function Services() {
  const { isMobile, isTablet } = useBreakpoint();
  const headerAnim = useFadeUp(100);

  const cols = isMobile ? 1 : isTablet ? 2 : 4;

  return (
    <View style={styles.section} nativeID="services">
      {/* Background decoration */}
      <View style={styles.bgAccent} pointerEvents="none" />

      {/* Dot grid decoration */}
      {Platform.OS === 'web' && (
        <View style={styles.dotGrid} pointerEvents="none">
          {Array.from({ length: 49 }).map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      )}

      <View style={styles.inner}>
        {/* Header */}
        <Animated.View style={[styles.header, headerAnim]}>
          <View style={styles.eyebrowPill}>
            <Text style={styles.eyebrow}>CATEGORY</Text>
          </View>
          <Text style={[styles.heading, isMobile && styles.headingMobile]}>
            We Offer Best Services
          </Text>
          <Text style={styles.subheading}>
            Everything you need for a perfect journey, all in one place.
          </Text>
        </Animated.View>

        {/* Cards Grid */}
        <View style={[styles.grid, isMobile && styles.gridMobile]}>
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} cols={cols} isMobile={isMobile} />
          ))}
        </View>
      </View>
    </View>
  );
}

function ServiceCard({ service, index, cols, isMobile }: any) {
  const anim = useFadeUp(200 + index * 120);

  return (
    <Animated.View style={[styles.cardWrapper, { width: isMobile ? '100%' : `${100 / cols - 2}%` }, anim]}>
      <Pressable
        style={({ hovered, pressed }: any) => [
          styles.card,
          service.highlighted && styles.cardHighlighted,
          hovered && !service.highlighted && styles.cardHovered,
          pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
        ]}
        accessibilityRole="button"
        accessibilityLabel={service.title}
      >
        {/* Coral decorative block for highlighted card */}
        {service.highlighted && (
          <>
            <View style={styles.coralDecorationMain} />
            <View style={styles.highlightedBadge}>
              <Text style={styles.highlightedBadgeText}>⭐ Popular</Text>
            </View>
          </>
        )}

        {/* Icon area */}
        <View style={styles.iconWrapper}>
          <View style={[styles.iconBg, { backgroundColor: service.iconBg }]} />
          <Ionicons
            name={service.iconName as any}
            size={34}
            color={service.iconColor}
            style={styles.icon}
          />
        </View>

        <Text style={[styles.cardTitle, service.highlighted && styles.cardTitleHighlighted]}>
          {service.title}
        </Text>
        <Text style={[styles.cardDesc, service.highlighted && styles.cardDescHighlighted]}>
          {service.description}
        </Text>

        {/* Learn more link */}
        <View style={styles.learnMore}>
          <Text style={[styles.learnMoreText, service.highlighted && { color: 'rgba(255,255,255,0.8)' }]}>
            Learn more
          </Text>
          <Ionicons
            name="arrow-forward"
            size={12}
            color={service.highlighted ? 'rgba(255,255,255,0.8)' : Colors.coral}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: Spacing.section,
    position: 'relative',
    overflow: 'hidden',
  },
  bgAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: Colors.lavenderLight,
    ...(Platform.OS === 'web' ? {} : {}),
  },
  inner: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  dotGrid: {
    position: 'absolute',
    top: 32,
    right: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 112,
    gap: 14,
    opacity: 0.2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.navy,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  eyebrowPill: {
    backgroundColor: Colors.lavender,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radii.full,
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
    fontSize: 44,
    color: Colors.navy,
    textAlign: 'center',
    lineHeight: 56,
  },
  headingMobile: {
    fontSize: 32,
    lineHeight: 44,
  },
  subheading: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.slate,
    textAlign: 'center',
    marginTop: Spacing.sm,
    maxWidth: 400,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xl,
    justifyContent: 'center',
  },
  gridMobile: {
    flexDirection: 'column',
  },
  cardWrapper: {
    minWidth: 200,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.soft,
    ...(Platform.OS === 'web' ? { transition: 'all 0.28s ease' } as any : {}),
  },
  cardHighlighted: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
    transform: [{ translateY: -10 }],
    ...Shadows.cardLiftStrong,
  },
  cardHovered: {
    transform: [{ translateY: -8 }],
    ...Shadows.cardLift,
    borderColor: Colors.border,
  },
  coralDecorationMain: {
    position: 'absolute',
    bottom: -24,
    right: -24,
    width: 88,
    height: 88,
    borderRadius: Radii.lg,
    backgroundColor: Colors.coral,
    opacity: 0.9,
    zIndex: 0,
    transform: [{ rotate: '20deg' }],
  },
  highlightedBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  highlightedBadgeText: {
    fontFamily: FontFamily.sansBold,
    fontSize: 9,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  iconBg: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: Radii.sm,
    top: -2,
    right: -4,
  },
  icon: {
    zIndex: 1,
  },
  cardTitle: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.md,
    color: Colors.navy,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    zIndex: 1,
  },
  cardTitleHighlighted: {
    color: Colors.white,
  },
  cardDesc: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.slate,
    textAlign: 'center',
    lineHeight: 22,
    zIndex: 1,
  },
  cardDescHighlighted: {
    color: 'rgba(255,255,255,0.75)',
  },
  learnMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.md,
    zIndex: 1,
  },
  learnMoreText: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.xs,
    color: Colors.coral,
  },
});
