import { View, Text, ScrollView, Alert, Button, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WebView from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { hmacSHA256 } from 'react-native-hmac';
import { updatePaymentStatus } from '../../../axios';


const PayOsScreen = () => {
  const clientID = 'fe4d0414-d208-41a0-9f57-6de694aac3e6';
  const apiKey = '0fa73b9a-da72-444c-adc9-2721333c74a9';
  const checkSum = 'fde67b6bedccff59b32d19676ab3aca2061facd79450ac232e6f75a7747e7a89';

  const [paymentLink, setPaymentLink] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();

  const { orderId, totalPrice } = route.params || {};

  useEffect(() => {
    if (totalPrice) {
      handlePayment();
    }
  }, [totalPrice]);

  useEffect(() => {
    if (paymentLink) {
      console.log("Payment link đã cập nhật:", paymentLink);
    }
  }, [paymentLink]);
  
  

  const handlePayment = async () => {
    try {
      setLoading(true);
      const amount = totalPrice;
      const orderCode = Date.now();
      const returnUrl = `https://yourapp.com/payment-success?orderId=${orderId}`;
      const cancelUrl = `https://yourapp.com/payment-cancel?orderId=${orderId}`;

      const signature = await hmacSHA256(
        `amount=${amount}&cancelUrl=${cancelUrl}&description=Thanh toán đơn hàng&orderCode=${orderCode}&returnUrl=${returnUrl}`,
        checkSum
      );

      const body = {
        orderCode,
        amount,
        description: 'Thanh toán đơn hàng',
        cancelUrl,
        returnUrl,
        signature,
      };

      const response = await axios.post('https://api-merchant.payos.vn/v2/payment-requests', body, {
        headers: {
          'x-client-id': clientID,
          'x-api-key': apiKey,
        },
      });
      console.log("PayOS Response:", response.data)
      
      
      if (response.data.code === "00" && response.data.data?.checkoutUrl) {
        console.log("Checkout URL từ API:", response.data.data.checkoutUrl);
        setPaymentLink(response.data.data.checkoutUrl);
      } else {
        Alert.alert('Lỗi', 'Không thể tạo yêu cầu thanh toán');
      }
      
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationChange = async (navState) => {
    const { url } = navState;
  
    console.log('Current URL:', url);
  
    if (url.includes('/success')) {
      Alert.alert('Thành công', 'Bạn đã thanh toán thành công');
  
      // Gọi API cập nhật trạng thái thanh toán
      try {
        await updatePaymentStatus(orderId, 'success', 'TRANSACTION_ID_FROM_PAYOS');
      } catch (error) {
        Alert.alert('Lỗi', 'Cập nhật trạng thái thanh toán thất bại.');
      }
  
      navigation.navigate('OrderDetailScreen', { orderId });// Điều hướng về màn hình chính
    } else if (url.includes('/cancel')) {
      Alert.alert('Thất bại', 'Đã hủy thanh toán.');
  
      // Gọi API cập nhật trạng thái thất bại
      try {
        await updatePaymentStatus(orderId, 'cancelled', 'TRANSACTION_ID_FROM_PAYOS');
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể cập nhật trạng thái hủy.');
      }
  
      navigation.navigate('OrderDetailScreen', { orderId });      // Quay lại màn hình trước đó
    }
  };
  

  return (
    <View>
      <Button onPress={handlePayment} title="Thanh Toán"></Button>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <WebView
          source={{uri: paymentLink}}
          style={{width: '100%', height: 600}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onNavigationStateChange={handleNavigationChange}
        />
      </ScrollView>
    </View>
  );
};

export default PayOsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    width: '100%',
    height: 600,
  },
});
