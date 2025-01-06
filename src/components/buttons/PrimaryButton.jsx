import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';

const PrimaryButton = props => {
  const {title, onPress, style} = props;
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
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

export default PrimaryButton
