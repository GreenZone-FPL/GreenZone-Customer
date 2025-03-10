import { useState } from 'react';
import axios from 'axios';
import {hmacSHA256} from 'react-native-hmac';

const clientID = 'fe4d0414-d208-41a0-9f57-6de694aac3e6';
const apiKey = '0fa73b9a-da72-444c-adc9-2721333c74a9';
const checkSum ='fde67b6bedccff59b32d19676ab3aca2061facd79450ac232e6f75a7747e7a89';

const usePayment = () => {
  const [paymentLink, setPaymentLink] = useState('');

  const createPaymentLink = async (amount) => {
    try {
      const orderCode = Date.now(); // Mã đơn hàng duy nhất
      const cancelUrl = 'https://yourdomain.com/cancel';
      const returnUrl = 'https://yourdomain.com/success';
      const description = 'Thanh toán đơn hàng';

      // Tạo chữ ký bảo mật HMAC SHA256
      const signature = await hmacSHA256(
        `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`,
        checkSum
      );

      // Gửi yêu cầu tạo link thanh toán
      const response = await axios.post(
        'https://api-merchant.payos.vn/v2/payment-requests',
        {
          orderCode,
          amount,
          description,
          cancelUrl,
          returnUrl,
          signature,
        },
        {
          headers: {
            'x-client-id': clientID,
            'x-api-key': apiKey,
          },
        }
      );

      // Lưu link thanh toán vào state
      if (response.data.code === 0) {
        setPaymentLink(response.data.data.checkoutUrl);
      } else {
        console.error('Lỗi tạo link thanh toán:', response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi tạo link thanh toán:', error);
    }
  };

  return { paymentLink, createPaymentLink };
};

export default usePayment;
