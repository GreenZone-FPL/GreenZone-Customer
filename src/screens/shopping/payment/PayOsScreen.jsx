import { View, Text, ScrollView, Alert, Button, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WebView from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { hmacSHA256 } from 'react-native-hmac';
import { updatePaymentStatus, updateOrderStatus } from '../../../axios';
import { colors } from '../../../constants';
import { NormalLoading } from '../../../components';
import { MainGraph } from "../../../layouts/graphs";
import ToastDialog from '../../../components/dialogs/ToastDialog';

const PayOsScreen = () => {
  const clientID = 'fe4d0414-d208-41a0-9f57-6de694aac3e6';
  const apiKey = '0fa73b9a-da72-444c-adc9-2721333c74a9';
  const checkSum = 'fde67b6bedccff59b32d19676ab3aca2061facd79450ac232e6f75a7747e7a89';

  const [paymentLink, setPaymentLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const route = useRoute();
  const navigation = useNavigation();
  const [paymentLinkId, setPaymentLinkId] = useState('');

  const { orderId, totalPrice} = route.params || {};
  console.log(orderId)

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
  
      console.log("PayOS Response:", response.data);
  
      if (response.data.code === "00" && response.data.data?.checkoutUrl) {
        setPaymentLink(response.data.data.checkoutUrl);
        setPaymentLinkId(response.data.data.paymentLinkId);
      } else {
        setToast({ visible: true, message: 'Không thể tạo yêu cầu thanh toán', type: 'error' });
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      setToast({ visible: true, message: 'Lỗi thanh toán', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationChange = async (navState) => {
    const { url } = navState;
    console.log("Current URL:", url);
    
    if (url.includes('/success')) {
      try {
        await updatePaymentStatus(orderId, 'success', paymentLinkId);
        setToast({ visible: true, message: 'Thanh toán thành công', type: 'success' });
      } catch (error) {
        setToast({ visible: true, message: 'Cập nhật trạng thái thanh toán thất bại.', type: 'error' });
      }
      navigation.replace('OrderSuccessScreen', { orderId });
    } else if (url.includes('status=CANCELLED')) {  
      setToast({ visible: true, message: 'Bạn đã hủy thanh toán.', type: 'warning' });
      try {
        await updatePaymentStatus(orderId, 'canceled', paymentLinkId);
        await updateOrderStatus(orderId, OrderStatus.CANCELLED.value)
      } catch (error) {
        console.log('không cập nhật')
      }
      navigation.navigate(MainGraph.graphName);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Button onPress={handlePayment} title="Cập nhật mã thanh toán" />
      {loading && <NormalLoading visible={loading} />} 
      {toast.visible && <ToastDialog isVisible={toast.visible} onHide={() => setToast({ ...toast, visible: false })} title={toast.message} icon="alert" iconColor="red" />} 
      {paymentLink ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <WebView
            source={{ uri: paymentLink }}
            style={{ width: '100%', height: 600 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onNavigationStateChange={handleNavigationChange}
          />
        </ScrollView>
      ) : (
        <Text style={styles.message}>Đang tạo liên kết thanh toán...</Text>
      )}
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
    height: 700,
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.primary,
  },
});