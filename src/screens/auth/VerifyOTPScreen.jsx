import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {verifyOTPAPI} from '../../axios';
import {AppGraph} from '../../layouts/graphs';
import {Toaster} from '../../utils/toaster';
import {OtpInput} from 'react-native-otp-entry';
import {colors} from '../../constants';
import {sendOTPAPI} from '../../axios';
import {Icon} from 'react-native-paper';

const VerifyOTPScreen = ({route, navigation}) => {
  const {phoneNumber} = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    handleSendOTP();
  }, [phoneNumber]);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const response = await sendOTPAPI({phoneNumber});
      if (response) {
        // setCode(response.code);
        console.log('otp = ', response.code);
      } else {
        Alert.alert('Lỗi', 'Không thể gửi OTP, vui lòng thử lại sau.');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (code.length !== 6) {
      Toaster.show('Vui lòng nhập mã OTP gồm 6 chữ số.');
      return;
    }
    try {
      const response = await verifyOTPAPI({phoneNumber, code});
      if (response.statusCode === 201) {
        Toaster.show('Đăng nhập thành công!', response.token);

        // console.log('otp = ', response.code)
        // Lưu token để dùng cho các API tiếp theo (có thể dùng AsyncStorage)
        // AsyncStorage.setItem('authToken', response.token);

        navigation.navigate(AppGraph.MAIN);
      } else {
        Toaster.show('Mã OTP không hợp lệ');
      }
    } catch (error) {
      Toaster.show(`Error: ${error}`);
      console.log('Error verifying OTP:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực OTP</Text>
      <Text style={styles.subtitle}>Nhập mã OTP gửi đến {phoneNumber}</Text>

      {/* <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={6}
                placeholder="Nhập OTP"
                value={code}
                onChangeText={setCode}
            /> */}
      <OtpInput
        focusColor={colors.primary}
        autoFocus={true}
        secureTextEntry={false}
        numberOfDigits={6}
        onTextChange={setCode}
        value={code}
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
  title: {fontSize: 28, fontWeight: 'bold', color: colors.black},
  subtitle: {fontSize: 14, color: colors.gray850},
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    width: '80%',
  },
  buttonText: {color: colors.white, fontSize: 16, textAlign: 'center'},
});

export default VerifyOTPScreen;
