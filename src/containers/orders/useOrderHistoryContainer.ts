import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {getOrdersByStatus} from '../../axios';
import {OnlineMethod} from '../../constants';
import {useAppContext} from '../../context/appContext';
import {onlineMethods} from '../../screens/checkout/checkout-components';
import {PaymentMethodItem} from '../../type-interface/checkout';

type ShoppingGraphParamList = {
  PayOsScreen: {orderId: string; totalPrice: number};
  Zalopayscreen: {orderId: string; totalPrice: number};
  OrderDetailScreen: {orderId: string};
  BottomGraph: {name: 'BottomGraph'};
};

interface OrderDetail {
  _id: string;
  totalPrice: number;
  [key: string]: any;
}
const itemsPerPage = 4;
const orderStatuses = ['', 'completed', 'cancelled'];

export const useOrderHistoryContainer = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodItem>(
    onlineMethods[0],
  );

  const [dialogPaymentMethodVisible, setDialogPaymentMethodVisible] =
    useState(false);
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<ShoppingGraphParamList>>();
  const {updateOrderMessage} = useAppContext();
  const [currentPageMap, setCurrentPageMap] = useState<Record<string, number>>(
    {},
  );

  const fetchOrders = async (status: string) => {
    try {
      setLoading(true);
      const data = await getOrdersByStatus(status);
      setOrders((prev: any) => ({...prev, [status]: data}));
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    orderStatuses.forEach(status => fetchOrders(status));
  }, [updateOrderMessage.status]);

  useEffect(() => {
    fetchOrders(orderStatuses[tabIndex]);
  }, [tabIndex]);

  const handleSelectMethod = (method: PaymentMethodItem) => {
    setPaymentMethod(method);
    if (!selectedOrder) return;
    const {_id, totalPrice} = selectedOrder;

    if (method.value === OnlineMethod.PAYOS.value) {
      navigation.navigate('PayOsScreen', {orderId: _id, totalPrice});
    } else if (method.value === OnlineMethod.CARD.value) {
      navigation.navigate('Zalopayscreen', {
        orderId: _id,
        totalPrice: totalPrice,
      });
    }
    setDialogPaymentMethodVisible(false);
  };

  const onHeaderPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({index: 0, routes: [{name: 'BottomGraph'}]});
    }
  };
  const navigateOrderDetail = (order: OrderDetail) => {
    navigation.navigate('OrderDetailScreen', {orderId: order._id});
  };

  const getPagedOrders = (status: string) => {
    const currentPage = currentPageMap[status] || 1;
    const allOrders = orders[status] || [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allOrders.slice(startIndex, startIndex + itemsPerPage);
  };

  const setCurrentPage = (status: string, page: number) => {
    setCurrentPageMap(prev => ({...prev, [status]: page}));
  };

  const totalPages = (status: string) => {
    const total = orders[status]?.length || 0;
    return Math.ceil(total / itemsPerPage);
  };

  return {
    navigation,
    tabIndex,
    setTabIndex,
    selectedOrder,
    setSelectedOrder,
    orders,
    setOrders,
    loading,
    setLoading,
    paymentMethod,
    setPaymentMethod,
    dialogPaymentMethodVisible,
    setDialogPaymentMethodVisible,
    cancelDialogVisible,
    setCancelDialogVisible,
    handleSelectMethod,
    onHeaderPress,
    navigateOrderDetail,
    getPagedOrders,
    setCurrentPage,
    totalPages,
    currentPageMap,
  };
};

