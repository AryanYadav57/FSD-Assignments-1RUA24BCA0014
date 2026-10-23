import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { CardForm } from './src/components/CardForm';
import { CreditCardPreview } from './src/components/CreditCardPreview';
import { Toast } from './src/components/Toast';
import { useCardForm } from './src/hooks/useCardForm';

export default function App() {
  const { width } = useWindowDimensions();
  const isCompact = width < 820;
  const cardForm = useCardForm();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={[styles.page, isCompact && styles.pageCompact]}>
        <View style={[styles.previewPane, isCompact && styles.previewPaneCompact]}>
          <CreditCardPreview values={cardForm.values} isCompact={isCompact} />
        </View>

        <View style={[styles.formPane, isCompact && styles.formPaneCompact]}>
          {!isCompact && (
            <LinearGradient
              colors={['rgba(35, 6, 47, 0.08)', 'rgba(247, 245, 248, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.partitionGlow}
            />
          )}
          <CardForm
            errors={cardForm.errors}
            values={cardForm.values}
            onChange={cardForm.updateField}
            onSubmit={cardForm.handleSubmit}
          />
        </View>
      </ScrollView>
      <Toast visible={cardForm.showToast} message="Card details confirmed!" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f1f4',
  },
  page: {
    flexGrow: 1,
    minHeight: 720,
    flexDirection: 'row',
    backgroundColor: '#f8f6fa',
  },
  pageCompact: {
    minHeight: 820,
    flexDirection: 'column',
  },
  previewPane: {
    width: '34%',
    minWidth: 340,
    zIndex: 2,
  },
  previewPaneCompact: {
    width: '100%',
    minWidth: 0,
    height: 450,
  },
  formPane: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f6fa',
    paddingLeft: 154,
    paddingRight: 56,
    paddingVertical: 48,
    position: 'relative',
    zIndex: 1,
  },
  formPaneCompact: {
    paddingLeft: 28,
    paddingRight: 28,
    paddingTop: 36,
  },
  partitionGlow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 220,
  },
});
