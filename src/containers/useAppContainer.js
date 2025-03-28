import { useEffect } from 'react';
import { navigationRef } from '../../App';
import { Alert, BackHandler } from 'react-native';
import socketService from '../services/socketService';
import { useAppContext } from '../context/appContext';
import { OrderStatus } from '../constants';
import { showMessage } from 'react-native-flash-message';
import { OrderGraph, ShoppingGraph } from '../layouts/graphs';
import { useNavigation } from '@react-navigation/native';
import { AppAsyncStorage, CartManager } from '../utils';
import { AuthActionTypes, cartInitialState } from '../reducers';


export const useAppContainer = () => {
  const { updateOrderMessage, setUpdateOrderMessage, cartDispatch, authDispatch, authState } = useAppContext();

  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
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
  }, []);

  useEffect(() => {
    if (updateOrderMessage.visible) {
      const { type, icon } = OrderStatus.getMessageInfoByStatus(
        updateOrderMessage.status,
      );
      showMessage({
        message: updateOrderMessage.message,
        type,
        icon,
        duration: 4000,
        onPress: () => {
          navigation.navigate(OrderGraph.OrderDetailScreen, {
            orderId: updateOrderMessage.orderId,
          });
        },
      });
    }
  }, [updateOrderMessage.status]);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        // Khởi tạo socket
        await socketService.initialize();

        // Gọi lại tất cả các đơn hàng đã có trong activeOrders
        await socketService.rejoinOrder(data => {
          // Cập nhật trạng thái đơn hàng khi join thành công
          setUpdateOrderMessage(prev => ({
            visible: true,
            orderId: data.orderId,
            oldStatus: prev.status,
            message: data.message,
            status: data.status,
          }));
        });
      } catch (error) {
        console.error('Lỗi khi khởi tạo socket hoặc rejoin đơn hàng:', error);
      }
    };

    initializeSocket();

    return () => {
      // Ngắt kết nối socket khi component bị unmount
      socketService.disconnect();
    };
  }, []);

  const onLogout = async () => {
    // Xóa token khỏi AsyncStorage
    await AppAsyncStorage.clearAll();
    await CartManager.updateOrderInfo(
      cartDispatch,
      cartInitialState,
    );
    authDispatch({
      type: AuthActionTypes.LOGOUT,
      payload: { isLoggedIn: false },
    });

  }

  const onNavigateLogin = () => {
    authDispatch({ type: AuthActionTypes.LOGIN, payload: { needLogin: true, needAuthen: true } })
}



  return {
    onLogout,
    onNavigateLogin
  }


};
