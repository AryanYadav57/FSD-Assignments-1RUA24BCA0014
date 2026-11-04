import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, FontFamily, FontSize, Shadows } from '../constants/theme';
import { DESTINATIONS, Destination } from '../constants/data';
import { useBreakpoint } from '../hooks/useBreakpoint';

export default function Destinations() {
  const { isMobile, isTablet } = useBreakpoint();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ rome: true });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, delay: 150, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: 150, useNativeDriver: true, friction: 8 }),
    ]).start();
  }, []);

  return (
    <View style={styles.section} nativeID="destinations">
      {/* Background decoration */}
      <View style={styles.bgOrb} pointerEvents="none" />

      <Animated.View style={[styles.inner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <View style={[styles.headerRow, isMobile && styles.headerRowMobile]}>
          <View>
            <View style={styles.eyebrowPill}>
              <Text style={styles.eyebrow}>TOP SELLING</Text>
            </View>
            <Text style={[styles.heading, isMobile && styles.headingMobile]}>Top Destinations</Text>
            <Text style={styles.subheading}>Hand-picked gems waiting to be explored</Text>
          </View>
          <Pressable style={styles.viewAll} accessibilityRole="link" accessibilityLabel="View all destinations">
            {({ hovered }: any) => (
              <View style={[styles.viewAllInner, hovered && styles.viewAllInnerHovered]}>
                <Text style={[styles.viewAllText, hovered && styles.viewAllHovered]}>View all</Text>
                <Ionicons name="arrow-forward" size={16} color={hovered ? Colors.coralDark : Colors.coral} />
              </View>
            )}
          </Pressable>
        </View>

        {/* Cards */}
        {isMobile ? (
          <FlatList
            horizontal
            data={DESTINATIONS}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: Spacing.lg, paddingRight: Spacing.lg }}
            renderItem={({ item }) => (
              <DestinationCard
                destination={item}
                isFavorited={!!favorites[item.id]}
                onToggleFavorite={() => toggleFavorite(item.id)}
                style={{ width: 290 }}
              />
            )}
          />
        ) : (
          <View style={styles.grid}>
            {DESTINATIONS.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                isFavorited={!!favorites[dest.id]}
                onToggleFavorite={() => toggleFavorite(dest.id)}
                style={{ flex: 1, minWidth: 260 }}
              />
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

function DestinationCard({ destination, isFavorited, onToggleFavorite, style }: {
  destination: Destination;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  style?: any;
}) {
  const heartAnim = useRef(new Animated.Value(1)).current;
  const heartColor = useRef(new Animated.Value(isFavorited ? 1 : 0)).current;

  const handleHeartPress = (e: any) => {
    if (Platform.OS === 'web') {
      e?.stopPropagation?.();
    }
    Animated.sequence([
      Animated.spring(heartAnim, { toValue: 1.4, useNativeDriver: true, friction: 4 }),
      Animated.spring(heartAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
    ]).start();
    onToggleFavorite();
  };

  return (
    <Pressable
      style={({ hovered }: any) => [
        styles.card,
        style,
        hovered && styles.cardHovered,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${destination.name}, ${destination.country}`}
    >
      {({ hovered }: any) => (
        <>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: destination.imageUri }}
              style={[styles.image, hovered && styles.imageHovered]}
              contentFit="cover"
              accessibilityLabel={`${destination.name} landscape`}
              transition={300}
            />
            {/* Gradient overlay */}
            <View style={styles.imageOverlay} pointerEvents="none" />

            {/* Rating Badge */}
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeStar}>★</Text>
              <Text style={styles.ratingBadgeText}>
                {destination.rating} · {destination.reviewCount}
              </Text>
            </View>

            {/* Heart / Favorite */}
            <Animated.View style={[styles.heartBtn, { transform: [{ scale: heartAnim }] }]}>
              <Pressable
                onPress={handleHeartPress}
                accessibilityRole="button"
                accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                style={{ padding: 6 }}
              >
                <Ionicons
                  name={isFavorited ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isFavorited ? Colors.rose : '#94A3B8'}
                />
              </Pressable>
            </Animated.View>

            {/* Days badge */}
            <View style={styles.daysBadge}>
              <Text style={styles.daysBadgeText}>{destination.days} Days</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.cardRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.destName}>{destination.name}</Text>
                {destination.country ? (
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={12} color={Colors.slateLight} />
                    <Text style={styles.destCountry}>{destination.country}</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.priceFrom}>from</Text>
                <Text style={styles.destPrice}>{destination.price}</Text>
              </View>
            </View>

            <Pressable
              style={({ hovered: h }: any) => [styles.bookBtn, h && styles.bookBtnHovered]}
              accessibilityRole="button"
            >
              {({ hovered: h }: any) => (
                <Text style={[styles.bookBtnText, h && { color: Colors.white }]}>Book Now</Text>
              )}
            </Pressable>
          </View>
        </>
      )}
    </Pressable>
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
    bottom: -120,
    left: -120,
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: 'rgba(255,241,218,0.5)',
    ...(Platform.OS === 'web' ? { filter: 'blur(80px)' } as any : {}),
  },
  inner: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxxl,
  },
  headerRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.lg,
  },
  eyebrowPill: {
    backgroundColor: Colors.creamDeep,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
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
    fontSize: 44,
    color: Colors.navy,
    marginTop: Spacing.xs,
  },
  headingMobile: {
    fontSize: 32,
  },
  subheading: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.slateLight,
    marginTop: 4,
  },
  viewAll: {},
  viewAllInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {}),
  },
  viewAllInnerHovered: {
    borderColor: Colors.coral,
    backgroundColor: Colors.coralLight,
  },
  viewAllText: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.sm,
    color: Colors.coral,
  },
  viewAllHovered: {
    color: Colors.coralDark,
  },
  grid: {
    flexDirection: 'row',
    gap: Spacing.xl,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...(Platform.OS === 'web' ? { transition: 'all 0.3s ease' } as any : {}),
  },
  cardHovered: {
    ...Shadows.cardLift,
    transform: [{ translateY: -6 }],
    borderColor: Colors.border,
  },
  imageContainer: {
    height: 230,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web' ? { transition: 'transform 0.4s ease' } as any : {}),
  },
  imageHovered: {
    transform: [{ scale: 1.05 }],
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    ...(Platform.OS === 'web' ? {
      background: 'linear-gradient(to top, rgba(20,24,62,0.5), transparent)',
    } as any : { backgroundColor: 'transparent' }),
  },
  ratingBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: Radii.full,
    ...Shadows.soft,
  },
  ratingBadgeStar: {
    color: Colors.ratingYellow,
    fontSize: 12,
  },
  ratingBadgeText: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.xs,
    color: Colors.navy,
  },
  heartBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
  daysBadge: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    backgroundColor: 'rgba(20,24,62,0.75)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.xs,
  },
  daysBadgeText: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: 10,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  cardBody: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  destName: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.md,
    color: Colors.navy,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  destCountry: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.slateLight,
  },
  priceBox: {
    alignItems: 'flex-end',
  },
  priceFrom: {
    fontFamily: FontFamily.sans,
    fontSize: 9,
    color: Colors.slateLighter,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  destPrice: {
    fontFamily: FontFamily.sansBold,
    fontSize: FontSize.md,
    color: Colors.coral,
  },
  bookBtn: {
    borderWidth: 1.5,
    borderColor: Colors.coral,
    borderRadius: Radii.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {}),
  },
  bookBtnHovered: {
    backgroundColor: Colors.coral,
  },
  bookBtnText: {
    fontFamily: FontFamily.sansSemibold,
    fontSize: FontSize.sm,
    color: Colors.coral,
    ...(Platform.OS === 'web' ? { transition: 'color 0.2s ease' } as any : {}),
  },
});
