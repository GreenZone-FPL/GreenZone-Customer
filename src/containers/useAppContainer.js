import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { navigationRef } from '../../App';
import { OrderStatus } from '../constants';
import { useAppContext, useAuthContext } from '../context';
import { AuthActionTypes } from '../reducers';
import socketService from '../services/socketService';
import { AppAsyncStorage } from '../utils';

export const useAppContainer = () => {
  const { updateOrderMessage, setUpdateOrderMessage } = useAppContext();
  const { authDispatch, authState } = useAuthContext();


  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      if (authState.needLogin) {

        Alert.alert('Xác nhận', 'Bạn muốn quay lại?', [
          { text: 'Đóng', style: 'cancel' },
          {
            text: 'Vẫn quay lại',
            onPress: () =>
              authDispatch({
                type: AuthActionTypes.LOGIN,
                payload: {
                  needLogin: false,
                  needRegister: false,
                  needAuthen: false,
                },
              }),
          },
        ]);
        return true;
      }

      if (authState.needRegister) {

        Alert.alert('Xác nhận', 'Quay lại sẽ hủy bỏ quá trình tạo tài khoản', [
          { text: 'Đóng', style: 'cancel' },
          {
            text: 'Vẫn quay lại',
            onPress: async () => {
              const token = await AppAsyncStorage.readData(
                AppAsyncStorage.STORAGE_KEYS.accessToken,
              );
              console.log('token', token);
              if (token) {
                await AppAsyncStorage.removeData(
                  AppAsyncStorage.STORAGE_KEYS.accessToken,
                );
                await AppAsyncStorage.removeData(
                  AppAsyncStorage.STORAGE_KEYS.refreshToken,
                );
              }
              authDispatch({
                type: AuthActionTypes.LOGIN,
                payload: {
                  needLogin: false,
                  needRegister: false,
                  needAuthen: false,
                  lastName: null,
                },
              });
            },
          },
        ]);
        return true;
      }
      if (navigationRef.current?.canGoBack()) {
        navigationRef.current.goBack();
      } else {
        Alert.alert('Thoát ứng dụng', 'Bạn có chắc chắn muốn thoát không?', [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Thoát', onPress: () => BackHandler.exitApp() },
        ]);
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [authDispatch, authState.needLogin, authState.needRegister]);

  useEffect(() => {
    if (updateOrderMessage.visible) {
      const { type, icon } = OrderStatus.getMessageInfoByStatus(
        updateOrderMessage.status,
      );

      const duration = 1500; // Thời gian hiển thị message
      showMessage({
        message: updateOrderMessage.message,
        type,
        icon,
        duration,
      });
      const timer = setTimeout(() => {
        setUpdateOrderMessage(prev => ({ ...prev, visible: false }));
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [navigation, setUpdateOrderMessage, updateOrderMessage]);




  useEffect(() => {
    const initializeSocket = async () => {
      try {
        await socketService.initialize();
        await socketService.rejoinOrder(data => {

          if (data.status != updateOrderMessage.status) {
            setUpdateOrderMessage({
              visible: true,
              orderId: data.orderId,
              message: data.message,
              status: data.status,
            });
          }
        });
      } catch (error) {
        console.error('Lỗi khi khởi tạo socket hoặc rejoin đơn hàng:', error);
      }
    };

    initializeSocket().then(r => { });
    return () => {
      socketService.disconnect();
    };
  }, [setUpdateOrderMessage]);
};
