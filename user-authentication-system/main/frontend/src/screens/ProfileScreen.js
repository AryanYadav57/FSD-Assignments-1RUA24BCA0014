import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/client';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radii, spacing } from '../theme/spacing';

export const ProfileScreen = () => {
  const { user, token, logout } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [adminError, setAdminError] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [showFullToken, setShowFullToken] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleTestAdminRoute = async () => {
    setAdminLoading(true);
    setAdminError(null);
    setAdminData(null);

    try {
      const data = await authApi.getAdminUsers(token);
      setAdminData(data);
    } catch (err) {
      setAdminError({
        status: err.status || 403,
        message: err.message,
      });
    } finally {
      setAdminLoading(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent';

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.outerContainer}>
        {/* Top App Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.appTitle}>FSD Portal</Text>
            <Text style={styles.appSub}>Session Authenticated</Text>
          </View>
          <Button
            title="Log Out"
            variant="outline"
            onPress={logout}
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>

        {/* User Identity Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.profileHeaderText}>
              <Text style={styles.userName}>{user?.name || 'User Profile'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
            <Badge role={user?.role || 'student'} />
          </View>

          {/* Details Table */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Role</Text>
              <Text style={[styles.detailValue, { textTransform: 'capitalize' }]}>
                {user?.role}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>MongoDB User ID</Text>
              <Text style={[styles.detailValue, styles.codeValue]}>
                {user?._id || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Registration Timestamp</Text>
              <Text style={styles.detailValue}>{formattedDate}</Text>
            </View>

            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Session Token (JWT)</Text>
              <TouchableOpacity
                onPress={() => setShowFullToken(!showFullToken)}
                activeOpacity={0.7}
              >
                <Text style={styles.tokenToggle}>
                  {showFullToken ? 'Hide Token' : 'Reveal JWT Payload'}
                </Text>
              </TouchableOpacity>
            </View>

            {showFullToken && (
              <View style={styles.tokenBox}>
                <Text style={styles.tokenText}>{token}</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Live RBAC Interactive Demonstration Section */}
        <Card style={styles.rbacCard}>
          <View style={styles.rbacHeader}>
            <Text style={styles.rbacTitle}>Role-Based Access Control Demo</Text>
            <Text style={styles.rbacDescription}>
              This panel demonstrates server-side authorization enforcement. Clicking
              below calls the protected <Text style={styles.inlineCode}>/api/admin/users</Text> route.
            </Text>
          </View>

          <Button
            title="Invoke Admin Endpoint (/api/admin/users)"
            onPress={handleTestAdminRoute}
            loading={adminLoading}
            variant={isAdmin ? 'primary' : 'secondary'}
            style={styles.testButton}
          />

          {/* Admin Success Response */}
          {adminData && (
            <View style={styles.successBox}>
              <View style={styles.statusHeaderRow}>
                <View style={styles.statusPillSuccess}>
                  <Text style={styles.statusPillTextSuccess}>HTTP 200 OK — ACCESS GRANTED</Text>
                </View>
                <Text style={styles.countTag}>
                  Total Registered Accounts: {adminData.meta?.totalUsers}
                </Text>
              </View>

              <Text style={styles.directoryTitle}>System User Directory</Text>
              <View style={styles.userList}>
                {adminData.users.map((item, index) => (
                  <View key={item._id || index} style={styles.userItem}>
                    <View style={styles.userItemLeft}>
                      <Text style={styles.userItemName}>{item.name}</Text>
                      <Text style={styles.userItemEmail}>{item.email}</Text>
                    </View>
                    <Badge role={item.role} label={item.role} />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Student 403 Forbidden Response */}
          {adminError && (
            <View style={styles.forbiddenBox}>
              <View style={styles.statusPillDanger}>
                <Text style={styles.statusPillTextDanger}>
                  HTTP {adminError.status} FORBIDDEN — ACCESS DENIED
                </Text>
              </View>
              <Text style={styles.forbiddenMessage}>
                {adminError.message}
              </Text>
              <Text style={styles.forbiddenExplanation}>
                ✓ Server verification passed: Student JWT was rejected because the endpoint requires an <Text style={{fontWeight: '700'}}>admin</Text> role.
              </Text>
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  outerContainer: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  appTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  appSub: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    color: colors.success,
    fontWeight: typography.weights.medium,
  },
  logoutButton: {
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
  },
  logoutButtonText: {
    fontSize: typography.sizes.sm,
  },
  profileCard: {
    maxWidth: '100%',
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
  profileHeaderText: {
    flex: 1,
    minWidth: 160,
  },
  userName: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  userEmail: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  detailsGrid: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  detailValue: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  codeValue: {
    fontFamily: 'monospace',
    fontSize: typography.sizes.xs,
  },
  tokenToggle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.semiBold,
    cursor: 'pointer',
  },
  tokenBox: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  tokenText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: colors.textSecondary,
    wordBreak: 'break-all',
  },
  rbacCard: {
    maxWidth: '100%',
  },
  rbacHeader: {
    marginBottom: spacing.md,
  },
  rbacTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  rbacDescription: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  inlineCode: {
    fontFamily: 'monospace',
    color: colors.textPrimary,
    fontWeight: typography.weights.semiBold,
    backgroundColor: colors.background,
    paddingHorizontal: 4,
  },
  testButton: {
    marginBottom: spacing.md,
  },
  successBox: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.successBorder,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  statusPillSuccess: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  statusPillTextSuccess: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  countTag: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  directoryTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
    marginVertical: spacing.xs + 2,
  },
  userList: {
    gap: spacing.xs,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    borderRadius: radii.sm,
  },
  userItemLeft: {
    flex: 1,
  },
  userItemName: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
  },
  userItemEmail: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  forbiddenBox: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  statusPillDanger: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs + 2,
  },
  statusPillTextDanger: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.danger,
  },
  forbiddenMessage: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.danger,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  forbiddenExplanation: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
