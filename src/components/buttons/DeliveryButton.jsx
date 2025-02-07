import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import { Row } from '../containers/Row';
import { NormalText } from '../texts/NormalText';
import { Column } from '../containers/Column';

const { width } = Dimensions.get('window');
export const DeliveryButton = ({ title, address, onPress, style, onPressCart }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>

      <Column style={{ flex: 1 }}>
        <Row >
          <Image
            source={require('../../assets/images/ic_delivery.png')}
            style={styles.icon}
          />
          <Text style={styles.title}>{title}</Text>
        </Row>
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.address}>{address}</Text>

      </Column>

      <TouchableOpacity style={styles.btnCart} onPress={onPressCart}>
        <Text style={styles.quantity}>1</Text>
        <NormalText text='Giỏ hàng' style={{ color: colors.white }} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.green100,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    gap: 16
  },

  icon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
  },

  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    fontWeight: 'bold',
  },
  address: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  btnCart: {
    flexDirection: 'row',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.primary,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    alignItems: 'center',
    justifyContent: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
    maxHeight: 50,
    alignSelf: 'center'
  },
  quantity: {
    borderRadius: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    color: colors.primary,
    fontWeight: '700',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
  },
  textOrder: {
    fontWeight: '700',
    color: colors.white,
  }

});
