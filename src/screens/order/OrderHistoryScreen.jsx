import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getOrdersByStatus } from '../../axios';
import { Column, CustomTabView, LightStatusBar, NormalHeader, NormalLoading, NormalText, PrimaryButton, Row, StatusText } from '../../components';
import { colors, GLOBAL_KEYS, OrderStatus } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { MainGraph } from '../../layouts/graphs';

const width = Dimensions.get('window').width;

const orderStatuses = ['', 'completed', 'cancelled'];
const titles = ['Đang thực hiện', 'Đã hoàn tất', 'Đã huỷ'];

const OrderHistoryScreen = ({ navigation }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orders, setOrders] = useState({}); // Lưu trữ dữ liệu theo từng tab
  const [loading, setLoading] = useState(false);

  const { updateOrderMessage } = useAppContext();

  const fetchOrders = async (status) => {
    try {
      setLoading(true);
      const data = await getOrdersByStatus(status);
      setOrders(prev => ({ ...prev, [status]: data }));
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    orderStatuses.forEach(status => fetchOrders(status));
  }, [updateOrderMessage]);

  useEffect(() => {
    fetchOrders(orderStatuses[tabIndex]);
  }, [tabIndex]);

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Lịch sử đơn hàng"
        onLeftPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.reset({ index: 0, routes: [{ name: MainGraph.graphName }] });
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
              status={status}
              orders={orders[status] || []}
              loading={loading}
              onItemPress={(order) =>
                navigation.navigate('OrderDetailScreen', { orderId: order._id })
              }
            />
          </View>
        ))}
      </CustomTabView>
    </View>
  );
};

const OrderListView = ({ status, orders, loading, onItemPress }) => (
  <View style={styles.scene}>
    {loading ? (
      <NormalLoading visible={loading} />
    ) : orders.length > 0 ? (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={orders}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <OrderItem order={item} onPress={onItemPress} />
        )}
        contentContainerStyle={{ gap: 5 }}
      />
    ) : (
      <EmptyView />
    )}
  </View>
);

const OrderItem = ({ order, onPress, handleRepeatOrder }) => {
  // console.log('order', JSON.stringify(order, null, 2))
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
    <TouchableOpacity
      onPress={() => onPress(order)} // Truyền order vào onPress
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

            <NormalText
              style={{ color: order.deliveryMethod === 'pickup' ? colors.orange700 : colors.teal700 }}
              text={order.deliveryMethod === 'pickup' ? 'Mang đi' : 'Giao tận nơi'} />
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
            <Pressable style={styles.changeMethodBtn}>
              <NormalText text='Đổi phương thức thanh toán' style={styles.changeMethodText} />

            </Pressable>

            <Pressable style={styles.payBtn}>
              <NormalText text='Thanh toán' style={styles.payText} />
            </Pressable>
          </Row>
        }

      </Column>


    </TouchableOpacity>
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


const EmptyView = () => (
  <View style={styles.emptyContainer}>
    <Image
      style={styles.emptyImage}
      resizeMode="cover"
      source={require('../../assets/images/logo.png')}
    />

  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scene: {
    width: '100%',
    flex: 1,
    paddingTop: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.fbBg
  },
  emptyContainer: { justifyContent: 'center', alignItems: 'center' },
  emptyImage: { width: width / 2, height: width / 2 },

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
  orderName: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500' },
  orderTime: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.gray700 },
  orderTotal: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '400',
    color: colors.black,
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
  changeMethodBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray400,
    backgroundColor: colors.white,
    marginRight: 5,
  },
  changeMethodText: {
    color: colors.black,
    textAlign: 'center',
    fontWeight: '400',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
  },
  payBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  payText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default OrderHistoryScreen;