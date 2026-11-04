import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, FontFamily, FontSize, Shadows } from '../constants/theme';
import { BOOKING_STEPS } from '../constants/data';
import { useBreakpoint } from '../hooks/useBreakpoint';;
import Svg, { Path, Circle } from 'react-native-svg';

function FlightPath() {
  return (
    <Svg width="200" height="150" viewBox="0 0 200 150" style={{ position: 'absolute', top: -20, left: 0, opacity: 0.2 }}>
      <Path
        d="M20 80 Q 80 20, 180 60"
        stroke={Colors.coral}
        strokeWidth="2"
        strokeDasharray="6 4"
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx="20" cy="80" r="5" fill={Colors.coral} opacity={0.5} />
      <Circle cx="180" cy="60" r="5" fill={Colors.coral} opacity={0.5} />
    </Svg>
  );
}

export default function BookingSteps() {
  const { isMobile } = useBreakpoint();

  return (
    <View style={styles.section} nativeID="bookings">
      {/* Background */}
      <View style={styles.bgGradient} pointerEvents="none" />
      <View style={styles.bgOrbRight} pointerEvents="none" />

      <View style={[styles.inner, isMobile && styles.innerMobile]}>
        {/* Left — Steps */}
        <View style={[styles.leftCol, isMobile && { width: '100%' }]}>
          <View style={styles.eyebrowPill}>
            <Text style={styles.eyebrow}>EASY AND FAST</Text>
          </View>
          <Text style={[styles.heading, isMobile && styles.headingMobile]}>
            Book Your Next Trip{'\n'}In 3 Easy Steps
          </Text>
          <Text style={styles.subheading}>
            Simple, transparent, and incredibly fast — from search to boarding.
          </Text>

          <View style={styles.stepsList}>
            {BOOKING_STEPS.map((step, index) => (
              <View key={step.id} style={styles.stepRow}>
                {/* Step number line */}
                <View style={styles.stepLeft}>
                  <View style={[styles.stepIcon, { backgroundColor: step.color }]}>
                    <Ionicons name={step.iconName as any} size={22} color={Colors.white} />
                  </View>
                  {index < BOOKING_STEPS.length - 1 && (
                    <View style={styles.stepConnector} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepNumber}>Step {index + 1}</Text>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Right — Trip Cards */}
        <View style={[styles.rightCol, isMobile && { width: '100%', marginTop: Spacing.xxl }]}>
          {/* Glow orb */}
          <View style={styles.glowOrb} pointerEvents="none" />

          {/* Decorative Flight Path SVG */}
          <FlightPath />

          {/* Main Card — Trip to Greece */}
          <View style={styles.mainCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' }}
              style={styles.mainCardImage}
              contentFit="cover"
              accessibilityLabel="Santorini Greece whitewashed village"
            />

            <View style={styles.mainCardBody}>
              <View style={styles.mainCardHeader}>
                <View>
                  <Text style={styles.mainCardTitle}>Trip To Greece</Text>
                  <Text style={styles.mainCardSub}>14 – 29 June</Text>
                </View>
                <View style={styles.pricePill}>
                  <Text style={styles.pricePillText}>$2.4k</Text>
                </View>
              </View>

              {/* Action Icons */}
              <View style={styles.actionIcons}>
                {(['star-outline', 'map-outline', 'send-outline', 'bookmark-outline'] as const).map((icon) => (
                  <View key={icon} style={styles.actionIcon}>
                    <Ionicons name={icon} size={15} color={Colors.slate} />
                  </View>
                ))}
              </View>

              {/* Footer */}
              <View style={styles.mainCardFooter}>
                <View style={styles.avatarRow}>
                  <View style={styles.avatarGroup}>
                    {['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'].map((uri, i) => (
                      <Image
                        key={i}
                        source={{ uri }}
                        style={[styles.avatar, { marginLeft: i > 0 ? -8 : 0 }]}
                        contentFit="cover"
                      />
                    ))}
                    <View style={[styles.avatar, styles.avatarCount, { marginLeft: -8 }]}>
                      <Text style={styles.avatarCountText}>+22</Text>
                    </View>
                  </View>
                  <Text style={styles.goingText}>24 going</Text>
                </View>
                <View style={styles.likeBtn}>
                  <Ionicons name="heart" size={18} color={Colors.rose} />
                </View>
              </View>
            </View>
          </View>

          {/* Overlapping Mini Card — Trip to Rome */}
          <View style={styles.miniCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=200&q=80' }}
              style={styles.miniAvatar}
              contentFit="cover"
              accessibilityLabel="Traveler avatar"
            />
            <View style={styles.miniCardContent}>
              <View style={styles.ongoingBadge}>
                <View style={styles.ongoingDot} />
                <Text style={styles.miniCardLabel}>Ongoing</Text>
              </View>
              <Text style={styles.miniCardTitle}>Trip to Rome</Text>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>40% completed</Text>
                <Text style={styles.progressPercent}>40%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={styles.progressBar} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: Spacing.section,
    overflow: 'visible',
    position: 'relative',
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.heroGradientStart,
  },
  bgOrbRight: {
    position: 'absolute',
    top: '10%',
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(186,230,253,0.25)',
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
  },
  leftCol: {
    flex: 1,
  },
  eyebrowPill: {
    backgroundColor: Colors.creamDeep,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  eyebrow: {
    fontFamily: FontFamily.sansBold,
    fontSize: 10,
    color: Colors.coral,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heading: {
    fontFamily: FontFamily.serif,
    fontSize: 42,
    color: Colors.navy,
    lineHeight: 56,
    marginBottom: Spacing.sm,
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
    marginBottom: Spacing.xxxl,
    maxWidth: 340,
  },
  stepsList: {
    gap: 0,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  stepLeft: {
    alignItems: 'center',
    width: 50,
  },
  stepIcon: {
    width: 50,
    height: 50,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
    flexShrink: 0,
  },
  stepConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 6,
    minHeight: 24,
  },
  stepContent: {
    flex: 1,
    paddingBottom: Spacing.xl,
  },
  stepNumber: {
    fontFamily: FontFamily.sansBold,
    fontSize: 10,
    color: Colors.slateLighter,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  stepTitle: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.md,
    color: Colors.navy,
    marginBottom: 4,
  },
  stepDesc: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.slate,
    lineHeight: 22,
  },
  rightCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 500,
  },
  glowOrb: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(186,230,253,0.4)',
    ...(Platform.OS === 'web' ? { filter: 'blur(70px)' } as any : {}),
  },
  mainCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.cardLift,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    position: 'relative',
    zIndex: 2,
  },
  mainCardImage: {
    width: '100%',
    height: 170,
  },
  mainCardBody: {
    padding: Spacing.lg,
  },
  mainCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  mainCardTitle: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.md,
    color: Colors.navy,
  },
  mainCardSub: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.slateLight,
    marginTop: 3,
  },
  pricePill: {
    backgroundColor: Colors.coralLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  pricePillText: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.sm,
    color: Colors.coral,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarCount: {
    backgroundColor: Colors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCountText: {
    fontFamily: FontFamily.sansBold,
    fontSize: 9,
    color: Colors.navy,
  },
  goingText: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.xs,
    color: Colors.slateLight,
  },
  likeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(244,63,94,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniCard: {
    position: 'absolute',
    bottom: -16,
    right: -16,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    ...Shadows.cardLift,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: 250,
    zIndex: 10,
  },
  miniAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    flexShrink: 0,
  },
  miniCardContent: {
    flex: 1,
  },
  ongoingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  ongoingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  miniCardLabel: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.xs,
    color: Colors.success,
  },
  miniCardTitle: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.sm,
    color: Colors.navy,
    marginBottom: 6,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressLabel: {
    fontFamily: FontFamily.sans,
    fontSize: 10,
    color: Colors.slateLight,
  },
  progressPercent: {
    fontFamily: FontFamily.sansBold,
    fontSize: 10,
    color: Colors.coral,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    width: '40%',
    height: '100%',
    backgroundColor: Colors.coral,
    borderRadius: 3,
  },
});
