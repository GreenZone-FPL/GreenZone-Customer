import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { getOrdersByStatus } from '../../axios';
import { Column, CustomTabView, LightStatusBar, NormalHeader, NormalLoading, MyTabView, Row } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { OrderGraph } from '../../layouts/graphs';
import { useAppContext } from '../../context/appContext';
import PagerView from 'react-native-pager-view';


const width = Dimensions.get('window').width;

const orderStatuses = ['', 'completed', 'cancelled'];
const titles = ['Đang thực hiện', 'Đã hoàn tất', 'Đã huỷ'];

const OrderHistoryScreen = ({ navigation }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const { updateOrderMessage } = useAppContext();

  // Cập nhật hàm fetchOrders để kiểm tra trường hợp không có status
  const fetchOrders = async (status = '') => {
  
    try {
      setLoading(true);
      // Nếu không có status, gọi API với URL mặc định không có params
      const data = await getOrdersByStatus(status);
      setOrders(data);
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = (title, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.tabItem,
          tabIndex === index && { borderBottomWidth: 2, borderBottomColor: colors.primary }, // Thêm borderBottom khi active
        ]}
        onPress={() => handleTabChange(index)}
      >
        <Text
          style={[
            styles.tabText,
            tabIndex === index ? styles.activeText : styles.inactiveText,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };
  

  useEffect(() => {
    // Khi không có status, gọi API mà không có params (mặc định lấy đơn hàng đang thực hiện)
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

  const handleTabChange = (index) => {
    setTabIndex(index);
    fetchOrders(orderStatuses[index]);
  };
  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Lịch sử đơn hàng"
        onLeftPress={() => navigation.goBack()}
      />

      <Row style={{ marginHorizontal: 16 }}>
        {titles.map((title, index) => TabButton(title, index))}
      </Row>

      <PagerView
        style={{ flex: 1 }}
        initialPage={tabIndex}
        onPageSelected={(e) => setTabIndex(e.nativeEvent.position)}
      >
        {orderStatuses.map((status, index) => (
          <View key={index} style={{ paddingHorizontal: 16 }}>

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
          data={orders}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <OrderItem
              order={item}
              onPress={onItemPress}
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

const ItemOrderType = ({ deliveryMethod }) => {
  const imageMap = {
    pickup: require('../../assets/serving-method/takeaway.png'),
    delivery: require('../../assets/serving-method/delivery.png'),
  };

  return (
    <Image
      style={styles.orderTypeIcon}
      source={imageMap[deliveryMethod] || imageMap['pickup']}
    />
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
  },
  emptyContainer: { justifyContent: 'center', alignItems: 'center' },
  emptyImage: { width: width / 2, height: width / 2 },
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
  orderColumnEnd: { justifyContent: 'center', alignItems: 'center' },
  orderName: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500' },
  orderTime: { fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL, color: colors.gray850 },
  orderTotal: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    color: colors.pink500,
  },
  buttonContainer: { alignItems: 'center', justifyContent: 'center' },
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

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tabItem: {
    padding: 10,
  },
  tabText: {
    fontSize: 12,
  },
  activeText: {
    fontWeight: 'bold',
    color: colors.primary
  },
  inactiveText: {
    color: 'gray',
  },
});

export default OrderHistoryScreen;
