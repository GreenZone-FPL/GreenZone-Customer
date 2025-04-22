import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {getOrderDetail} from '../../axios';
import {OnlineMethod} from '../../constants';
import {useAppContext} from '../../context/appContext';
import {onlineMethods} from '../../screens/checkout/checkout-components';
import {PaymentMethodItem} from '../../type-interface/checkout';

// ✅ Type cho navigation
type ShoppingGraphParamList = {
  PayOsScreen: {orderId: string; totalPrice: number};
  Zalopayscreen: {orderId: string; totalPrice: number};
  OrderHistoryScreen: undefined;
};

interface OrderDetail {
  _id: string;
  totalPrice: number;
  [key: string]: any;
}

export const useOrderDetailContainer = (orderId: string) => {
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodItem>(
    onlineMethods[0],
  );
  const [dialogPaymentMethodVisible, setDialogPaymentMethodVisible] =
    useState(false);
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<ShoppingGraphParamList>>();
  const {updateOrderMessage} = useAppContext();

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId, updateOrderMessage]);

  const fetchOrderDetail = async () => {
    try {
      const response = await getOrderDetail(orderId);
      setOrderDetail(response);
    } catch (error) {
      console.error('Error fetching order detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMethod = (method: PaymentMethodItem) => {
    setPaymentMethod(method);
    if (!orderDetail) return;

    const {_id, totalPrice} = orderDetail;

    if (method.value === OnlineMethod.PAYOS.value) {
      navigation.navigate('PayOsScreen', {orderId: _id, totalPrice});
    } else if (method.value === OnlineMethod.CARD.value) {
      navigation.navigate('Zalopayscreen', {orderId: _id, totalPrice});
    }

    setDialogPaymentMethodVisible(false);
  };

  const backAction = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'OrderHistoryScreen'}],
      });
    }
    return true;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, [navigation]),
  );

  const callBackAfterCancel = async (): Promise<void> => {
    await fetchOrderDetail();
  };

  return {
    cancelDialogVisible,
    setCancelDialogVisible,
    orderDetail,
    loading,
    paymentMethod,
    dialogPaymentMethodVisible,
    setDialogPaymentMethodVisible,
    handleSelectMethod,
    backAction,
    callBackAfterCancel,
  };
};
