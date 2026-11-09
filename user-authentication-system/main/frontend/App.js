import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { colors } from './src/theme/colors';
import { typography } from './src/theme/typography';

const MainNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentAuthScreen, setCurrentAuthScreen] = useState('login'); // 'login' | 'register'

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.textPrimary} />
        <Text style={styles.loadingText}>Restoring session...</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    return <ProfileScreen />;
  }

  if (currentAuthScreen === 'register') {
    return (
      <RegisterScreen onNavigateToLogin={() => setCurrentAuthScreen('login')} />
    );
  }

  return (
    <LoginScreen onNavigateToRegister={() => setCurrentAuthScreen('register')} />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <MainNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 12,
  },
});
