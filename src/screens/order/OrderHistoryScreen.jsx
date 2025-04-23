import { useNavigation } from '@react-navigation/native';
import moment from 'moment/moment';
import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Column, CustomTabView, DeliveryMethodText, EmptyView, LightStatusBar, NormalHeader, NormalLoading, NormalText, Row, StatusText } from '../../components';
import { colors, GLOBAL_KEYS, OrderStatus } from '../../constants';
import { useOrderHistoryContainer } from '../../containers';
import { useAppContext } from '../../context/appContext';
import { BottomGraph, MainGraph } from '../../layouts/graphs';
import { DialogPaymentMethod, onlineMethods } from '../checkout/checkout-components';
import { CancelDialog } from './order-detail-components';

const orderStatuses = ['', 'completed', 'cancelled'];
const titles = ['Đang thực hiện', 'Đã hoàn tất', 'Đã huỷ'];

const OrderHistoryScreen = () => {
  const { cartState } = useAppContext();
  const navigation = useNavigation()
  const {
    tabIndex,
    setTabIndex,
    selectedOrder,
    setSelectedOrder,
    orders,
    loading,
    paymentMethod,
    dialogPaymentMethodVisible,
    setDialogPaymentMethodVisible,
    cancelDialogVisible,
    setCancelDialogVisible,
    handleSelectMethod
  } = useOrderHistoryContainer()
  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Lịch sử đơn hàng"
        onLeftPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.reset({ index: 0, routes: [{ name: BottomGraph.graphName}] });
          }

        }}
      />

      <CustomTabView
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        tabBarConfig={{
          titles: titles,
          titleActiveColor: colors.primary,
          titleInActiveColor: colors.gray700,
        }}
      >
        {orderStatuses.map((status, index) => (
          <View key={index} style={{ flex: 1 }}>
            <OrderListView

              orders={orders[status] || []}
              loading={loading}
              setSelectedOrder={setSelectedOrder}
              onItemPress={(order) =>
                navigation.navigate('OrderDetailScreen', { orderId: order._id })
              }
              onPay={() =>
                setDialogPaymentMethodVisible(true)
              }
              onCancel={() =>
                setCancelDialogVisible(true)
              }
            />
          </View>
        ))}
      </CustomTabView>

      {
        cancelDialogVisible &&
        <CancelDialog
          visible={cancelDialogVisible}
          onHide={() => setCancelDialogVisible(false)}
          orderId={selectedOrder?._id}
          callBack={() => { }}
        />
      }


      {
        dialogPaymentMethodVisible &&
        <DialogPaymentMethod
          methods={onlineMethods}
          visible={dialogPaymentMethodVisible}
          onHide={() => setDialogPaymentMethodVisible(false)}
          cartState={cartState}
          selectedMethod={paymentMethod}
          handleSelectMethod={handleSelectMethod}
        />
      }

    </View>
  );
};

const OrderListView = ({ orders, loading, onItemPress, onPay, onCancel, setSelectedOrder }) => (
  <View style={styles.scene}>
    {loading ? (
      <NormalLoading visible={loading} />
    ) : orders.length > 0 ? (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={orders}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <OrderItem order={item} onPress={onItemPress} onPay={onPay} onCancel={onCancel} setSelectedOrder={setSelectedOrder} />
        )}
        contentContainerStyle={{ gap: 5 }}
      />
    ) : (
      <EmptyView message='Danh sách này trống' />
    )}
  </View>
);

const OrderItem = ({ order, onPress, onPay, onCancel, setSelectedOrder }) => {

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
  if (!order) return null

  return (
    <Pressable
      onPress={() => onPress(order)}
    >
      <Column style={styles.itemContainer} >

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

            <DeliveryMethodText deliveryMethod={order.deliveryMethod} style={{fontWeight: '400'}}/>

          </Column>
          <Column style={styles.orderColumnEnd}>
            {
              ![OrderStatus.CANCELLED.value, OrderStatus.COMPLETED.value].includes(order?.status) &&
              <StatusText status={order?.status} />
            }

            <Text style={styles.orderTotal}>
              {order?.totalPrice
                ? `${order.totalPrice.toLocaleString('vi-VN')}₫`
                : '0₫'}
            </Text>
          </Column>

        </Row>


        {
          order?.status === OrderStatus.AWAITING_PAYMENT.value &&
          <Row style={styles.buttonRow}>

            <Pressable
              onPress={() => {

                setSelectedOrder(order)
                onCancel()
              }}
              style={styles.cancelBtn}>
              <NormalText text='Hủy đơn hàng' style={styles.cancelText} />
            </Pressable>
            <Pressable
              onPress={() => {

                setSelectedOrder(order)
                onPay()
              }}
              style={styles.payBtn}>
              <NormalText text='Thanh toán' style={styles.payText} />
            </Pressable>
          </Row>
        }
      </Column>
    </Pressable>
  );
};

const ItemOrderType = ({ deliveryMethod }) => {
  const imageMap = {
    pickup: require('../../assets/serving-method/takeaway.png'),
    delivery: require('../../assets/serving-method/delivery.png'),
  };

  return (
    <Column style={{ alignItems: 'center' }}>
      <Image
        style={styles.orderTypeIcon}
        source={imageMap[deliveryMethod] || imageMap['pickup']}
      />
    </Column>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scene: {
    width: '100%',
    flex: 1,
    paddingTop: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.fbBg
  },
  itemContainer: {
    backgroundColor: colors.white,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
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

export default OrderHistoryScreen;