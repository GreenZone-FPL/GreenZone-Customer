import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { getOrdersByStatus } from '../../axios';
import { ButtonGroup, Column, LightStatusBar, NormalHeader, NormalLoading, NormalText } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { OrderStatus } from '../../constants';



const width = Dimensions.get('window').width;

const orderStatuses = ['', 'completed', 'cancelled'];
const titles = ['Đang thực hiện', 'Đã hoàn tất', 'Đã huỷ'];

const OrderHistoryScreen = ({ navigation }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const { updateOrderMessage } = useAppContext();

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
    if (updateOrderMessage.order?.data) {
      const { status: newStatus } = updateOrderMessage.order.data;
      const oldStatus = updateOrderMessage.oldStatus || 'pendingConfirmation';

      console.log("⚡ Cập nhật trạng thái đơn hàng:", { oldStatus, newStatus });

      if (orderStatuses.indexOf(newStatus) === tabIndex) {
        fetchOrders(newStatus);
      } else if (orderStatuses.indexOf(oldStatus) === tabIndex) {
        fetchOrders(oldStatus);
      }
    }
  }, [updateOrderMessage]);

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Lịch sử đơn hàng"
        onLeftPress={() => navigation.goBack()}
      />


      <ButtonGroup
        titles={titles}
        tabIndex={tabIndex}
        onTabChange={setTabIndex}
      />


      <PagerView
        style={{ flex: 1 }}
        initialPage={tabIndex}
        onPageSelected={(e) => setTabIndex(e.nativeEvent.position)}
      >
        {orderStatuses.map((status, index) => (
          <View key={index} style={{}}>
            <OrderListView
              orders={orders}
              loading={loading}
              onItemPress={(order) =>
                navigation.navigate('OrderDetailScreen', { orderId: order._id })
              }
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
};


const OrderListView = ({
  status,
  orders,
  loading,
  onItemPress,
}) => {

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
    case 'shippingOrder':
      return 'Chưa có đơn hàng đang được giao';
    case 'completed':
      return 'Chưa có đơn hàng hoàn thành';
    case 'cancelled':
      return 'Chưa có đơn hàng đã hủy';
  }
};

const OrderItem = ({ order, onPress, handleRepeatOrder }) => {
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
          order.status === 'completed' && (
            <TouchableOpacity
              onPress={handleRepeatOrder}
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Đặt lại</Text>
            </TouchableOpacity>
          ) 
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


const EmptyView = ({ message }) => (
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
  container: { flex: 1, backgroundColor: colors.white },
  scene: {
    width: '100%',
    flex: 1,
    paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
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
    fontWeight: 'bold',
    color: colors.pink500,
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
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    marginHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#666',
  },
});

export default OrderHistoryScreen;
