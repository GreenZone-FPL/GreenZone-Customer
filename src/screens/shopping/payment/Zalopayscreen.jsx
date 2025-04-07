import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import CryptoJS from 'crypto-js';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Text,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
import { updatePaymentStatus } from '../../../axios';
import { useAppContext } from '../../../context/appContext';
import { MainGraph } from '../../../layouts/graphs';
import { AppAsyncStorage, Toaster } from '../../../utils';

const generateMac = (
  appid,
  apptransid,
  appuser,
  amount,
  apptime,
  embeddata,
  item,
  key1,
) => {
  const hmacInput = `${appid}|${apptransid}|${appuser}|${amount}|${apptime}|${embeddata}|${item}`;
  return CryptoJS.HmacSHA256(hmacInput, key1).toString(CryptoJS.enc.Hex);
};

const getAppTransId = () => {
  const date = new Date();
  date.setHours(date.getHours() + 7);
  const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `${yymmdd}_${randomNum}`;
};

const ZalopayScreen = () => {
  const [orderUrl, setOrderUrl] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const [paymentLinkId, setPaymentLinkId] = useState('');
  const { orderId, totalPrice } = route.params || {};
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info',
  });
  const { awaitingPayments, setAwaitingPayments, cartDispatch } = useAppContext()
  // Hàm back tại điện thoại
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert('Thông báo', 'Bạn có muốn quay lại không?', [
          { text: 'Không', style: 'cancel' },
          {
            text: 'Có',
            onPress: () => {
              navigation.goBack()
            },
          },
        ]);
        return true; // Chặn Back mặc định
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove(); // Xóa sự kiện khi rời khỏi màn hình
    }, [navigation]),
  );

  useEffect(() => {
    handlePayment();
  }, []);

  const handlePayment = async () => {
    const APP_ID = 2554;
    const KEY1 = 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn';
    const ENDPOINT = 'https://sb-openapi.zalopay.vn/v2/create';

    const appTransId = getAppTransId();
    const appTime = Date.now();
    const amount = totalPrice;

    const embedData = JSON.stringify({ promo: 'none' });
    const item = JSON.stringify([
      {
        itemid: 'ksdjjk223k43',
        itemname: 'Tổng Tiền',
        itemprice: amount,
        itemquantity: 1,
      },
    ]);

    const order = {
      app_id: APP_ID,
      app_user: 'user123',
      app_trans_id: appTransId,
      app_time: appTime,
      amount: amount,
      description: 'Thanh toán đơn hàng test',
      embed_data: embedData,
      item: item,
      callback_url: 'myapp://zalopay-callback',
    };

    order.mac = generateMac(
      order.app_id,
      order.app_trans_id,
      order.app_user,
      order.amount,
      order.app_time,
      order.embed_data,
      order.item,
      KEY1,
    );

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (data.return_code !== 1) {
        Alert.alert('Lỗi', data.return_message || 'Không thể tạo đơn hàng.');
        return;
      }

      console.log('Order URL:', data);
      setOrderUrl(data.order_url);
      setPaymentLinkId(data.order_token)

    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

  // ✅ Xử lý sự kiện điều hướng trong WebView
  const handleNavigationChange = async navState => {
    console.log('WebView URL:', navState.url);
    console.log('linkid', paymentLinkId)
    if (navState.url.includes('returncode=1')) {
      Alert.alert('Thông báo', 'Thanh toán thành công!');
      await updatePaymentStatus(orderId, 'success', paymentLinkId);

      setToast({
        visible: true,
        message: 'Thanh toán thành công',
        type: 'success',
      });

      await AppAsyncStorage.storeData(
        AppAsyncStorage.STORAGE_KEYS.awaitingPayments,
        null,
      );
      await CartManager.clearOrderItems(cartDispatch);
      setAwaitingPayments(null);
      navigation.reset({
        index: 1, // Chỉ mục màn hình sẽ được chọn sau reset
        routes: [
          { name: MainGraph.graphName },
          { name: 'OrderDetailScreen', params: { orderId } },
        ],
      });
    } else if (navState.url.includes('returncode=-6012') || navState.url.includes('status=-49')) {
      // call API delete order
      Toaster.show('Bạn đã hủy giao dịch')
      navigation.goBack()
    }
  };

  return (

    <View style={{ flex: 1 }}>
      {orderUrl ? (
        <WebView
          source={{ uri: orderUrl }}
          style={{ flex: 1 }}
          onNavigationStateChange={handleNavigationChange}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Đang xử lý thanh toán...</Text>
        </View>
      )}
    </View>

  );
};

export default ZalopayScreen;
