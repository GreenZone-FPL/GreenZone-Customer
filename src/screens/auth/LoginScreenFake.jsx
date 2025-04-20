import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { sendOTP } from '../../axios';
import {
  Column,
  FlatInput,
  LightStatusBar,
  NormalLoading,
  TitleText
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { AuthGraph } from '../../layouts/graphs';
import { AuthActionTypes } from '../../reducers';
import { Toaster } from '../../utils';
import axios from 'axios';


const LoginScreenFake = ({route, navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('0779188717');
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // const {authState, authDispatch} = useAppContext();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // useEffect(() => {
  //   if (authState.message) {
  //     Animated.timing(fadeAnim, {
  //       toValue: 0,
  //       duration: 2000,
  //       delay: 2000,
  //       useNativeDriver: true,
  //     }).start(() => {
  //       authDispatch({type: AuthActionTypes.CLEAR_MESSAGE});
  //     });
  //   }
  // }, [authState.message]);

  // Hàm tạo mã OTP 6 chữ số
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Mã OTP:', otp); // Log ra console
    return otp;
  };

  // Hàm gửi SMS OTP
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

  const handleSendOTP = async () => {
    if (phoneNumber.trim().length !== 10 || !/^[0-9]+$/.test(phoneNumber)) {
      setPhoneNumberError(true);
      setPhoneNumberMessage('Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
      return;
    }

    setLoading(true);
    const otp = generateOtp(); // Tạo mã OTP

    try {
      const result = await sendSms(phoneNumber, otp);
      if (result.CodeResult === '100') {
      
        navigation.navigate(AuthGraph.VerifyOTPScreen, {phoneNumber, otp}); 
      } else {
        Alert.alert('Thất bại', `Lỗi gửi SMS: ${result.ErrorMessage}`);
      }
    } catch (error) {
      console.log('Gửi SMS thất bại', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column style={styles.container}>
      {/* {authState.message ? (
        <Animated.View style={[styles.toast, {opacity: fadeAnim}]}>
          <Icon source="information" size={20} color={colors.primary} />
          <Text style={styles.toastText}>{authState.message}</Text>
        </Animated.View>
      ) : null} */}

      <LightStatusBar />
      <Image
        source={require('../../assets/images/logo.png')}
        style={{width: '100%', height: 200}}
      />
      <TitleText text="Chào mừng đến với" style={{textAlign: 'center'}} />
      <TitleText text="GREEN ZONE Fake" style={styles.title} />

      <FlatInput
        value={phoneNumber}
        label="Số điện thoại"
        placeholder="Nhập số điện thoại của bạn..."
        style={styles.input}
        setValue={text => {
          setPhoneNumberError(false);
          setPhoneNumberMessage('');
          setPhoneNumber(text);
        }}
        error={phoneNumberError}
        invalidMessage={phoneNumberMessage}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <View style={{width: 30, height: 30}}></View>
        <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
        <Icon source="arrow-right-circle" color={colors.white} size={30} />
      </TouchableOpacity>
      <NormalLoading visible={loading} />
    </Column>
  );
};

export default LoginScreenFake;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fbBg,
    padding: 16,
    gap: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toast: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: colors.black,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 8,
  },
  toastText: {
    color: colors.white,
    fontSize: 14,
    flexShrink: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
  },

  separator: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray300,
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: colors.blue600,
    paddingVertical: 16,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  socialText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    marginLeft: 10,
  },
  googleButton: {
    backgroundColor: colors.white,
    borderColor: colors.gray200,
    borderWidth: 1,
  },
  googleText: {
    color: colors.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.gray200,
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '400',
    color: colors.black,
  },
});
