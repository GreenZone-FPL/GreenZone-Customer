import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {GLOBAL_KEYS, colors} from '../../constants';
import PropTypes from 'prop-types';

export const PrimaryButton = props => {
  const {
    title = 'Default title',
    onPress = () => {},
    style,
    titleStyle,
    disabled = false
  } = props;
  return (
    <Pressable style={[styles.button, style]} onPress={onPress} disabled={disabled}>
      <Text style={[styles.text, titleStyle]}>{title}</Text>
    </Pressable>
  );
};

PrimaryButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.object,
  titleStyle: PropTypes.object,
  disabled: PropTypes.bool,
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
  },
});
