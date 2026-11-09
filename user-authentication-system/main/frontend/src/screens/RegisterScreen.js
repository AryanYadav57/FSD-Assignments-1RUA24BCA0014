import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Card } from '../components/Card';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { SegmentedControl } from '../components/SegmentedControl';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radii, spacing } from '../theme/spacing';

export const RegisterScreen = ({ onNavigateToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleIndex, setRoleIndex] = useState(0); // 0 = student, 1 = admin
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const roles = [
    { label: 'Student Account', value: 'student' },
    { label: 'Administrator', value: 'admin' },
  ];

  const handleRegister = async () => {
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const selectedRole = roles[roleIndex].value;
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role: selectedRole,
      });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles[roleIndex].value;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.outerContainer}>
        {/* Header Branding */}
        <View style={styles.headerArea}>
          <Text style={styles.labSubtitle}>BCA 5th Sem • FSD Lab Assessment</Text>
          <Text style={styles.mainTitle}>Create Account</Text>
          <Text style={styles.subTitle}>
            Register a new student or administrator profile
          </Text>
        </View>

        <Card>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Sign Up</Text>
            <Text style={styles.cardSubtitle}>
              Fill in your details below to get started
            </Text>
          </View>

          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errorMsg}</Text>
            </View>
          ) : null}

          <InputField
            label="Full Name"
            placeholder="Jane Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <InputField
            label="Email Address"
            placeholder="jane@college.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Password"
            placeholder="Min. 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            helperText="Passwords will be salted and hashed via bcrypt."
          />

          {/* Role Selection */}
          <View style={styles.roleSection}>
            <Text style={styles.roleLabel}>Select Account Role</Text>
            <SegmentedControl
              options={roles}
              selectedIndex={roleIndex}
              onChange={(idx) => setRoleIndex(idx)}
            />
            <View
              style={[
                styles.roleExplainer,
                selectedRole === 'admin'
                  ? styles.roleExplainerAdmin
                  : styles.roleExplainerStudent,
              ]}
            >
              <Text
                style={[
                  styles.roleExplainerText,
                  selectedRole === 'admin'
                    ? styles.roleExplainerTextAdmin
                    : styles.roleExplainerTextStudent,
                ]}
              >
                {selectedRole === 'admin'
                  ? '🛡️ Admin privileges: Access to administrative dashboard and system-wide user directory.'
                  : '🎓 Student privileges: Access to personal profile and authenticated resources.'}
              </Text>
            </View>
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.submitButton}
          />

          <View style={styles.toggleRow}>
            <Text style={styles.togglePrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
              <Text style={styles.toggleAction}>Sign in here</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  outerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    maxWidth: 440,
    width: '100%',
    textAlign: 'center',
  },
  labSubtitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  mainTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: spacing.xs,
  },
  subTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.sm,
  },
  cardHeader: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  errorBanner: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.danger,
    lineHeight: 18,
  },
  roleSection: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  roleLabel: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs + 2,
  },
  roleExplainer: {
    padding: spacing.sm + 2,
    borderRadius: radii.sm,
    borderWidth: 1,
    marginTop: spacing.xs,
  },
  roleExplainerStudent: {
    backgroundColor: colors.roles.student.bg,
    borderColor: colors.roles.student.border,
  },
  roleExplainerAdmin: {
    backgroundColor: colors.roles.admin.bg,
    borderColor: colors.roles.admin.border,
  },
  roleExplainerText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
  },
  roleExplainerTextStudent: {
    color: colors.roles.student.text,
  },
  roleExplainerTextAdmin: {
    color: colors.roles.admin.text,
  },
  submitButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  togglePrompt: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  toggleAction: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    color: colors.primary,
    cursor: 'pointer',
  },
});
