import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useReducer} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppContextProvider, useAppContext} from './src/context/appContext';

import {
  AppGraph,
  AuthGraph,
  BottomGraph,
  MainGraph,
  OrderGraph,
  ShoppingGraph,
  UserGraph,
  VoucherGraph,
} from './src/layouts/graphs';
import MainNavigation from './src/layouts/MainNavigation';
import AuthNavigator from './src/layouts/stacks/AuthNavigator';
import AddressScreen from './src/screens/address/AddressScreen';
import MapAdressScreen from './src/screens/address/MapAdressScreen';
import NewAddressScreen from './src/screens/address/NewAddressScreen';
import SelectAddressScreen from './src/screens/address/SelectAddressScreen';
import MembershipScreen from './src/screens/member-ship/MemberShipScreen';
import AdvertisingScreen from './src/screens/notification/AdvertisingScreen';
import ConfirmDeliveryTimeScreen from './src/screens/order/ConfirmDeliveryTimeScreen';
import OrderDetailScreen from './src/screens/order/OrderDetailScreen';
import OrderHistoryScreen from './src/screens/order/OrderHistoryScreen';
import RatingOrderScreen from './src/screens/order/RatingOrderScreen';
import ChatScreen from './src/screens/shopping/ChatScreen';
import FavoriteScreen from './src/screens/shopping/FavoriteScreen';
import ProductDetailSheet from './src/screens/shopping/ProductDetailSheet';
import SearchProductScreen from './src/screens/shopping/SearchProductScreen';
import ContactScreen from './src/screens/user-profile/ContactScreen';
import SettingScreen from './src/screens/user-profile/SettingScreen';
import UpdateProfileScreen from './src/screens/user-profile/UpdateProfileScreen';
import CheckoutScreen from './src/screens/shopping/CheckoutScreen';
import EditCartItemScreen from './src/screens/shopping/EditCartItemScreen';
import RecipientInfoSheet from './src/screens/shopping/RecipientInfoSheet';
import AddressMerchantScreen from './src/screens/address/AddressMerchantScreen';
import MyVoucherScreen from './src/screens/voucher/MyVoucherScreen';
import MerchantScreen from './src/screens/bottom-navs/MerchantScreen';
import {PaperProvider} from 'react-native-paper';
import SplashScreen2 from './src/screens/auth/SplashScreen2';
import VoucherDetailSheet from './src/screens/voucher/VoucherDetailSheet';
import OrderSuccessScreen from './src/screens/shopping/OrderSuccessScreen';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {OrderStatus} from './src/constants';
import socketService from './src/services/socketService';

import PayOsScreen from './src/screens/shopping/payment/PayOsScreen';
import ProductDetailShort from './src/screens/shopping/ProductDetailShort';
import LoginScreenFake from './src/screens/auth/LoginScreenFake';

const BaseStack = createNativeStackNavigator();

export default function App() {
  return (
    <AppContextProvider>
      <PaperProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <SafeAreaProvider>
            <NavigationContainer>
              <BaseStack.Navigator screenOptions={{headerShown: false}}>
                <BaseStack.Screen
                  name="AppNavigator"
                  component={AppNavigator}
                />
                <BaseStack.Screen
                  name={OrderGraph.OrderDetailScreen}
                  component={OrderDetailScreen}
                />
              </BaseStack.Navigator>
            </NavigationContainer>
            <FlashMessage position="top" />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </AppContextProvider>
  );
}

