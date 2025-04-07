import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { Title } from './Title';

export const MerchantInfo = ({ store }) => {
  return (
    <View style={styles.areaContainer}>
      <Title title="Cửa hàng" icon="store-outline" />
      <Title title={store.name} titleStyle={{ color: colors.black }} />
      <Text numberOfLines={2} style={styles.normalText}>
        {[
          store.specificAddress,
          store.ward,
          store.district,
          store.province,
        ].join(' ')}
      </Text>
    </View>
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
