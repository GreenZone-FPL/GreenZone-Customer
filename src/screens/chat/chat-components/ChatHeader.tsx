import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Icon } from 'react-native-paper';

import { NormalText, Row, TitleText } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { useAppContext } from '../../../context/appContext';
import { CartManager, TextFormatter } from '../../../utils';
import { ShoppingGraph } from '../../../layouts/graphs';

export const ChatHeader: React.FC = () => {
  const navigation = useNavigation<any>();
  const { cartState } = useAppContext()
  return (
    <Row style={styles.header}>
      <Pressable onPress={() => navigation.goBack()}>
        <Icon source="close" size={24} color={colors.primary} />
      </Pressable>

      <Row>
        <TitleText text="GreenZone Assistant" />
        <Icon source="check-decagram" size={18} color={colors.primary} />
      </Row>

      <View style={styles.placeholderIcon} />
      {cartState?.orderItems?.length > 0 && (
        <Pressable style={styles.btnCart} onPress={() => navigation.navigate(ShoppingGraph.CheckoutScreen)}>
          <Text style={styles.quantity}>{cartState.orderItems.length}</Text>
          <NormalText
            text={TextFormatter.formatCurrency(
              CartManager.getCartTotal(cartState),
            )}
            style={{ color: colors.white, fontWeight: '500' }}
          />

        </Pressable>
      )}
    </Row>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
    color: colors.black,
  },
  placeholderIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
  },
  btnCart: {
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: colors.primary,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
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
});
