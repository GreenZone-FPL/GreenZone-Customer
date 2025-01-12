import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-paper';
import {colors} from '../../constants';

const {width} = Dimensions.get('window');
export const NewRank = () => {
  return (
    <View style={styles.newRank}>
      <Text style={styles.text}>Bạn chưa có ưu đãi</Text>
      <Icon source={'emoticon-sad'} size={44} color={colors.primary} />
    </View>
  );
};



const styles = StyleSheet.create({
  newRank: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
  },
  text: {
    fontSize: 18,
    color: colors.gray700,
  },
});
