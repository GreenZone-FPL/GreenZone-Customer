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
import {ScreenEnum} from './src/constants';
import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';
import MembershipCard from './src/screens/member-ship/MemberShipCard';
import CheckoutScreen from './src/screens/order/CheckoutScreen';
import OrderDetailScreen from './src/screens/order/OrderDetailScreen';
import OrderHistoryScreen from './src/screens/order/OrderHistoryScreen';

const BaseStack = createNativeStackNavigator();
function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BaseStack.Navigator screenOptions={{headerShown: false}}>
          <BaseStack.Screen
            name={ScreenEnum.MainNavigation}
            component={MainNavigation}
          />

          <BaseStack.Screen
            name={ScreenEnum.LoginScreen}
            component={LoginScreen}
          />

          <BaseStack.Screen
            name={ScreenEnum.OrderHistoryScreen}
            component={OrderHistoryScreen}
          />
          <BaseStack.Screen
            name={ScreenEnum.MembershipCard}
            component={MembershipCard}
          />

          <BaseStack.Screen
            name={ScreenEnum.CheckoutScreen}
            component={CheckoutScreen}
          />
          <BaseStack.Screen
            name={ScreenEnum.OrderDetailScreen}
            component={OrderDetailScreen}
          />
        </BaseStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
