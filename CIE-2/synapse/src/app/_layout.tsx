import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  );
}

function AuthGate() {
  const { setSession, setLoading, isLoading, session } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
        SplashScreen.hideAsync();
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      SplashScreen.hideAsync();
    });

    return () => subscription.unsubscribe();
  }, []);

  const rootSegment = segments[0];

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = rootSegment === '(auth)';
    const inAppGroup  = rootSegment === '(app)';

    // Public note route: /<username>/<slug> — allow unauthenticated access
    const isPublicNoteRoute =
      segments.length === 2 && !inAuthGroup && !inAppGroup;

    if (!session && !inAuthGroup && !isPublicNoteRoute) {
      // Not logged in — redirect to login
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Logged in — show the welcome landing page first
      router.replace('/(app)/welcome');
    }
  }, [session, rootSegment, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="index" />
      <Stack.Screen name="[username]/[slug]" />
    </Stack>
  );
}
