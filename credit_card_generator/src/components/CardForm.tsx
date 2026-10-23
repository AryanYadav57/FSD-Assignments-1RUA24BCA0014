import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { CardErrors, CardValues } from '../hooks/useCardForm';

type CardFormProps = {
  values: CardValues;
  errors: CardErrors;
  onChange: (field: keyof CardValues, value: string) => void;
  onSubmit: () => void;
};

export function CardForm({ values, errors, onChange, onSubmit }: CardFormProps) {
  const [focusedField, setFocusedField] = useState<keyof CardValues | null>(null);

  return (
    <View style={styles.form}>
      <Field
        field="name"
        label="CARDHOLDER NAME"
        placeholder="e.g. Jane Appleseed"
        value={values.name}
        error={errors.name}
        focusedField={focusedField}
        onBlur={() => setFocusedField(null)}
        onChangeText={(value) => onChange('name', value)}
        onFocus={() => setFocusedField('name')}
      />

      <Field
        field="cardNumber"
        label="CARD NUMBER"
        placeholder="e.g. 1234 5678 9123 0000"
        value={values.cardNumber}
        error={errors.cardNumber}
        focusedField={focusedField}
        keyboardType="number-pad"
        onBlur={() => setFocusedField(null)}
        onChangeText={(value) => onChange('cardNumber', value)}
        onFocus={() => setFocusedField('cardNumber')}
      />

      <View style={styles.inlineRow}>
        <View style={styles.expiryGroup}>
          <Text style={styles.label}>EXP. DATE (MM/YY)</Text>
          <View style={styles.expiryInputs}>
            <TextInput
              value={values.expMonth}
              onBlur={() => setFocusedField(null)}
              onChangeText={(value) => onChange('expMonth', value)}
              onFocus={() => setFocusedField('expMonth')}
              placeholder="MM"
              placeholderTextColor="#a9a8ae"
              keyboardType="number-pad"
              maxLength={2}
              style={[
                styles.input,
                styles.shortInput,
                focusedField === 'expMonth' && styles.inputFocused,
                errors.expMonth && styles.inputError,
              ]}
            />
            <TextInput
              value={values.expYear}
              onBlur={() => setFocusedField(null)}
              onChangeText={(value) => onChange('expYear', value)}
              onFocus={() => setFocusedField('expYear')}
              placeholder="YY"
              placeholderTextColor="#a9a8ae"
              keyboardType="number-pad"
              maxLength={2}
              style={[
                styles.input,
                styles.shortInput,
                focusedField === 'expYear' && styles.inputFocused,
                errors.expYear && styles.inputError,
              ]}
            />
          </View>
          <Text style={styles.errorText}>{errors.expMonth || errors.expYear || ' '}</Text>
        </View>

        <View style={styles.cvcGroup}>
          <Field
            field="cvc"
            label="CVC"
            placeholder="e.g. 123"
            value={values.cvc}
            error={errors.cvc}
            focusedField={focusedField}
            keyboardType="number-pad"
            maxLength={3}
            onBlur={() => setFocusedField(null)}
            onChangeText={(value) => onChange('cvc', value)}
            onFocus={() => setFocusedField('cvc')}
          />
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onSubmit}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <LinearGradient
          colors={['#341044', '#23062f', '#14001e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

type FieldProps = {
  field: keyof CardValues;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  focusedField: keyof CardValues | null;
  keyboardType?: 'default' | 'number-pad';
  maxLength?: number;
  onBlur: () => void;
  onChangeText: (value: string) => void;
  onFocus: () => void;
};

function Field({
  field,
  label,
  placeholder,
  value,
  error,
  focusedField,
  keyboardType = 'default',
  maxLength,
  onBlur,
  onChangeText,
  onFocus,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onBlur={onBlur}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor="#a9a8ae"
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={[styles.input, focusedField === field && styles.inputFocused, error && styles.inputError]}
      />
      <Text style={styles.errorText}>{error || ' '}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    maxWidth: 385,
  },
  field: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 8,
    color: '#1f1128',
    fontSize: 11,
    fontWeight: '800',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d8d2dd',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    color: '#211126',
    fontSize: 15,
    fontWeight: '600',
    shadowColor: '#32123d',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  inputFocused: {
    borderColor: '#6f35d1',
    shadowOpacity: 0.12,
  },
  inputError: {
    borderColor: '#dc4b67',
  },
  errorText: {
    minHeight: 20,
    marginTop: 5,
    color: '#dc4b67',
    fontSize: 12,
    fontWeight: '600',
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 16,
  },
  expiryGroup: {
    flex: 1,
  },
  expiryInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  shortInput: {
    flex: 1,
    minWidth: 64,
  },
  cvcGroup: {
    flex: 1,
  },
  button: {
    height: 52,
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#22062e',
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
});
