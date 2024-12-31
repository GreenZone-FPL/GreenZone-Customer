import { TextInput, View, Text, StyleSheet } from 'react-native';
import React from 'react';
import colors from '../../constants/color';

const CustomInput = ({ placeholder, value, setValue, message }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.textInput, { fontWeight: value ? 'bold' : '300' }]}
        placeholder={placeholder}
        placeholderTextColor={colors.gray400} // Đảm bảo màu placeholder hợp lệ
        value={value}
        onChangeText={setValue}
      />
      {message ? (
        <Text style={styles.errorMessage}>{message}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    color: colors.black,
  },
  errorMessage: {
    marginTop: 4,
    color: colors.invalid,
    fontSize: 12,
  },
});

export default CustomInput;
