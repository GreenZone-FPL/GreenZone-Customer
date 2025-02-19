import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Column,
  CustomTabView,
  LightStatusBar,
  NormalHeader,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {OrderGraph, ShoppingGraph} from '../../layouts/graphs';
import {TextFormatter} from '../../utils';

const width = Dimensions.get('window').width;

const OrderHistoryScreen = ({navigation}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleRepeatOrder = () => {
    navigation.navigate(ShoppingGraph.CheckoutScreen);
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
          titles: ['Đang thực hiện', 'Đã hoàn tất', 'Đã huỷ'],
          titleActiveColor: colors.primary,
          titleInActiveColor: colors.gray700,
        }}>
        {['Picked', 'Completed', 'Cancelled'].map((status, index) => (
          <OrderListView
            key={index}
            onItemPress={() =>
              navigation.navigate(OrderGraph.OrderDetailScreen)
            }
            status={status}
            handleRepeatOrder={handleRepeatOrder}
          />
        ))}
      </CustomTabView>
    </View>
  );
};

const OrderListView = ({status, onItemPress, handleRepeatOrder}) => {
  const filteredOrders = orders.filter(order => order.status === status);
  return (
    <View style={styles.scene}>
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.orderId}
          renderItem={({item}) => (
            <OrderItem
              onPress={onItemPress}
              order={item}
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
    case 'Picked':
      return 'Chưa có đơn hàng cần thực hiện';
    case 'Completed':
      return 'Chưa có đơn hàng hoàn thành';
    case 'Cancelled':
      return 'Chưa có đơn hàng đã hủy';
  }
};

const OrderItem = ({order, onPress, handleRepeatOrder}) => (
  <Pressable onPress={onPress} style={styles.orderItem}>
    <ItemOrderType orderType={order.orderType} />
    <Column style={styles.orderColumn}>
      <Text numberOfLines={2} style={styles.orderName}>
        {order.items ? order.items.map(item => item.name).join(' - ') : ''}
      </Text>
      <ItemOrderText orderType={order.orderType} />
      <Text style={styles.orderTime}>{order.createdAt}</Text>
    </Column>
    {order.status === 'Cancelled' ? (
      <Text style={styles.orderTotal}>
        {TextFormatter.formatCurrency(order.totalAmount)}
      </Text>
    ) : (
      <Column style={styles.orderColumnEnd}>
        <Text style={styles.orderTotal}>
          {TextFormatter.formatCurrency(order.totalAmount)}
        </Text>
        <Pressable onPress={handleRepeatOrder} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Đặt lại</Text>
        </Pressable>
      </Column>
    )}
  </Pressable>
);

const ItemOrderType = ({orderType}) => {
  const imageMap = {
    'dine-in': require('../../assets/serving-method/dine-in.png'),
    takeaway: require('../../assets/serving-method/takeaway.png'),
    delivery: require('../../assets/serving-method/delivery.png'),
  };

  return <Image style={styles.orderTypeIcon} source={imageMap[orderType]} />;
};
const ItemOrderText = ({orderType}) => {
  const text = {
    'dine-in': 'Dùng tại chỗ',
    takeaway: 'Mang đi',
    delivery: 'Giao tận nơi',
  };
  return <Text style={styles.orderTime}>{text[orderType]}</Text>;
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
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderBottomColor: colors.gray200,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
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

// Dữ liệu đơn hàng (mẫu)
// const orders = [
//   {
//     orderId: '22124-3772987543535',
//     totalAmount: 150000,
//     status: 'Picked', // Đang thực hiện
//     createdAt: '10:16-22/12/2024',
//     estimatedTime: '10:30',
//     orderType: 'dine-in',
//     items: [
//       {id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000},
//       {id: '2', name: 'Kem Cheese', quantity: 2, price: 20000},
//       {id: '3', name: 'Kem Cheese', quantity: 2, price: 20000},
//       {id: '4', name: 'Kem Cheese', quantity: 2, price: 20000},
//     ],
//   },

//   {
//     orderId: '22124-3772987543537',
//     totalAmount: 200000,
//     status: 'Completed', // Đã hoàn thành
//     createdAt: '10:16-22/12/2024',
//     estimatedTime: null,
//     orderType: 'takeaway',

//     items: [
//       {id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000},
//       {id: '2', name: 'Kem Cheese', quantity: 2, price: 20000},
//       {id: '3', name: 'Trà Sữa Truyền Thống', quantity: 3, price: 50000},
//     ],
//   },
//   {
//     orderId: '22124-3772987543538',
//     totalAmount: 80000,
//     status: 'Cancelled', // Đã hủy
//     createdAt: '10:16-22/12/2024',
//     estimatedTime: null,
//     orderType: 'delivery',

//     items: [{id: '4', name: 'Trà Đào Cam Sả', quantity: 1, price: 80000}],
//   },
//   {
//     orderId: '22124-3772987543539',
//     totalAmount: 150000,
//     status: 'Picked',
//     createdAt: '10:16-22/12/2024',
//     estimatedTime: '10:30',
//     orderType: 'delivery',

//     items: [
//       {id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000},
//       {id: '2', name: 'Kem Cheese', quantity: 2, price: 20000},
//       {id: '3', name: 'Kem Cheese', quantity: 2, price: 20000},
//       {id: '4', name: 'Kem Cheese', quantity: 2, price: 20000},
//       {id: '5', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000},
//       {id: '6', name: 'Kem Cheese', quantity: 2, price: 20000},
//       {id: '7', name: 'Kem Cheese', quantity: 2, price: 20000},
//       {id: '8', name: 'Kem Cheese', quantity: 2, price: 20000},
//     ],
//   },
//   {
//     orderId: '22124-3772987543539',
//     totalAmount: 150000,
//     status: 'Cancelled',
//     createdAt: '10:16-22/12/2024',
//     estimatedTime: 'null',
//     orderType: 'delivery',

//     items: [
//       {id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000},
//       {id: '2', name: 'Kem Cheese', quantity: 2, price: 20000},
//       {id: '3', name: 'Kem Cheese', quantity: 2, price: 20000},
//       {id: '4', name: 'Kem Cheese', quantity: 2, price: 20000},
//     ],
//   },
// ];

const orders = [];

export default OrderHistoryScreen;
