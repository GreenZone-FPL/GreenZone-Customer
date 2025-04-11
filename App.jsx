import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContextProvider, useAppContext } from './src/context/appContext';
import Toast from 'react-native-toast-message';
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
import CheckoutScreen from './src/screens/checkout/CheckoutScreen';
import EditCartItemScreen from './src/screens/shopping/EditCartItemScreen';
import RecipientInfoSheet from './src/screens/shopping/RecipientInfoSheet';
import AddressMerchantScreen from './src/screens/address/AddressMerchantScreen';
import MerchantScreen from './src/screens/bottom-navs/MerchantScreen';
import { PaperProvider } from 'react-native-paper';
import SelectVouchersScreen from './src/screens/voucher/SelectVouchersScreen';
import VoucherDetailSheet from './src/screens/voucher/VoucherDetailSheet';
import OrderSuccessScreen from './src/screens/shopping/OrderSuccessScreen';
import FlashMessage from 'react-native-flash-message';
import PayOsScreen from './src/screens/shopping/payment/PayOsScreen';
import Zalopayscreen from './src/screens/shopping/payment/Zalopayscreen';
import ProductDetailShort from './src/screens/shopping/ProductDetailShort';
import SeedScreen from './src/screens/voucher/SeedScreen';
import MyVouchersScreen from './src/screens/voucher/MyVouchersScreen';
import { useAppContainer } from './src/containers/useAppContainer';
import SplashScreen2 from './src/screens/auth/SplashScreen2';
import MerchantDetailSheet from './src/screens/shopping/MerchantDetailSheet';
import { LogBox } from 'react-native';
import NotificationScreen from './src/screens/notification/NotificationScreen';


LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const BaseStack = createNativeStackNavigator();
export const navigationRef = React.createRef();

export default function App() {
  return (
    <AppContextProvider>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
              <BaseStack.Navigator screenOptions={{ headerShown: false }}>
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
            <Toast />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </AppContextProvider>
  );
}

function AppNavigator() {
  const { authState } = useAppContext();
  useAppContainer();
  const slideFromBottomOption = {
    animation: 'slide_from_bottom',
    presentation: 'transparentModal',
    headerShown: false,
  };
  return (
    <BaseStack.Navigator screenOptions={{ headerShown: false }}>
      {authState.needAuthen === false ? (
        <>
          {authState.needFlash && (
            <BaseStack.Screen
              name={AuthGraph.SplashScreen2}
              component={SplashScreen2}
            />
          )}
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
            options={slideFromBottomOption}
            component={ProductDetailSheet}
          />

          <BaseStack.Screen
            name={ShoppingGraph.ProductDetailShort}
            options={slideFromBottomOption}
            component={ProductDetailShort}
          />
          <BaseStack.Screen
            name={ShoppingGraph.RecipientInfoSheet}
            options={slideFromBottomOption}
            component={RecipientInfoSheet}
          />
          <BaseStack.Screen
            name={AppGraph.NotificationScreen}
            component={NotificationScreen}
          />

          <BaseStack.Screen
            name={VoucherGraph.MyVouchersScreen}
            component={MyVouchersScreen}
          />
          <BaseStack.Screen
            name={VoucherGraph.VoucherDetailSheet}
            options={slideFromBottomOption}
            component={VoucherDetailSheet}
          />

          <BaseStack.Screen
            name={'MerchantDetailSheet'}
            options={slideFromBottomOption}
            component={MerchantDetailSheet}
          />

          <BaseStack.Screen
            name={ShoppingGraph.EditCartItemScreen}
            options={slideFromBottomOption}
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
            name={VoucherGraph.SelectVouchersScreen}
            component={SelectVouchersScreen}
          />


          <BaseStack.Screen
            name={VoucherGraph.SeedScreen}
            component={SeedScreen}
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
          <BaseStack.Screen
            name={ShoppingGraph.Zalopayscreen}
            component={Zalopayscreen}
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
