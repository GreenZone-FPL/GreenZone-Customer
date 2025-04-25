import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoUIKitPrebuiltCallWaitingScreen,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import React from 'react';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {
  AppGraph, AuthGraph,
  BottomGraph, OrderGraph,
  ShoppingGraph,
  UserGraph,
  VoucherGraph
} from '../graphs';

import AddressMerchantScreen from '../../screens/address/AddressMerchantScreen';
import AddressScreen from '../../screens/address/AddressScreen';
import MapAdressScreen from '../../screens/address/MapAdressScreen';
import NewAddressScreen from '../../screens/address/NewAddressScreen';
import SelectAddressScreen from '../../screens/address/SelectAddressScreen';
import SplashScreen2 from '../../screens/auth/SplashScreen2';
import MerchantScreen from '../../screens/bottom-navs/MerchantScreen';
import AIChatScreen from '../../screens/chat/AIChatScreen';
import CheckoutScreen from '../../screens/checkout/CheckoutScreen';
import MembershipScreen from '../../screens/member-ship/MemberShipScreen';
import AdvertisingScreen from '../../screens/notification/AdvertisingScreen';
import NotificationScreen from '../../screens/notification/NotificationScreen';
import BottomTab from '../BottomTab';

import { useAuthContext } from '../../context';
import OrderDetailScreen from '../../screens/order/OrderDetailScreen';
import OrderHistoryScreen from '../../screens/order/OrderHistoryScreen';
import RatingOrderScreen from '../../screens/order/RatingOrderScreen';
import ChatScreen from '../../screens/shopping/ChatScreen';
import EditCartItemScreen from '../../screens/shopping/EditCartItemScreen';
import FavoriteScreen from '../../screens/shopping/FavoriteScreen';
import MerchantDetailSheet from '../../screens/shopping/MerchantDetailSheet';

import PayOsScreen from '../../screens/shopping/payment/PayOsScreen';
import ZalopayScreen from '../../screens/shopping/payment/Zalopayscreen';
import ProductDetailSheet from '../../screens/shopping/ProductDetailSheet';
import ProductDetailShort from '../../screens/shopping/ProductDetailShort';
import RecipientInfoSheet from '../../screens/shopping/RecipientInfoSheet';
import SearchProductScreen from '../../screens/shopping/SearchProductScreen';
import ContactScreen from '../../screens/user-profile/ContactScreen';
import MyFlatList from '../../screens/user-profile/MyFlatList';
import SettingScreen from '../../screens/user-profile/SettingScreen';
import UpdateProfileScreen from '../../screens/user-profile/UpdateProfileScreen';
import MyVouchersScreen from '../../screens/voucher/MyVouchersScreen';
import SeedScreen from '../../screens/voucher/SeedScreen';
import SelectVouchersScreen from '../../screens/voucher/SelectVouchersScreen';
import VoucherDetailSheet from '../../screens/voucher/VoucherDetailSheet';
import ShippingMethodScreen from '../../screens/shopping/ShippingMethodScreen';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const MainStack = createNativeStackNavigator();

const slideFromBottomOption = {
  animation: 'slide_from_bottom',
  presentation: 'transparentModal',
  headerShown: false,
};

