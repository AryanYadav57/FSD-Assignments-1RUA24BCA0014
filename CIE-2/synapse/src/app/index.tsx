import { Redirect } from 'expo-router';

// Root index — always redirect to the app (auth gate in _layout handles the rest)
export default function Index() {
  return <Redirect href="/(app)" />;
}
