import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import type { CardValues } from '../hooks/useCardForm';
import { getDisplayCardNumber, getDisplayCvc, getDisplayExpiry, getDisplayName } from '../utils/cardUtils';

type CreditCardPreviewProps = {
  values: CardValues;
  isCompact: boolean;
};

export function CreditCardPreview({ values, isCompact }: CreditCardPreviewProps) {
  return (
    <LinearGradient colors={['#13051f', '#241136', '#2b1839']} style={styles.panel}>
      {!isCompact && (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.panelSheen}
        />
      )}
      <View style={[styles.cards, isCompact && styles.cardsCompact]}>
        <LinearGradient
          colors={['#6236df', '#7c28c2', '#4f82d8', '#d76556', '#34004f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.frontCard, isCompact && styles.frontCardCompact]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardShine}
          />
          <View style={styles.cardRim} />
          <View style={styles.logoRow}>
            <View style={styles.logoLarge} />
            <View style={styles.logoSmall} />
          </View>

          <Text style={[styles.cardNumber, isCompact && styles.cardNumberCompact]}>
            {getDisplayCardNumber(values.cardNumber)}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.cardName} numberOfLines={1}>
              {getDisplayName(values.name)}
            </Text>
            <Text style={styles.cardExpiry}>{getDisplayExpiry(values.expMonth, values.expYear)}</Text>
          </View>
        </LinearGradient>

        <View style={[styles.backCard, isCompact && styles.backCardCompact]}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.86)', 'rgba(255, 255, 255, 0.18)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.backCardWash}
          />
          <View style={styles.magStripe} />
          <View style={styles.cvcBand}>
            <Text style={styles.cvcText}>{getDisplayCvc(values.cvc)}</Text>
          </View>
          <View style={styles.lines}>
            <View style={[styles.line, styles.lineWide]} />
            <View style={[styles.line, styles.lineShort]} />
            <View style={[styles.line, styles.lineMedium]} />
            <View style={[styles.line, styles.lineTiny]} />
            <View style={[styles.line, styles.lineMedium]} />
            <View style={[styles.line, styles.lineWide]} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'visible',
  },
  panelSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 190,
    height: '100%',
  },
  cards: {
    width: 470,
    height: 500,
    alignSelf: 'flex-end',
    marginRight: -96,
  },
  cardsCompact: {
    width: 370,
    height: 320,
    alignSelf: 'center',
    marginRight: 0,
    marginTop: 22,
  },
  frontCard: {
    width: 360,
    height: 198,
    borderRadius: 8,
    padding: 28,
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.26,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 22 },
    elevation: 10,
  },
  frontCardCompact: {
    width: 340,
    height: 186,
    padding: 22,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoLarge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#edf0f2',
    shadowColor: '#fff',
    shadowOpacity: 0.42,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  logoSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#edf0f2',
  },
  cardNumber: {
    color: '#f4edf7',
    fontSize: 22,
    letterSpacing: 2.6,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardNumberCompact: {
    fontSize: 20,
    letterSpacing: 1.8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 18,
  },
  cardName: {
    flex: 1,
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  cardExpiry: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  backCard: {
    width: 360,
    height: 198,
    borderRadius: 8,
    marginTop: 34,
    marginLeft: 70,
    backgroundColor: '#dfe3e8',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 7,
  },
  backCardCompact: {
    width: 340,
    height: 186,
    marginTop: 18,
    marginLeft: 24,
  },
  magStripe: {
    height: 46,
    marginTop: 24,
    backgroundColor: '#242125',
  },
  cvcBand: {
    height: 34,
    marginTop: 18,
    marginHorizontal: 34,
    borderRadius: 3,
    backgroundColor: '#9aa4ad',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  cvcText: {
    color: '#eef0f3',
    fontSize: 12,
    fontWeight: '700',
  },
  lines: {
    marginTop: 22,
    alignSelf: 'center',
    width: 150,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  line: {
    height: 3,
    borderRadius: 4,
    backgroundColor: '#96a0a9',
  },
  lineWide: {
    width: 86,
  },
  lineMedium: {
    width: 58,
  },
  lineShort: {
    width: 32,
  },
  lineTiny: {
    width: 18,
  },
  cardShine: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 210,
    height: 210,
    opacity: 0.46,
    transform: [{ rotate: '18deg' }],
  },
  cardRim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  backCardWash: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
