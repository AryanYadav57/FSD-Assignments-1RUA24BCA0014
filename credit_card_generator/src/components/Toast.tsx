import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

type ToastProps = {
  visible: boolean;
  message: string;
};

export function Toast({ visible, message }: ToastProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.toast}>
      <LinearGradient
        colors={['#11a96d', '#0b7c57']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.toastGradient}
      >
        <Text style={styles.toastText}>{message}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 28,
    right: 24,
    maxWidth: 280,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  toastGradient: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});
