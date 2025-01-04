import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RadioButton from './RadioButton';
import GLOBAL_KEYS from '../../constants/global_keys';
import colors from '../../constants/color';

const RadioGroup = ({
  items,
  selectedValue,
  onValueChange,
  title,
  required = false, // Bắt buộc chọn hay không
  note
}) => {
  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      {title && (
        <Text style={styles.title}>
          {title}
          {required && <Text style={styles.redText}>*</Text>}
          {note && <Text style={styles.note}> ({note})</Text>}
        </Text>
      )}

      {/* Danh sách Radio Buttons */}
      {items.map((item) => {
        const { value, label, additionalInfo } = item;

        return (
          <RadioButton
            key={value}
            label={label}
            selected={selectedValue === value}
            onPress={() => onValueChange(value)}
            additionalInfo={additionalInfo}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    marginBottom: GLOBAL_KEYS.PADDING_SMALL,
  },
  redText: {
    color: colors.red800,
  },
  note: {
    fontSize: 14,
    fontWeight: '400',
  },
});

export default RadioGroup;
