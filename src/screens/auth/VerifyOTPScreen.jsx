import React, {useEffect, useState} from 'react';
import {Keyboard, StatusBar, StyleSheet, Text} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {verifyOTP} from '../../axios';
import {Column, NormalLoading, OverlayStatusBar} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {AuthActionTypes} from '../../reducers';
import {Toaster} from '../../utils';
import {useAppContext} from '../../context/appContext';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const VerifyOTPScreen = ({route}) => {
  const navigation = useNavigation();
  const {phoneNumber, expired} = route.params;
  const {authDispatch} = useAppContext();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expired) return;
    const expirationTime = new Date(expired).getTime();
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((expirationTime - now) / 1000));
    setTimeLeft(remaining);

    if (remaining === 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [expired]);

  useEffect(() => {
    if (code.length === 6) {
      Keyboard.dismiss();
      handleVerifyOTP();
    }
  }, [code]);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0',
    )}`;
  };

  const handleVerifyOTP = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await verifyOTP({phoneNumber, code});
      const userLastName = response.user?.lastName;

      if (userLastName) {
        Toaster.show('Đăng nhập thành công!');
        authDispatch({
          type: AuthActionTypes.LOGIN,
          payload: {needLogin: false, isLoggedIn: true, lastName: userLastName},
        });
      } else {
        authDispatch({
          type: AuthActionTypes.REGISTER,
          payload: {isLoggedIn: false, needLogin: false, needRegister: true},
        });
      }
    } catch (error) {
      Toaster.show(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column style={styles.container}>
      <IconButton
        icon="close"
        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        iconColor={colors.black}
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      />
      <OverlayStatusBar />
      <Column style={styles.content}>
        <NormalLoading visible={loading} />
        <Text style={styles.title}>Xác thực OTP</Text>
        <Text style={styles.subtitle}>
          Mã xác thực đã được gửi đến {phoneNumber}
        </Text>

        <OtpInput autoFocus={false} numberOfDigits={6} onTextChange={setCode} />

        {timeLeft > 0 ? (
          <Text style={styles.subtitle}>
            Mã OTP hết hạn sau {formatTime(timeLeft)}
          </Text>
        ) : (
          <Text style={[styles.subtitle, {color: 'red'}]}>OTP đã hết hạn</Text>
        )}
      </Column>
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.overlay,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: StatusBar.currentHeight,
    right: GLOBAL_KEYS.PADDING_DEFAULT,
    zIndex: 1,
    backgroundColor: colors.gray200,
  },
  content: {
    marginTop: StatusBar.height,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 20,
    flex: 1,
  },
  title: {fontSize: 28, fontWeight: 'bold', color: colors.black},
  subtitle: {fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.gray850},
});

export default VerifyOTPScreen;
