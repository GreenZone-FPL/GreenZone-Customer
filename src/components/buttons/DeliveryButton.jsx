import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {GLOBAL_KEYS, colors} from '../../constants';
import {Column} from '../containers/Column';
import {Row} from '../containers/Row';
import {NormalText} from '../texts/NormalText';
import {Icon} from 'react-native-paper';
import {CartManager, TextFormatter} from '../../utils';

export const DeliveryButton = ({
  title,
  address,
  onPress,
  style,
  onPressCart,
  cartState,
  deliveryMethod,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Column style={{flex: 1}}>
        <Row>
          {deliveryMethod === 'Mang đi' ? (
            <Image
              source={require('../../assets/images/ic_take_away.png')}
              style={{width: 28, height: 28}}
            />
          ) : (
            <Image
              source={require('../../assets/images/ic_delivery.png')}
              style={styles.icon}
            />
          )}
          <Text style={styles.title}>{title}</Text>
        </Row>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.address}>
          {address}
        </Text>
      </Column>

      {cartState?.orderItems?.length > 0 && (
        <TouchableOpacity style={styles.btnCart} onPress={onPressCart}>
          {/* <Icon source="food-outline" color={colors.white} size={20} /> */}
          <Text style={styles.quantity}>{cartState.orderItems.length}</Text>
          <NormalText
            text={TextFormatter.formatCurrency(
              CartManager.getCartTotal(cartState),
            )}
            style={{color: colors.white, fontWeight: '500'}}
          />

          
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.green100,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',

  },

  icon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
  },

  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '700',
  },
  address: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    // marginVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  btnCart: {
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: colors.primary,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    alignItems: 'center',
    justifyContent: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
    maxHeight: 50,
    alignSelf: 'center',
  },
  quantity: {
    borderRadius: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 5,
    color: colors.primary,
    fontWeight: '700',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  textOrder: {
    fontWeight: '700',
    color: colors.white,
  },
});
