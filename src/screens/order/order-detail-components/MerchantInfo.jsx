import React from 'react';
import { StyleSheet } from 'react-native';
import { Column, NormalText } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { Title } from './Title';

export const MerchantInfo = ({ store }) => {
  return (
    <Column style={styles.areaContainer}>
      <Title title="Cửa hàng" />
      <NormalText text={store.name} style={{ fontWeight: '500' , color: colors.blue600}} />
      <NormalText text={store.address}/>
    </Column>
  );
};


const styles = StyleSheet.create({
  areaContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    marginBottom: 5,
    padding: 16
  },

  normalText: {
    lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    marginRight: 4,
  },
})
