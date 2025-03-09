import moment from 'moment/moment';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getOrderHistoryByStatus} from '../../axios';
import {
  Column,
  CustomTabView,
  LightStatusBar,
  NormalHeader,
  NormalLoading,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {OrderGraph} from '../../layouts/graphs';

const width = Dimensions.get('window').width;

const OrderHistoryScreen = ({navigation}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrderHistoryByStatus();
        setOrders(data);
        console.log('Danh sách đơn hàng:', JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tabIndex]);

  const handleRepeatOrder = () => {
    // navigation.navigate(OrderGraph.OrderDetailScreen);
    navigation.navigate('OrderDetailScreen2');
  };

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Lịch sử đơn hàng"
        onLeftPress={() => navigation.goBack()}
      />
      <CustomTabView
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        tabBarConfig={{
          titles: [
            'Chờ Thanh Toán',
            'Chờ xử lý',
            'Đang thực hiện',
            'Đã hoàn tất',
            'Đã huỷ',
          ],
          titleActiveColor: colors.primary,
          titleInActiveColor: colors.gray700,
        }}>
        {[
          'awaitingPayment',
          'pendingConfirmation',
          'processing',
          'completed',
          'cancelled',
        ].map((status, index) => (
          <OrderListView
            key={index}
            onItemPress={order =>
              navigation.navigate(OrderGraph.OrderDetailScreen, {
                orderId: order._id,
                })
            }
            status={status}
            orders={orders}
            loading={loading}
            handleRepeatOrder={handleRepeatOrder}
          />
        ))}
      </CustomTabView>
    </View>
  );
};

const OrderListView = ({
  status,
  orders,
  loading,
  onItemPress,
  handleRepeatOrder,
}) => {
  const STATUS_GROUPS = {
    awaitingPayment: ['awaitingPayment'],
    pendingConfirmation: ['pendingConfirmation'],
    processing: ['processing', 'readyForPickup', 'shippingOrder'],
    completed: ['completed'],
    cancelled: ['cancelled', 'failedDelivery'],
  };

  const filteredOrders =
    orders
      ?.filter(order => STATUS_GROUPS[status]?.includes(order.status))
      .sort(
        (a, b) =>
          new Date(b.fulfillmentDateTime) - new Date(a.fulfillmentDateTime),
      ) || [];

  return (
    <View style={styles.scene}>
      {loading ? (
        <NormalLoading visible={true} message="Đang tải lịch sử đơn hàng..." />
      ) : filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.orderId || item._id}
          renderItem={({item}) => (
            <OrderItem
              order={item}
              onPress={onItemPress}
              handleRepeatOrder={handleRepeatOrder}
            />
          )}
        />
      ) : (
        <EmptyView message={getEmptyMessage(status)} />
      )}
    </View>
  );
};

const getEmptyMessage = status => {
  switch (status) {
    case 'pendingConfirmation':
      return 'Chưa có đơn hàng chờ xử lý';
    case 'processing':
      return 'Chưa có đơn hàng đang thực hiện';
    case 'completed':
      return 'Chưa có đơn hàng hoàn thành';
    case 'cancelled':
      return 'Chưa có đơn hàng đã hủy';
  }
};

const OrderItem = ({order, onPress, handleRepeatOrder}) => {
  const getOrderItemsText = () => {
    const items = order?.orderItems || [];
    if (items.length > 2) {
      return `${items[0].product.name} - ${items[1].product.name} và ${
        items.length - 2
      } sản phẩm khác`;
    }
    return (
      items.map(item => item.product.name).join(' - ') || 'Chưa có sản phẩm'
    );
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(order)} // Truyền order vào onPress
      style={styles.orderItem}>
      <ItemOrderType deliveryMethod={order?.deliveryMethod} />
      <Column style={styles.orderColumn}>
        <Text numberOfLines={2} style={styles.orderName}>
          {getOrderItemsText()}
        </Text>

        <Text style={styles.orderTime}>
          {order?.fulfillmentDateTime
            ? moment(order.fulfillmentDateTime)
                .utcOffset(7)
                .format('HH:mm - DD/MM/YYYY')
            : 'Chưa có thời gian'}
        </Text>
      </Column>
      <Column style={styles.orderColumnEnd}>
        <Text style={styles.orderTotal}>
          {order?.totalPrice
            ? `${order.totalPrice.toLocaleString('vi-VN')}₫`
            : '0₫'}
        </Text>
        {order.status !== 'cancelled' &&
          order.status !== 'pendingConfirmation' && (
            <TouchableOpacity
              onPress={handleRepeatOrder}
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Đặt lại</Text>
            </TouchableOpacity>
          )}
      </Column>
    </TouchableOpacity>
  );
};

const ItemOrderType = ({deliveryMethod}) => {
  const imageMap = {
    pickup: require('../../assets/serving-method/takeaway.png'),
    delivery: require('../../assets/serving-method/delivery.png'),
  };

  return (
    <Image
      style={styles.orderTypeIcon}
      source={imageMap[deliveryMethod] || imageMap['pickup']} // Mặc định là takeaway nếu không xác định
    />
  );
};

const ItemOrderText = ({deliveryMethod}) => {
  const textMap = {
    pickup: 'Mang đi',
    delivery: 'Giao tận nơi',
  };

  return (
    <Text style={styles.orderTime}>{textMap[deliveryMethod] || 'Mang đi'}</Text>
  );
};

const EmptyView = ({message}) => (
  <View style={styles.emptyContainer}>
    <Image
      style={styles.emptyImage}
      resizeMode="cover"
      source={require('../../assets/images/logo.png')}
    />
    <Text>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  scene: {
    width: '100%',
    paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  emptyContainer: {justifyContent: 'center', alignItems: 'center'},
  emptyImage: {width: width / 2, height: width / 2},
  orderItem: {
    margin: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomColor: colors.gray200,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  orderColumn: {
    width: '70%',
  },
  orderColumnEnd: {justifyContent: 'center', alignItems: 'center'},
  orderName: {fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500'},
  orderTime: {fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL, color: colors.gray850},
  orderTotal: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    color: colors.pink500,
  },
  buttonContainer: {alignItems: 'center', justifyContent: 'center'},
  buttonText: {
    padding: 6,
    backgroundColor: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    color: colors.white,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  orderTypeIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    resizeMode: 'cover',
  },
});

export default OrderHistoryScreen;
