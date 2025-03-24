import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import CryptoJS from 'crypto-js';
import { PaperProvider } from 'react-native-paper';

// Hàm tạo MAC (chữ ký)
const generateMac = (appid, apptransid, appuser, amount, apptime, embeddata, item, key1) => {
  const hmacInput = `${appid}|${apptransid}|${appuser}|${amount}|${apptime}|${embeddata}|${item}`;
  
  console.log('🔹 Chuỗi cần ký:', hmacInput);

  // Tạo MAC với HmacSHA256
  const macHex = CryptoJS.HmacSHA256(hmacInput, key1).toString(CryptoJS.enc.Hex);
  
  console.log('✅ MAC đã tạo:', macHex);
  return macHex;
};


// Hàm tạo mã đơn hàng đúng format yymmdd_random (GMT+7)
const getAppTransId = () => {
  const date = new Date();
  date.setHours(date.getHours() + 7); // Đảm bảo đúng múi giờ GMT+7
  const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, ''); // yymmdd
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${yymmdd}_${randomNum}`;
};

const ZalopayScreen = () => {
  const [orderUrl, setOrderUrl] = useState(null);

  const itemArray = [
    {
      itemid: 'spA',
      itename: 'Sản phẩm A',
      itemprice: 10000,
      itemquantity: 1,
    },
  ];
  const jsonArrayString = JSON.stringify(itemArray);

  const handlePayment = async () => {
    const APP_ID = '2554'; 
    const KEY1 = 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn'; 
    const ENDPOINT = 'https://sb-openapi.zalopay.vn/v2/create';
  
    const appTransId = getAppTransId();
    const appTime = Date.now();
    const amount = 10000;
  
    const embedData = JSON.stringify({ promo: 'none' });
    const item = jsonArrayString; // Danh sách sản phẩm dạng JSON
  
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
  
    // Tạo MAC chuẩn theo định dạng ZaloPay
    order.mac = generateMac(
      order.app_id,
      order.app_trans_id,
      order.app_user,
      order.amount,
      order.app_time,
      order.embed_data,
      order.item,
      KEY1
    );
  
    console.log('🔹 Dữ liệu gửi lên:', JSON.stringify(order, null, 2));
  
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
  
      const data = await response.json();
      console.log('🔹 API Response:', data);
  
      if (data.order_url) {
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
        <WebView source={{ uri: orderUrl }} style={{ flex: 1 }} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button title="THANH TOÁN QUA ZALOPAY" onPress={handlePayment} />
        </View>
      )}
    </View>
    </PaperProvider>
  );
};

export default ZalopayScreen;

const styles = StyleSheet.create({});