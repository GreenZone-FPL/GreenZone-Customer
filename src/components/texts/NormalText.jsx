import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GLOBAL_KEYS} from '../../constants/globalKeys';
import {colors} from '../../constants/color';

const NormalText = ({text = 'Normal text', style}) => {
  return (
    <View>
      <Text style={[styles.text, style]}>{text}</Text>
    </View>
  );
};

export default NormalText;

const styles = StyleSheet.create({
  text: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
});
