import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SelectField = ({ label, selectedValue, onValueChange, items }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.pickerWrapper,
        isFocused && styles.pickerWrapperFocused,
      ]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={Platform.OS === 'web' ? styles.webPicker : styles.nativePicker}
          dropdownIconColor="#78716c"
        >
          {items.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
              color="#1c1917"
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#44403c',
    marginBottom: 6,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: '#e7e5e4',
    borderRadius: 10,
    backgroundColor: '#fafaf9',
    overflow: 'hidden',
  },
  pickerWrapperFocused: {
    borderColor: '#d97706',
    backgroundColor: '#fffbeb',
  },
  nativePicker: {
    width: '100%',
    color: '#1c1917',
  },
  webPicker: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1c1917',
    backgroundColor: 'transparent',
    borderWidth: 0,
    outlineStyle: 'none',
    cursor: 'pointer',
  },
});

export default SelectField;
