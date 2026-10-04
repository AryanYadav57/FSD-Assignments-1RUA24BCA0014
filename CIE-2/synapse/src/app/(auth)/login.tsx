import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from '@/tw';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async () => {
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage('Check your email for a confirmation link.');
      }
    } else {
      if (password) {
        // Email + password login
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          useAuthStore.getState().setSession(data.session);
          router.replace('/(app)/welcome');
        }
      } else {
        // Magic link
        const { error: magicError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
        });

        if (magicError) {
          setError(magicError.message);
        } else {
          setMessage('Check your email for a magic link.');
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <View className="flex-1 bg-synapse-bg justify-center">
      <StatusBar style="auto" />
      <ScrollView className="flex-1" contentContainerClassName="flex-grow items-center justify-center px-4 py-12">
        <View className="w-full max-w-md bg-synapse-surface border border-synapse-border rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Logo */}
          <View className="items-center mb-10">
            <View className="flex-row items-center justify-center gap-3 mb-6">
              <View className="w-6 h-6 flex-row flex-wrap justify-between content-between">
                <View className="w-2.5 h-2.5 bg-synapse-text rounded-full" />
                <View className="w-2.5 h-2.5 bg-synapse-accent rounded-full" />
                <View className="w-2.5 h-2.5 bg-synapse-gold rounded-full" />
                <View className="w-2.5 h-2.5 bg-synapse-text rounded-full" />
              </View>
              <Text className="font-sans font-bold text-2xl text-synapse-text tracking-tight">Synapse</Text>
            </View>
            <Text className="font-serif text-3xl sm:text-4xl text-synapse-text text-center leading-tight">
              {isSignUp ? 'Start connecting\nyour thoughts.' : 'Welcome back.'}
            </Text>
          </View>

          {/* Form */}
          <View className="mb-6">
            <View className="mb-4">
              <Text className="font-sans text-xs font-semibold text-synapse-text-muted uppercase tracking-wider mb-2 ml-1">
                Email Address
              </Text>
              <TextInput
                className="font-sans text-base text-synapse-text bg-synapse-bg border border-synapse-border rounded-2xl px-5 py-4 focus:border-synapse-accent"
                placeholder="you@example.com"
                placeholderTextColor="#8C8A84"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View className="mb-2">
              <Text className="font-sans text-xs font-semibold text-synapse-text-muted uppercase tracking-wider mb-2 ml-1">
                Password
              </Text>
              <TextInput
                className="font-sans text-base text-synapse-text bg-synapse-bg border border-synapse-border rounded-2xl px-5 py-4 focus:border-synapse-accent"
                placeholder={isSignUp ? 'Create a secure password' : 'Leave empty for magic link'}
                placeholderTextColor="#8C8A84"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
            </View>
          </View>

          {/* Error / Message */}
          {error ? (
            <View className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 mb-6">
              <Text className="font-sans text-sm text-red-600">{error}</Text>
            </View>
          ) : null}
          {message ? (
            <View className="bg-green-500/10 border border-green-500/20 rounded-2xl px-5 py-4 mb-6">
              <Text className="font-sans text-sm text-green-600">{message}</Text>
            </View>
          ) : null}

          {/* Submit Button */}
          <Pressable
            onPress={handleAuth}
            disabled={isLoading}
            className={`py-4 rounded-2xl items-center mb-6 shadow-sm ${
              isLoading ? 'bg-synapse-text/50' : 'bg-synapse-text'
            }`}
          >
            <Text className="text-synapse-bg font-sans font-semibold text-base">
              {isLoading ? 'Please wait...' : isSignUp ? 'Create Account' : password ? 'Sign In' : 'Send Magic Link'}
            </Text>
          </Pressable>

          {/* Toggle */}
          <Pressable
            onPress={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
            className="items-center py-2"
          >
            <Text className="font-sans text-sm text-synapse-text-muted">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Text className="font-semibold text-synapse-text">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