const slideFromRightOption = {
  animation: 'slide_from_right',
  presentation: 'transparentModal',
  headerShown: false
}
function MainNavigator() {
  const { authState } = useAuthContext();
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>

      {authState.needFlash && (
        <MainStack.Screen
          name={AuthGraph.SplashScreen2}
          component={SplashScreen2}
        />
      )}
      <MainStack.Screen
        name={BottomGraph.graphName}
        component={BottomTab}
      />

      <MainStack.Screen
        options={{ headerShown: false }}
        // DO NOT change the name 
        name="ZegoUIKitPrebuiltCallWaitingScreen"
        component={ZegoUIKitPrebuiltCallWaitingScreen}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        // DO NOT change the name
        name="ZegoUIKitPrebuiltCallInCallScreen"
        component={ZegoUIKitPrebuiltCallInCallScreen}
      />

      <MainStack.Screen
        name={OrderGraph.OrderHistoryScreen}
        component={OrderHistoryScreen}
      />

      <MainStack.Screen
        name={AppGraph.AIChatScreen}
        options={slideFromRightOption}
        component={AIChatScreen}
      />
      <MainStack.Screen name={'MyFlatList'} component={MyFlatList} />
      <MainStack.Screen
        name={AppGraph.MembershipScreen}
        component={MembershipScreen}
      />
      <MainStack.Screen
        name={ShoppingGraph.ProductDetailSheet}
        options={slideFromRightOption}
        component={ProductDetailSheet}
      />
      <MainStack.Screen
        name={ShoppingGraph.ProductDetailShort}
        options={slideFromRightOption}
        component={ProductDetailShort}
      />
      <MainStack.Screen
        name={ShoppingGraph.RecipientInfoSheet}
        options={slideFromBottomOption}
        component={RecipientInfoSheet}
      />
      <MainStack.Screen
        name={AppGraph.NotificationScreen}
        component={NotificationScreen}
      />

      <MainStack.Screen
        name={VoucherGraph.MyVouchersScreen}
        component={MyVouchersScreen}
      />
      <MainStack.Screen
        name={VoucherGraph.VoucherDetailSheet}
        options={slideFromRightOption}
        component={VoucherDetailSheet}
      />

      <MainStack.Screen
        name={'MerchantDetailSheet'}
        options={slideFromRightOption}
        component={MerchantDetailSheet}
      />

      <MainStack.Screen
        name={ShoppingGraph.EditCartItemScreen}
        options={slideFromRightOption}
        component={EditCartItemScreen}
      />
      <MainStack.Screen
        name={ShoppingGraph.ChatScreen}
        component={ChatScreen}
      />

      <MainStack.Screen
        name={BottomGraph.MerchantScreen}
        component={MerchantScreen}
      />

      <MainStack.Screen
        name={'ShippingMethodScreen'}
        component={ShippingMethodScreen}
      />
      <MainStack.Screen
        name={VoucherGraph.SelectVouchersScreen}
        component={SelectVouchersScreen}
      />

      <MainStack.Screen
        name={VoucherGraph.SeedScreen}
        component={SeedScreen}
      />
      <MainStack.Screen
        name={UserGraph.AddressMerchantScreen}
        component={AddressMerchantScreen}
      />
      <MainStack.Screen
        name={ShoppingGraph.CheckoutScreen}
        component={CheckoutScreen}
      />
      <MainStack.Screen
        name={AppGraph.FavoriteScreen}
        component={FavoriteScreen}
      />
      <MainStack.Screen
        name={AppGraph.AdvertisingScreen}
        component={AdvertisingScreen}
      />
      <MainStack.Screen
        name={ShoppingGraph.SearchProductScreen}
        component={SearchProductScreen}
      />
      <MainStack.Screen
        name={AppGraph.UpdateProfileScreen}
        component={UpdateProfileScreen}
      />
      <MainStack.Screen
        name={UserGraph.AddressScreen}
        component={AddressScreen}
      />
      <MainStack.Screen
        name={UserGraph.NewAddressScreen}
        component={NewAddressScreen}
      />
      <MainStack.Screen
        name={UserGraph.MapAdressScreen}
        component={MapAdressScreen}
      />
      <MainStack.Screen
        name={UserGraph.SelectAddressScreen}
        component={SelectAddressScreen}
      />
      <MainStack.Screen
        name={UserGraph.SettingScreen}
        component={SettingScreen}
      />
      <MainStack.Screen
        name={UserGraph.ContactScreen}
        component={ContactScreen}
      />

      <MainStack.Screen
        name={OrderGraph.OrderDetailScreen}
        component={OrderDetailScreen}
      />
      <MainStack.Screen
        name={OrderGraph.RatingOrderScreen}
        component={RatingOrderScreen}
      />

      <MainStack.Screen
        name={ShoppingGraph.PayOsScreen}
        component={PayOsScreen}
      />
      <MainStack.Screen
        name={ShoppingGraph.Zalopayscreen}
        component={ZalopayScreen}
      />


    </MainStack.Navigator>
  );
}

export default MainNavigator
