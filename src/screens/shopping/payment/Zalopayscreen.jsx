import React, { useState, useEffect } from 'react';
import { View, Button, Linking, AppState , Text, TouchableOpacity} from 'react-native';
import CryptoJS from 'crypto-js';
import { useRoute, useNavigation } from '@react-navigation/native';
import { updatePaymentStatus, updateOrderStatus } from '../../../axios';
import { PrimaryButton } from '../../../components';



// Hàm tạo MAC (chữ ký)
const generateMac = (appid, apptransid, appuser, amount, apptime, embeddata, item, key1) => {
  const hmacInput = `${appid}|${apptransid}|${appuser}|${amount}|${apptime}|${embeddata}|${item}`;
  return CryptoJS.HmacSHA256(hmacInput, key1).toString(CryptoJS.enc.Hex);
};

// Hàm tạo mã đơn hàng đúng format yymmdd_random
const getAppTransId = () => {
  const date = new Date();
  date.setHours(date.getHours() + 7);
  const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, ''); // yymmdd
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${yymmdd}_${randomNum}`;
};

const ZalopayScreen = () => {
  const [orderUrl, setOrderUrl] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const route = useRoute();
  const navigation = useNavigation();

  const { orderId, totalPrice} = route.params || {};
  console.log('tong tien: ', totalPrice)
  useEffect(() => {
    // Theo dõi trạng thái ứng dụng
    const handleAppStateChange = (nextAppState) => {
      console.log('📢 AppState:', nextAppState);
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkPaymentStatus();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [appState]);


  const APP_ID = '2554'; 
  const KEY1 = 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn'; 
  const ENDPOINT = 'https://sb-openapi.zalopay.vn/v2/create';

  const appTransId = getAppTransId();
  const appTime = Date.now();
  const amount = totalPrice;

  const embedData = JSON.stringify({ promo: 'none' });
  const item = JSON.stringify([{ itemid: orderId, itename: 'Tổng Tiền', itemprice: totalPrice, itemquantity: 1 }]);

  
  const order = {
    app_id: parseInt(APP_ID),
    app_user: 'user123',
    app_trans_id: appTransId,
    app_time: appTime,
    amount: amount,
    description: 'Thanh toán đơn hàng test',
    embed_data: embedData,
    item: item,
    callback_url: 'https://yourserver.com/callback',
  };
  
  // Tạo MAC
  order.mac = generateMac(order.app_id, order.app_trans_id, order.app_user, order.amount, order.app_time, order.embed_data, order.item, KEY1);


  const handlePayment = async () => {
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (data.order_url) {
        setOrderUrl(data.order_url);
        await updatePaymentStatus(orderId, 'success', data.order_token);
        // Mở ZaloPay để thanh toán
        Linking.openURL(data.order_url)
          .then(() => console.log('🔹 Mở ZaloPay:', data.order_url))
          .catch(err => console.error('❌ Lỗi mở URL:', err));
      } else {
        alert(`Lỗi: ${data.return_message || 'Không thể tạo đơn hàng.'}`);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };
  const handleExit = async () => {


    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const data = await response.json();
      await updatePaymentStatus(orderId, 'canceled', data.order_token);
      await updateOrderStatus(orderId, OrderStatus.CANCELLED.value);
    } catch (error) {
      // alert('Lỗi: ' + error.message);
    }
    navigation.goBack();
  }
  return (
      <View style={{ flex: 1 , justifyContent: 'center'}}>
        <View style={{margin: 16, alignItems: 'center', gap: 25}}>
          <Text style={{textAlign: 'center', width: 350}}>Bạn cần tải ứng dụng ZaloPay để thực hiện thanh toán này. Đã có ứng dụng hãy xác nhận</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', width: "350", justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={handleExit} style={{borderWidth: 1, padding: 16, borderRadius: 8}}><Text>Hủy thanh toán</Text></TouchableOpacity>
            <PrimaryButton onPress={handlePayment} title={'Xác nhận'}/>
          </View>
          
        </View>

      </View>

  );
};

export default ZalopayScreen;