function AppNavigator({navigation}) {
  const {authState, updateOrderMessage, setUpdateOrderMessage} =
    useAppContext();

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

    // Gọi hàm khởi tạo khi app khởi động
    initializeSocket();

    return () => {
      // Ngắt kết nối socket khi component bị unmount
      socketService.disconnect();
    };
  }, [updateOrderMessage]);

  useEffect(() => {
    if (updateOrderMessage.visible) {
      const {type, icon} = OrderStatus.getMessageInfoByStatus(
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

  return (
    <BaseStack.Navigator screenOptions={{headerShown: false}}>
      {authState.needAuthen === false ? (
        <>
          {authState.needFlash && (
            <BaseStack.Screen
              name={AuthGraph.SplashScreen2}
              component={SplashScreen2}
            />
          )}
          {/* <BaseStack.Screen name={AuthGraph.SplashScreen2} component={SplashScreen2} /> */}
          <BaseStack.Screen
            name={MainGraph.graphName}
            component={MainNavigation}
          />
          <BaseStack.Screen
            name={AppGraph.MembershipScreen}
            component={MembershipScreen}
          />
          <BaseStack.Screen
            name={ShoppingGraph.ProductDetailSheet}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'transparentModal',
              headerShown: false,
            }}
            component={ProductDetailSheet}
          />

          <BaseStack.Screen
            name={ShoppingGraph.ProductDetailShort}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'transparentModal',
              headerShown: false,
            }}
            component={ProductDetailShort}
          />
          <BaseStack.Screen
            name={ShoppingGraph.RecipientInfoSheet}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'transparentModal',
              headerShown: false,
            }}
            component={RecipientInfoSheet}
          />

          <BaseStack.Screen
            name={VoucherGraph.VoucherDetailSheet}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'transparentModal',
              headerShown: false,
            }}
            component={VoucherDetailSheet}
          />

          <BaseStack.Screen
            name={ShoppingGraph.EditCartItemScreen}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'transparentModal',
              headerShown: false,
            }}
            component={EditCartItemScreen}
          />
          <BaseStack.Screen
            name={ShoppingGraph.ChatScreen}
            component={ChatScreen}
          />
          <BaseStack.Screen
            name={ShoppingGraph.OrderSuccessScreen}
            component={OrderSuccessScreen}
          />
          <BaseStack.Screen
            name={BottomGraph.MerchantScreen}
            component={MerchantScreen}
          />
          <BaseStack.Screen
            name={VoucherGraph.MyVouchersScreen}
            component={MyVoucherScreen}
          />
          <BaseStack.Screen
            name={UserGraph.AddressMerchantScreen}
            component={AddressMerchantScreen}
          />
          <BaseStack.Screen
            name={ShoppingGraph.CheckoutScreen}
            component={CheckoutScreen}
          />
          <BaseStack.Screen
            name={AppGraph.FavoriteScreen}
            component={FavoriteScreen}
          />
          <BaseStack.Screen
            name={AppGraph.AdvertisingScreen}
            component={AdvertisingScreen}
          />
          <BaseStack.Screen
            name={ShoppingGraph.SearchProductScreen}
            component={SearchProductScreen}
          />
          <BaseStack.Screen
            name={AppGraph.UpdateProfileScreen}
            component={UpdateProfileScreen}
          />
          <BaseStack.Screen
            name={UserGraph.AddressScreen}
            component={AddressScreen}
          />
          <BaseStack.Screen
            name={UserGraph.NewAddressScreen}
            component={NewAddressScreen}
          />
          <BaseStack.Screen
            name={UserGraph.MapAdressScreen}
            component={MapAdressScreen}
          />
          <BaseStack.Screen
            name={UserGraph.SelectAddressScreen}
            component={SelectAddressScreen}
          />
          <BaseStack.Screen
            name={UserGraph.SettingScreen}
            component={SettingScreen}
          />
          <BaseStack.Screen
            name={UserGraph.ContactScreen}
            component={ContactScreen}
          />
          <BaseStack.Screen
            name={OrderGraph.OrderHistoryScreen}
            component={OrderHistoryScreen}
          />
          <BaseStack.Screen
            name={OrderGraph.OrderDetailScreen}
            component={OrderDetailScreen}
          />
          <BaseStack.Screen
            name={OrderGraph.RatingOrderScreen}
            component={RatingOrderScreen}
          />
          <BaseStack.Screen
            name={ShoppingGraph.ConfirmDeliveryTimeScreen}
            component={ConfirmDeliveryTimeScreen}
          />
          <BaseStack.Screen
            name={ShoppingGraph.PayOsScreen}
            component={PayOsScreen}
          />
        </>
      ) : (
        <BaseStack.Screen
          name={AuthGraph.graphName}
          component={AuthNavigator}
        />
      )}
    </BaseStack.Navigator>
  );
}
