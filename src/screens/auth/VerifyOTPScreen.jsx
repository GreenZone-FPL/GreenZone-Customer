import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { verifyOTP } from '../../axios';
import { NormalLoading } from '../../components';
import { colors } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { AuthGraph, MainGraph } from '../../layouts/graphs';
import { AuthActionTypes } from '../../reducers';
import { Toaster } from '../../utils/toaster';
import socketService from '../../services/socketService';

const VerifyOTPScreen = ({ route, navigation }) => {
  const { authDispatch } = useAppContext();
  const { phoneNumber } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (code.length !== 6) {
      Toaster.show('Vui lòng nhập mã OTP gồm 6 chữ số.');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTP({ phoneNumber, code });


      const userLastName = response.user.lastName;
      console.log('✅ OTP Verified, userLastName = ', response.user?.lastName);
      if (userLastName) {
        Toaster.show('Đăng nhập thành công!');
        await socketService.initialize();
        authDispatch({
          type: AuthActionTypes.LOGIN,
          payload: { needLogin: false, isLoggedIn: true, needRegister: false, lastName: userLastName },
        });


      } else {
        authDispatch({
          type: AuthActionTypes.REGISTER,
          payload: { isLoggedIn: false, needLogin: false, needRegister: true }
        });

      }
    } catch (error) {
      Toaster.show(`Error: ${error}`);
      console.log('Error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NormalLoading visible={loading} />
      <Text style={styles.title}>Xác thực OTP</Text>
      <Text style={styles.subtitle}>Nhập mã OTP gửi đến {phoneNumber}</Text>

      <OtpInput
        focusColor={colors.primary}
        autoFocus={true}
        secureTextEntry={false}
        numberOfDigits={6}
        onTextChange={setCode}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.fbBg,
    gap: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.black },
  subtitle: { fontSize: 14, color: colors.gray850 },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    width: '80%',
  },
  buttonText: { color: colors.white, fontSize: 16, textAlign: 'center' },
});

export default VerifyOTPScreen;
