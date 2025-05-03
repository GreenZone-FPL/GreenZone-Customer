import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Column} from '../../../components';
import {GLOBAL_KEYS} from '../../../constants';

export const ItemOrderType: React.FC<{deliveryMethod: string}> = ({
  deliveryMethod,
}) => {
  return (
    <Column style={{alignItems: 'center'}}>
      <Image
        style={styles.orderTypeIcon}
        source={imageMap[deliveryMethod] || imageMap['pickup']}
      />
    </Column>
  );
};

const imageMap = {
  pickup: require('../../../assets/serving-method/takeaway.png'),
  delivery: require('../../../assets/serving-method/delivery.png'),
};
const styles = StyleSheet.create({
  orderTypeIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    resizeMode: 'cover',
  },
});
