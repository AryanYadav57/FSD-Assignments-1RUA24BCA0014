import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';

/* ── Custom Toast config ── */
const toastConfig = {
  success: (props: any) => (
    <View
      style={{
        width: 320,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        paddingLeft: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#10b981', // green accent
        // Positioning it explicitly to the right within the library's centered wrapper
        alignSelf: 'flex-end',
        marginRight: 24,
        zIndex: 9999, // Fix glitching on web over other absolute elements
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#1c1917', marginBottom: 4 }}>
        {props.text1}
      </Text>
      <Text style={{ fontSize: 13, color: '#57534e', lineHeight: 18 }}>
        {props.text2}
      </Text>
    </View>
  ),
  error: (props: any) => (
    <View
      style={{
        width: 320,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        paddingLeft: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444', // red accent
        alignSelf: 'flex-end',
        marginRight: 24,
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#1c1917', marginBottom: 4 }}>
        {props.text1}
      </Text>
      <Text style={{ fontSize: 13, color: '#57534e', lineHeight: 18 }}>
        {props.text2}
      </Text>
    </View>
  ),
};

export default function RegistrationScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ticketType: 'General',
    track: 'Frontend',
    tshirtSize: 'M',
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleUpdate = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'That doesn\'t look like a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone))
      newErrors.phone = 'Please enter a valid phone number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Oops, something\'s missing',
        text2: 'Please fix the highlighted fields below.',
        position: 'top',
        topOffset: 50,
      });
      return;
    }

    console.log("Form Submitted Successfully:", formData);

    Toast.show({
      type: 'success',
      text1: 'You\'re in!',
      text2: `See you at TechConf, ${formData.name.split(' ')[0]}!`,
      position: 'top',
      topOffset: 50,
      visibilityTime: 4000,
    });
  };

  const ticketOptions = [
    { label: 'General Admission', value: 'General' },
    { label: 'VIP Pass', value: 'VIP' },
    { label: 'Student Ticket', value: 'Student' },
  ];

  const trackOptions = [
    { label: 'Frontend Development', value: 'Frontend' },
    { label: 'Backend & Systems', value: 'Backend' },
    { label: 'AI & Machine Learning', value: 'AI' },
  ];

  const sizeOptions = [
    { label: 'Small (S)', value: 'S' },
    { label: 'Medium (M)', value: 'M' },
    { label: 'Large (L)', value: 'L' },
    { label: 'Extra Large (XL)', value: 'XL' },
  ];

  return (
    <View style={styles.root}>
      {/* Warm background accent */}
      <View style={styles.bgAccent} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Header ─── */}
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Oct 15 – 18  ·  San Francisco</Text>
            <Text style={styles.title}>TechConf{'\n'}2026</Text>
            <Text style={styles.subtitle}>
              Three days of talks, workshops, and hallway conversations with the people building what's next.
            </Text>
          </View>

          {/* ─── Form Card ─── */}
          <View style={styles.card}>
            {/* ── Section 1 ── */}
            <Text style={styles.sectionLabel}>About you</Text>

            <InputField
              label="Full Name"
              placeholder="Jane Doe"
              value={formData.name}
              onChangeText={(v: string) => handleUpdate('name', v)}
              error={errors.name}
            />
            <InputField
              label="Email"
              placeholder="jane@company.com"
              value={formData.email}
              onChangeText={(v: string) => handleUpdate('email', v)}
              keyboardType="email-address"
              error={errors.email}
            />
            <InputField
              label="Phone"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChangeText={(v: string) => handleUpdate('phone', v)}
              keyboardType="phone-pad"
              error={errors.phone}
            />

            {/* ── Divider ── */}
            <View style={styles.divider} />

            {/* ── Section 2 ── */}
            <Text style={styles.sectionLabel}>Your preferences</Text>

            <SelectField
              label="Ticket Type"
              selectedValue={formData.ticketType}
              onValueChange={(v: string) => handleUpdate('ticketType', v)}
              items={ticketOptions}
            />
            <SelectField
              label="Track"
              selectedValue={formData.track}
              onValueChange={(v: string) => handleUpdate('track', v)}
              items={trackOptions}
            />
            <SelectField
              label="T-Shirt Size"
              selectedValue={formData.tshirtSize}
              onValueChange={(v: string) => handleUpdate('tshirtSize', v)}
              items={sizeOptions}
            />

            {/* ── Submit ── */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>Register now</Text>
            </TouchableOpacity>

            <Text style={styles.footnote}>
              By registering you agree to our terms of service.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast config={toastConfig} />
    </View>
  );
}

/* ───────── Styles ───────── */
const CREAM = '#faf8f5';
const WARM_BG = '#f5f0eb';
const INK = '#1c1917';
const MUTED = '#78716c';
const ACCENT = '#d97706'; // warm amber
const CARD_BG = '#ffffff';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: {
    flex: 1,
    backgroundColor: WARM_BG,
  },

  /* Single organic accent blob — not a gradient, just a soft warm circle */
  bgAccent: {
    position: 'absolute',
    top: -180,
    right: -120,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: '#fde68a',
    opacity: 0.35,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 80,
    alignItems: 'center',
  },

  /* ── Header ── */
  header: {
    maxWidth: 520,
    width: '100%',
    marginBottom: 40,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '600',
    color: ACCENT,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: INK,
    lineHeight: 52,
    letterSpacing: -1.5,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 17,
    color: MUTED,
    lineHeight: 26,
  },

  /* ── Card ── */
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 32,
    // Subtle shadow instead of heavy glow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: MUTED,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e7e5e4',
    marginTop: 8,
    marginBottom: 28,
  },

  /* ── Submit ── */
  submitBtn: {
    backgroundColor: INK,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footnote: {
    fontSize: 12,
    color: '#a8a29e',
    textAlign: 'center',
    marginTop: 16,
  },
});
