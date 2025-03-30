import React, { useState, useEffect } from 'react';
import { View, AppState, Text } from 'react-native';
import CryptoJS from 'crypto-js';
import { WebView } from 'react-native-webview';
import { PaperProvider } from 'react-native-paper';

// Hàm tạo MAC (chữ ký)
const generateMac = (appid, apptransid, appuser, amount, apptime, embeddata, item, key1) => {
  const hmacInput = `${appid}|${apptransid}|${appuser}|${amount}|${apptime}|${embeddata}|${item}`;
  return CryptoJS.HmacSHA256(hmacInput, key1).toString(CryptoJS.enc.Hex);
};

// Hàm tạo mã đơn hàng đúng format yymmdd_random
const getAppTransId = () => {
  const date = new Date();
  date.setHours(date.getHours() + 7);
  const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${yymmdd}_${randomNum}`;
};

const ZalopayScreen = () => {
  const [orderUrl, setOrderUrl] = useState(null);
  
  useEffect(() => {
    handlePayment(); // Gọi thanh toán tự động khi vào màn hình
  }, []);

  const handlePayment = async () => {
    const APP_ID = '2554'; 
    const KEY1 = 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn'; 
    const ENDPOINT = 'https://sb-openapi.zalopay.vn/v2/create';
  
    const appTransId = getAppTransId();
    const appTime = Date.now();
    const amount = 100000;
  
    const embedData = JSON.stringify({ promo: 'none' });
    const item = JSON.stringify([{ itemid: 'ksdjjk223k43', itename: 'Tổng Tiền', itemprice: amount, itemquantity: 1 }]);
  
    const order = {
      app_id: parseInt(APP_ID),
      app_user: 'user123',
      app_trans_id: appTransId,
      app_time: appTime,
      amount: amount,
      description: 'Thanh toán đơn hàng test',
      embed_data: embedData,
      item: item,
      callback_url: 'myapp://zalopay-callback',
    };
    
    // Tạo MAC
    order.mac = generateMac(order.app_id, order.app_trans_id, order.app_user, order.amount, order.app_time, order.embed_data, order.item, KEY1);
  
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (data.order_url) {
        console.log('Order URL:', data.order_url);
        setOrderUrl(data.order_url);
      } else {
        alert(`Lỗi: ${data.return_message || 'Không thể tạo đơn hàng.'}`);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        {orderUrl ? (
          <WebView 
            source={{ uri: orderUrl }} 
            style={{ flex: 1 }}
            onNavigationStateChange={(navState) => {
              console.log('WebView URL:', navState.url);
            }}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Đang xử lý thanh toán...</Text>
          </View>
        )}
      </View>
    </PaperProvider>
  );
};


export default ZalopayScreen;
