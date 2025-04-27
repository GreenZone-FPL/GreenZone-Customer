import moment from 'moment';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import {
  Column,
  DeliveryMethodText,
  NormalText,
  Row,
  StatusText,
} from '../../../components';
import { colors, GLOBAL_KEYS, OrderStatus } from '../../../constants';
import { ItemOrderType } from './ItemOrderType';


export const OrderItem = ({
  order,
  onPress,
  onPay,
  onCancel,
  setSelectedOrder,
}) => {
  const getOrderItemsText = () => {
    const items = order?.orderItems || [];
    if (items.length > 2) {
      return `${items[0].product.name} - ${items[1].product.name} và ${items.length - 2
        } sản phẩm khác`;
    }
    return (
      items.map(item => item.product.name).join(' - ') || 'Chưa có sản phẩm'
    );
  };
  if (!order) return null;

  return (
    <Pressable onPress={() => onPress(order)}>
      <Column style={styles.itemContainer}>
        <Row style={styles.orderItem}>
          <ItemOrderType deliveryMethod={order?.deliveryMethod} />
          <Column style={styles.orderColumn}>
            <Text numberOfLines={2} style={styles.orderName}>
              {getOrderItemsText()}
            </Text>

            <Text style={styles.orderTime}>
              {order?.createdAt
                ? moment(order.createdAt)
                  .utcOffset(7)
                  .format('HH:mm - DD/MM/YYYY')
                : 'Chưa có thời gian'}
            </Text>

            <DeliveryMethodText
              deliveryMethod={order.deliveryMethod}
              style={{ fontWeight: '400' }}
            />
          </Column>
          <Column style={styles.orderColumnEnd}>
            {![
              OrderStatus.CANCELLED.value,
              OrderStatus.COMPLETED.value,
            ].includes(order?.status) && <StatusText status={order?.status} />}

            <Text style={styles.orderTotal}>
              {order?.totalPrice
                ? `${order.totalPrice.toLocaleString('vi-VN')}₫`
                : '0₫'}
            </Text>
          </Column>
        </Row>

        {order?.status === OrderStatus.AWAITING_PAYMENT.value && (
          <Row style={styles.buttonRow}>
            <Pressable
              onPress={() => {
                setSelectedOrder(order);
                onCancel();
              }}
              style={styles.cancelBtn}>
              <NormalText text="Hủy đơn hàng" style={styles.cancelText} />
            </Pressable>
            <Pressable
              onPress={() => {
                setSelectedOrder(order);
                onPay();
              }}
              style={styles.payBtn}>
              <NormalText text="Thanh toán" style={styles.payText} />
            </Pressable>
          </Row>
        )}
      </Column>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: colors.white,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    borderBottomColor: colors.fbBg,
    borderBottomWidth: 1
  },
  orderItem: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    alignItems: 'center',
    justifyContent: 'space-between',
   
  },
  orderColumn: {
    flex: 1
  },
  orderColumnEnd: { justifyContent: 'center' },
  orderName: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500', color: colors.black },
  orderTime: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.gray850 },
  orderTotal: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    color: colors.red800,
    textAlign: 'right'
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingVertical: 4,
  },
  buttonText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.white,
  },
  orderTypeIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    resizeMode: 'cover',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  payBtn: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignSelf: 'flex-end'
  },
  payText: {
    color: colors.white
  },
  cancelBtn: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 1,
  },
  cancelText: {
    color: colors.orange700
  }
});
