import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radii, spacing } from '../theme/spacing';

export const Badge = ({ role = 'student', label, style }) => {
  const isStudent = role.toLowerCase() === 'student';
  const roleConfig = isStudent ? colors.roles.student : colors.roles.admin;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: roleConfig.bg,
          borderColor: roleConfig.border,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: roleConfig.text },
        ]}
      />
      <Text style={[styles.text, { color: roleConfig.text }]}>
        {label || (isStudent ? 'Student Account' : 'Administrator')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs + 2,
  },
  text: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
