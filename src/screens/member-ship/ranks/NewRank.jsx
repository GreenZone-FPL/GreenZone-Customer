import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-paper';
import { colors } from '../../../constants';
import { Column } from '../../../components';


const {width} = Dimensions.get('window');
export const NewRank = () => {
  return (
    <Column style={styles.newRank}>
      <Text style={styles.text}>Tính năng đang phát triển</Text>
      <Icon source={'emoticon-sad'} size={44} color={colors.primary} />
    </Column>
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
