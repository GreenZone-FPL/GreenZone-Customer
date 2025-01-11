
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GLOBAL_KEYS, colors } from '../../constants'

export const NormalText = ({ text = 'Normal text', style }) => {
  return (
    <View>
      <Text style={[styles.text, style]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
});

