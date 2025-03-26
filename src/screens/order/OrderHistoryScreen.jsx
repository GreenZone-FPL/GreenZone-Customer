import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getOrdersByStatus } from '../../axios';
import { Column, CustomTabView, LightStatusBar, NormalHeader, NormalLoading, NormalText, StatusText } from '../../components';
import { colors, GLOBAL_KEYS, OrderStatus } from '../../constants';
import { useAppContext } from '../../context/appContext';


const width = Dimensions.get('window').width;

const orderStatuses = ['', 'completed', 'cancelled'];
const titles = ['Đang thực hiện', 'Đã hoàn tất', 'Đã huỷ'];

const OrderHistoryScreen = ({ navigation }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);


  const { updateOrderMessage } = useAppContext();
  console.log('updateOrderMessage = ', JSON.stringify(updateOrderMessage, null, 2))

  const fetchOrders = async (status = '') => {
    try {
      setLoading(true);
      const data = await getOrdersByStatus(status);
      setOrders(data);
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const status = tabIndex === 0 ? '' : orderStatuses[tabIndex]; // Tab 0 là "Đang thực hiện"
    fetchOrders(status);
  }, [tabIndex]);


  useEffect(() => {
    if (updateOrderMessage?.status) {
      const { status, oldStatus } = updateOrderMessage;
      console.log("⚡ Cập nhật trạng thái đơn hàng:", { oldStatus, status });

      // Nếu trạng thái mới là "Hoàn thành" hoặc "Đã hủy" thì không cần reload
      if (["completed", "cancelled"].includes(status)) return;

      const isOldStatusProcessing = !["completed", "cancelled"].includes(oldStatus);
      const isNewStatusProcessing = !["completed", "cancelled"].includes(status);

      // Nếu trạng thái cũ thuộc tab "Đang thực hiện" nhưng trạng thái mới KHÔNG còn trong đó => Reload
      if (isOldStatusProcessing && !isNewStatusProcessing) {
        fetchOrders(""); // Tab "Đang thực hiện" luôn là ""
      }
    }
  }, [updateOrderMessage.status]);




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
          titles: titles,
          titleActiveColor: colors.primary,
          titleInActiveColor: colors.gray700,
        }}

      >
        {orderStatuses.map((status, index) => (
          <View key={index} style={{ flex: 1 }}>
            <OrderListView
              status={status}
              orders={orders}
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


const OrderListView = ({
  status,
  orders,
  loading,
  onItemPress,
}) => {
  console.log('status', status)
  return (
    <View style={styles.scene}>
      {loading ? (
        <NormalLoading visible={loading} />
      ) : orders.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orders}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <OrderItem
              order={item}
              onPress={onItemPress}
            />
          )}
          contentContainerStyle={{ gap: 5 }}
        />
      ) : (
        <EmptyView />
      )}
    </View>
  );
};

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
      style={styles.orderItem}>
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
          style={{ color: order.deliveryMethod === 'pickup' ? colors.orange700 : colors.green500 }}
          text={order.deliveryMethod === 'pickup' ? 'Mang đi' : 'Giao tận nơi'} />
      </Column>
      <Column style={styles.orderColumnEnd}>
        <Text style={styles.orderTotal}>
          {order?.totalPrice
            ? `${order.totalPrice.toLocaleString('vi-VN')}₫`
            : '0₫'}
        </Text>

        {
          ![OrderStatus.CANCELLED.value, OrderStatus.COMPLETED.value].includes(order?.status) &&
          <StatusText status={order?.status} />
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
  orderItem: {
    backgroundColor: colors.white,
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
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
    // paddingHorizontal: 10
  },
  buttonText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.white,
    // fontWeight: '500',
  },
  orderTypeIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    resizeMode: 'cover',
  }
});

export default OrderHistoryScreen;