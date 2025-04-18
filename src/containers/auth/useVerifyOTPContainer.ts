import {useNavigation} from '@react-navigation/native';
import {useAppContext} from '../../context/appContext';
import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import {verifyOTP} from '../../axios';
import {Toaster} from '../../utils';
import {AuthActionTypes} from '../../reducers';
import { onUserLoginZego } from '../../zego/common';

export const useVerifyOTPContainer = (expired: string, phoneNumber: string) => {
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const {authDispatch} = useAppContext();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0',
    )}`;
  };

  const handleVerifyOTP = async (): Promise<void> => {
    if (loading || code.length !== 6) {
      return;
    }
    setLoading(true);
    Keyboard.dismiss();

    try {
      const response = await verifyOTP({phoneNumber, code});
      const userLastName: string | undefined = response.user?.lastName;

      if (userLastName) {
        Toaster.show('Đăng nhập thành công!');
       
        authDispatch({
          type: AuthActionTypes.LOGIN,
          payload: {needLogin: false, isLoggedIn: true, lastName: userLastName},
        });
        await onUserLoginZego(phoneNumber, userLastName, navigation)
      } else {
        authDispatch({
          type: AuthActionTypes.REGISTER,
          payload: {isLoggedIn: false, needLogin: false, needRegister: true},
        });
      }
    } catch (error: any) {
      Toaster.show(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code.length !== 6) {
      return;
    }
    Keyboard.dismiss();
    handleVerifyOTP();
  }, [code]);

  useEffect(() => {
    if (!expired) {
      return;
    }
    const expirationTime: number = new Date(expired).getTime();
    const now: number = Date.now();
    const remaining: number = Math.max(
      0,
      Math.floor((expirationTime - now) / 1000),
    );
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

  return {
    navigation,
    code,
    setCode,
    timeLeft,
    loading,
    formatTime,
    handleVerifyOTP,
  };
};
