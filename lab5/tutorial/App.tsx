import { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { ComponentHierarchy } from './src/components/component-hierarchy';
import { FlimCanvas } from './src/components/flim-canvas';
import { FlimHero } from './src/components/flim-hero';
import { FlimNavbar } from './src/components/flim-navbar';
import { HttpCycleTracer } from './src/components/http-cycle-tracer';
import { LayoutFixer } from './src/components/layout-fixer';
import { NotFound } from './src/components/not-found';
import { TutorialDrawer } from './src/components/tutorial-drawer';
import { ValidationLab } from './src/components/validation-lab';
import { routePaths, type RoutePath } from './src/data/tutorials';
import { themes, type ThemeName } from './src/theme';

type AppPath = RoutePath | '/not-found';

export default function App() {
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>('noir');
  const [activePath, setActivePath] = useState<AppPath>(() => getInitialPath());
  const [showDrawer, setShowDrawer] = useState(true);

  const theme = useMemo(() => themes[currentThemeName], [currentThemeName]);
  const routeExists = useMemo(() => routePaths.includes(activePath as RoutePath), [activePath]);
  const activeRoute = routeExists ? (activePath as RoutePath) : null;

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return undefined;
    }

    const syncPath = () => setActivePath(resolvePath(window.location.pathname));
    window.addEventListener('popstate', syncPath);

    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  function navigate(path: RoutePath) {
    setActivePath(path);

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  }

  function toggleTutorialDrawer() {
    setShowDrawer((prev) => !prev);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[styles.pageContainer, { backgroundColor: theme.background }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.appShell, { borderColor: theme.border }]}>
          {/* Top Navbar with Home & Expandable LABS Dropdown */}
          <FlimNavbar
            activePath={activeRoute ?? '/'}
            onNavigate={navigate}
            onOpenTutorialDrawer={toggleTutorialDrawer}
            theme={theme}
          />

          {/* Hero Header Area: Tutorials Title & Theme Switcher */}
          <FlimHero
            currentThemeName={currentThemeName}
            onSelectTheme={setCurrentThemeName}
            theme={theme}
          />

          {/* Active View / Main Stage */}
          <View style={styles.mainContent}>
            {renderActiveRoute(activeRoute, navigate, theme)}
          </View>

          {/* Integrated Tutorial Labs Drawer */}
          {showDrawer && (
            <View style={styles.drawerWrap}>
              <TutorialDrawer
                activePath={activeRoute ?? '/'}
                onNavigate={navigate}
                theme={theme}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getInitialPath(): AppPath {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return '/';
  }
  return resolvePath(window.location.pathname);
}

function resolvePath(pathname: string): AppPath {
  const cleaned = pathname === '' ? '/' : pathname;
  return routePaths.includes(cleaned as RoutePath) ? (cleaned as RoutePath) : '/not-found';
}

function renderActiveRoute(
  activePath: RoutePath | null,
  navigate: (path: RoutePath) => void,
  theme: typeof themes['noir']
) {
  if (!activePath) {
    return <NotFound onNavigate={navigate} theme={theme} />;
  }

  switch (activePath) {
    case '/':
      return <FlimCanvas onNavigate={navigate} theme={theme} />;
    case '/pricing':
    case '/http-cycle':
      return <HttpCycleTracer theme={theme} />;
    case '/blog':
    case '/layout-fixer':
      return <LayoutFixer theme={theme} />;
    case '/sign-up':
    case '/validation-lab':
      return <ValidationLab theme={theme} />;
    case '/tutorials':
    case '/component-hierarchy':
      return <ComponentHierarchy theme={theme} />;
    default:
      return <NotFound onNavigate={navigate} theme={theme} />;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  pageContainer: {
    alignItems: 'center',
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 18,
    width: '100%',
  },
  appShell: {
    borderWidth: 1,
    borderRadius: 16,
    maxWidth: 1320,
    overflow: 'hidden',
    width: '100%',
  },
  mainContent: {
    padding: 16,
    width: '100%',
  },
  drawerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    width: '100%',
  },
});
