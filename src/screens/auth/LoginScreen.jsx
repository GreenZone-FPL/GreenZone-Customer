import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text
} from 'react-native';
import { Icon } from 'react-native-paper';
import { sendOTP } from '../../axios';
import {
  Column,
  LightStatusBar,
  NormalInput,
  NormalLoading,
  TitleText
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAuthContext } from '../../context';
import { AuthGraph } from '../../layouts/graphs';
import { AuthActionTypes } from '../../reducers';
import { Toaster } from '../../utils';
import axios from 'axios';

const LoginScreen = ({ route, navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { authState, authDispatch } = useAuthContext();

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

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Mã OTP:', otp); // Log ra console
    return otp;
  };

  const handleSendOTP = async () => {
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

    if (phoneNumber.trim() === '' || !phoneRegex.test(phoneNumber.trim())) {

      setPhoneNumberMessage('Vui lòng nhập số điện thoại hợp lệ (10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09)');
      return;
    }

    setLoading(true);
    const otp = generateOtp(); // Tạo mã OTP

    try {
      const result = await sendSms(phoneNumber, otp);
      const response = await sendOTP(phoneNumber);
      if (result.CodeResult === '100') {

        navigation.navigate(AuthGraph.VerifyOTPScreen, { phoneNumber, otp, code: response.code });
      } else {
        Alert.alert('Thất bại', `Lỗi gửi SMS: ${result.ErrorMessage}`);
      }
    } catch (error) {
      console.log('Gửi SMS thất bại', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSendOTP = async () => {
  //   const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

  //   if (phoneNumber.trim() === '' || !phoneRegex.test(phoneNumber.trim())) {

  //     setPhoneNumberMessage('Vui lòng nhập số điện thoại hợp lệ (10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09)');
  //     return;
  //   }


  //   try {
  //     setLoading(true);
  //     const response = await sendOTP(phoneNumber);
  //     if (response) {
  //       console.log('otp = ', response.code);

  //       navigation.navigate(AuthGraph.VerifyOTPScreen, {
  //         phoneNumber,
  //         expired: response?.expired,
  //       });
  //     } else {
  //       Toaster.show('Không thể gửi OTP, vui lòng thử lại sau');
  //     }
  //   } catch (error) {
  //     Toaster.show('Không thể gửi OTP, vui lòng thử lại sau');
  //     console.log('error', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const backAction = () => {
      if (authState.needLogin) {

        authDispatch({
          type: AuthActionTypes.LOGIN,
          payload: { needLogin: false },
        });
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [authDispatch, authState.needLogin, navigation]);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (authState.message) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        delay: 2000,
        useNativeDriver: true,
      }).start(() => {
        authDispatch({ type: AuthActionTypes.CLEAR_MESSAGE });
      });
    }
  }, [authDispatch, authState.message, fadeAnim]);




  return (
    <Column style={styles.container}>
      <NormalLoading visible={loading} />
      {authState.message ? (
        <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
          <Icon source="information" size={20} color={colors.primary} />
          <Text style={styles.toastText}>{authState.message}</Text>
        </Animated.View>
      ) : null}

      <LightStatusBar />
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />

      <TitleText text="Chào mừng đến với" style={{ textAlign: 'center' }} />
      <TitleText text="GREEN ZONE" style={styles.title} />

      <NormalInput
        required
        value={phoneNumber}
        label="Số điện thoại"
        placeholder="Nhập số điện thoại của bạn..."
        style={styles.input}
        keyboardType='numeric'
        setValue={text => {
          setPhoneNumberMessage('');
          setPhoneNumber(text);
        }}

        invalidMessage={phoneNumberMessage}
      />

      <Pressable style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </Pressable>



    </Column>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    gap: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',

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
    shadowOffset: { width: 0, height: 2 },
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
  },
  logo: {
    width: Dimensions.get('window').width / 1.8,
    height: Dimensions.get('window').width / 1.8
  },
  input: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: colors.white
  }
});
