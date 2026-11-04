import React, { useRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Platform,
  findNodeHandle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Destinations from '../components/Destinations';
import BookingSteps from '../components/BookingSteps';
import Testimonials from '../components/Testimonials';
import Partners from '../components/Partners';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { Colors } from '../constants/theme';

export default function LandingPage() {
  const scrollRef = useRef<ScrollView>(null);
  const sectionRefs: Record<string, React.RefObject<View>> = {
    destinations: useRef<View>(null),
    services: useRef<View>(null),
    flights: useRef<View>(null),
    bookings: useRef<View>(null),
  };

  const scrollToSection = (section: string) => {
    const ref = sectionRefs[section];
    if (ref?.current && scrollRef.current) {
      if (Platform.OS === 'web') {
        // On web, use scrollIntoView for smooth behaviour
        const node = ref.current as any;
        if (node?.scrollIntoView) {
          node.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        ref.current.measureLayout(
          scrollRef.current as any,
          (_left: number, top: number) => {
            scrollRef.current?.scrollTo({ y: top - 70, animated: true });
          },
          () => {}
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Navbar onScrollToSection={scrollToSection} />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Hero */}
        <View ref={sectionRefs.flights}>
          <Hero />
        </View>

        {/* Services */}
        <View ref={sectionRefs.services} nativeID="services">
          <Services />
        </View>

        {/* Destinations */}
        <View ref={sectionRefs.destinations} nativeID="destinations">
          <Destinations />
        </View>

        {/* Booking Steps */}
        <View ref={sectionRefs.bookings} nativeID="bookings">
          <BookingSteps />
        </View>

        {/* Testimonials */}
        <Testimonials />

        {/* Partners */}
        <Partners />

        {/* Newsletter */}
        <Newsletter />

        {/* Footer */}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
