import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Spawn.gg', headerTitleAlign: 'center' }} />
      <Stack.Screen name="player" options={{ title: 'Playing Game', presentation: 'fullScreenModal' }} />
      <Stack.Screen name="gallery" options={{ title: 'My Games' }} />
    </Stack>
  );
}
