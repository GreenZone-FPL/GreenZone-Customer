/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  AppGraph,
  AuthGraph,
  MainGraph,
  OrderGraph,
  ShoppingGraph,
} from './src/layouts/graphs';
import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';
import MembershipScreen from './src/screens/member-ship/MemberShipScreen';
import CheckoutScreen from './src/screens/order/CheckoutScreen';
import OrderCartScreen from './src/screens/order/OrderCartScreen';
import AddressScreen from './src/screens/address/AddressScreen';
import AdvertisingScreen from './src/screens/notification/AdvertisingScreen';

const BaseStack = createNativeStackNavigator();
function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BaseStack.Navigator screenOptions={{headerShown: false}}>
          <BaseStack.Screen
            name={MainGraph.graphName}
            component={MainNavigation}
          />

          <BaseStack.Screen
            name={AuthGraph.LoginScreen}
            component={LoginScreen}
          />

          <BaseStack.Screen
            name={ShoppingGraph.CheckoutScreen}
            component={CheckoutScreen}
          />

          <BaseStack.Screen
            name={AppGraph.MembershipScreen}
            component={MembershipScreen}
          />
          <BaseStack.Screen
            name={AppGraph.AdvertisingScreen}
            component={AdvertisingScreen}
          />
        </BaseStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