const mockOrders = {
  '': [
    // Đang thực hiện
    {
      _id: 'o1',
      status: '',
      deliveryMethod: 'Giao hàng nhanh',
      totalPrice: 150000,
      createdAt: '2024-08-01T10:00:00Z',
      orderItems: [
        {product: {name: 'Sách Lập trình Java'}},
        {product: {name: 'Sách Kotlin Cơ bản'}},
        {product: {name: 'Sách Android Nâng cao'}},
      ],
    },
    {
      _id: 'o2',
      status: '',
      deliveryMethod: 'Nhận tại cửa hàng',
      totalPrice: 99000,
      createdAt: '2024-08-02T09:30:00Z',
      orderItems: [
        {product: {name: 'Chuột không dây'}},
        {product: {name: 'Bàn phím cơ'}},
      ],
    },
    {
      _id: 'o3',
      status: 'awaiting_payment', // dùng để hiển thị Hủy/Thanh toán
      deliveryMethod: 'Giao hàng nhanh',
      totalPrice: 250000,
      createdAt: '2024-08-03T08:00:00Z',
      orderItems: [{product: {name: 'Tai nghe Bluetooth'}}],
    },
    {
      _id: 'o4',
      status: '',
      deliveryMethod: 'Giao hàng nhanh',
      totalPrice: 200000,
      createdAt: '2024-08-04T11:00:00Z',
      orderItems: [
        {product: {name: 'Laptop Gaming'}},
        {product: {name: 'Chuột Gaming'}},
      ],
    },
    {
      _id: 'o5',
      status: '',
      deliveryMethod: 'Nhận tại cửa hàng',
      totalPrice: 300000,
      createdAt: '2024-08-05T12:30:00Z',
      orderItems: [
        {product: {name: 'Điện thoại thông minh'}},
        {product: {name: 'Sạc nhanh'}},
      ],
    },
    {
      _id: 'o6',
      status: '',
      deliveryMethod: 'Giao hàng nhanh',
      totalPrice: 500000,
      createdAt: '2024-08-06T13:15:00Z',
      orderItems: [{product: {name: 'Smartwatch'}}],
    },
    {
      _id: 'o7',
      status: '',
      deliveryMethod: 'Nhận tại cửa hàng',
      totalPrice: 450000,
      createdAt: '2024-08-07T14:10:00Z',
      orderItems: [
        {product: {name: 'Tai nghe Bluetooth'}},
        {product: {name: 'Chuột Gaming'}},
      ],
    },
    {
      _id: 'o8',
      status: '',
      deliveryMethod: 'Giao hàng nhanh',
      totalPrice: 150000,
      createdAt: '2024-08-08T15:20:00Z',
      orderItems: [
        {product: {name: 'Đèn LED'}},
        {product: {name: 'Bàn phím cơ'}},
      ],
    },
    {
      _id: 'o9',
      status: '',
      deliveryMethod: 'Nhận tại cửa hàng',
      totalPrice: 250000,
      createdAt: '2024-08-09T16:00:00Z',
      orderItems: [
        {product: {name: 'Laptop'}},
        {product: {name: 'Chuột không dây'}},
      ],
    },
    {
      _id: 'o10',
      status: '',
      deliveryMethod: 'Giao hàng nhanh',
      totalPrice: 300000,
      createdAt: '2024-08-10T17:30:00Z',
      orderItems: [
        {product: {name: 'Màn hình máy tính'}},
        {product: {name: 'Tai nghe không dây'}},
      ],
    },
    {
      _id: 'o11',
      status: '',
      deliveryMethod: 'Nhận tại cửa hàng',
      totalPrice: 100000,
      createdAt: '2024-08-11T18:45:00Z',
      orderItems: [{product: {name: 'Bàn phím'}}],
    },
    {
      _id: 'o12',
      status: '',
      deliveryMethod: 'Giao hàng nhanh',
      totalPrice: 350000,
      createdAt: '2024-08-12T19:00:00Z',
      orderItems: [
        {product: {name: 'Máy tính xách tay'}},
        {product: {name: 'Chuột và bàn phím'}},
      ],
    },
    {
      _id: 'o13',
      status: '',
      deliveryMethod: 'Nhận tại cửa hàng',
      totalPrice: 80000,
      createdAt: '2024-08-13T20:00:00Z',
      orderItems: [{product: {name: 'Gối cao su'}}],
    },
    {
      _id: 'o14',
      status: '',
      deliveryMethod: 'Giao hàng nhanh',
      totalPrice: 100000,
      createdAt: '2024-08-14T21:15:00Z',
      orderItems: [{product: {name: 'Thẻ nhớ'}}],
    },
    {
      _id: 'o15',
      status: '',
      deliveryMethod: 'Nhận tại cửa hàng',
      totalPrice: 120000,
      createdAt: '2024-08-15T22:30:00Z',
      orderItems: [{product: {name: 'Khẩu trang'}}],
    },
  ],

  completed: [
    // Đã hoàn tất
    {
      _id: 'o16',
      status: 'completed',
      deliveryMethod: 'Giao hàng nhanh',
      totalPrice: 199000,
      createdAt: '2024-07-20T15:45:00Z',
      orderItems: [
        {product: {name: 'Ốp lưng điện thoại'}},
        {product: {name: 'Cường lực'}},
      ],
    },
    {
      _id: 'o17',
      status: 'completed',
      deliveryMethod: 'Nhận tại cửa hàng',
      totalPrice: 500000,
      createdAt: '2024-07-18T14:20:00Z',
      orderItems: [{product: {name: 'Sạc nhanh 65W'}}],
    },
  ],

  cancelled: [
    // Đã huỷ
    {
      _id: 'o18',
      status: 'cancelled',
      deliveryMethod: 'Giao hàng nhanh',
      totalPrice: 75000,
      createdAt: '2024-07-10T12:00:00Z',
      orderItems: [{product: {name: 'Bút cảm ứng'}}],
    },
  ],
};
