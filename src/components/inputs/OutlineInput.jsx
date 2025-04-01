import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {colors, GLOBAL_KEYS} from '../../constants';
import PropTypes from 'prop-types';

export const OutlineInput = ({
  label = '',
  placeholder = '',
  value,
  setValue,
  invalidMessage = 'Trường này không được để trống',
  rightIcon,
  leftIcon,
  onRightPress,
  rightIconColor = colors.green700,
  leftIconColor = colors.green700,
  style,
  editable = true,
  keyboardType = 'default',
  enableLeftIcon = false,
  enableRightIcon = false,
  secureTextEntry = false,
  isPasswordVisible,
  setIsPasswordVisible,
  onSubmitEditing,
  returnKeyType = 'done',
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={setValue}
        mode="outlined"
        placeholder={placeholder}
        placeholderTextColor={colors.gray400}
        error={false}
        outlineColor={colors.gray300}
        activeOutlineColor={colors.green700}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        style={styles.input}
        keyboardType={keyboardType}
        editable={editable}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        left={
          enableLeftIcon && (
            <TextInput.Icon color={leftIconColor} icon={leftIcon} />
          )
        }
        right={
          enableRightIcon ? (
            <TextInput.Icon
              color={rightIconColor}
              icon={rightIcon}
              onPress={onRightPress}
            />
          ) : secureTextEntry ? (
            <TextInput.Icon
              color={colors.gray400}
              icon={isPasswordVisible ? 'eye-off' : 'eye'}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />
          ) : null
        }
        theme={{
          colors: {text: colors.black},
          fonts: {regular: {fontSize: 14}}, // Giảm font của placeholder
        }}
      />
      {invalidMessage && <Text style={styles.errorText}>{invalidMessage}</Text>}
    </View>
  );
};

OutlineInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  invalidMessage: PropTypes.string,
  rightIcon: PropTypes.string,
  leftIcon: PropTypes.string,
  onRightPress: PropTypes.func,
  rightIconColor: PropTypes.string,
  leftIconColor: PropTypes.string,
  style: PropTypes.object,
  editable: PropTypes.bool,
  keyboardType: PropTypes.string,
  enableLeftIcon: PropTypes.bool,
  enableRightIcon: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  isPasswordVisible: PropTypes.bool,
  setIsPasswordVisible: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  returnKeyType: PropTypes.string,
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    borderRadius: 16,
  },
  errorText: {
    color: colors.invalid,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    marginTop: 4,
    marginLeft: 10,
  },
});
