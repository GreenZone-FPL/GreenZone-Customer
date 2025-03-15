import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet} from 'react-native';
import axios from 'axios';

const SendSMSScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('0779188717');
  const [otpCode, setOtpCode] = useState('');

  const sendSms = async (phoneNumber, otpCode) => {
    const API_URL =
      'https://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/';
    const API_KEY = '7F3DD9B9C2A7A5F9466A718170142E';
    const SECRET_KEY = 'C6F6C14B91E616D1CB60D66DCF6F39'; 
    const BRAND_NAME = 'Baotrixemay';

    const smsData = {
      ApiKey: API_KEY,
      Content: `${otpCode} là mã xác minh đăng ký Baotrixemay của bạn`,
      Phone: phoneNumber,
      SecretKey: SECRET_KEY,
      Brandname: BRAND_NAME,
      SmsType: '2',
    };

    try {
      const response = await axios.post(API_URL, smsData, {
        headers: {'Content-Type': 'application/json'},
      });
      console.log('Kết quả gửi SMS:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Lỗi khi gửi SMS:',
        error.response ? error.response.data : error.message,
      );
      throw error;
    }
  };

  const generateOtp = () => {
    // Tạo mã OTP ngẫu nhiên (6 chữ số)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(otp);
    console.log('Mã OTP:', otp); // Log OTP ra console
    return otp;
  };
  
  

  const handleSendSms = async () => {
    if (!phoneNumber) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại.');
      return;
    }

    const otp = generateOtp();
    try {
      const result = await sendSms(phoneNumber, otp);
      if (result.CodeResult === '100') {
        Alert.alert('Thành công', 'Mã OTP đã được gửi.');
      } else {
        Alert.alert('Thất bại', `Lỗi gửi SMS: ${result.ErrorMessage}`);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Gửi SMS thất bại, vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nhập số điện thoại:</Text>
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Button title="Gửi OTP" onPress={handleSendSms} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  otp: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default SendSMSScreen;
