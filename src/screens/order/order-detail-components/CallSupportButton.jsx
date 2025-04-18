// CallSupportButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, View } from 'react-native';
import {Icon} from 'react-native-paper';
import {colors, GLOBAL_KEYS} from '../../../constants';

export const CallSupportButton = ({ phoneNumber = '', label = 'Gọi hỗ trợ' }) => {
  const makePhoneCall = () => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(err => {
      console.error('Không thể thực hiện cuộc gọi:', err);
    });
  };

  return (
    <View style={{backgroundColor: colors.white, paddingHorizontal: 16, marginVertical: 4 , paddingVertical: 8}}>
        <TouchableOpacity style={styles.button} onPress={makePhoneCall}>
        <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: colors.green100,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center'

  },
  text: {
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
  },
});

export default CallSupportButton;
