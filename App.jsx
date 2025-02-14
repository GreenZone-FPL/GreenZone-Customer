import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  AppGraph,
  AuthGraph,
  MainGraph,
  ShoppingGraph
} from './src/layouts/graphs';
import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';
import MembershipScreen from './src/screens/member-ship/MemberShipScreen';
import AdvertisingScreen from './src/screens/notification/AdvertisingScreen';
import ChatScreen from './src/screens/shopping/ChatScreen';
import AuthStackScreen from './src/layouts/stacks/AuthStackScreen';
import { AppContextProvider } from './src/context/AppContext';
import FavoriteScreen from './src/screens/shopping/FavoriteScreen';
import { ProductDetailSheet } from './src/components';
import SearchProductScreen from './src/screens/shopping/SearchProductScreen';
import CheckoutScreen from './src/screens/shopping/CheckoutScreen';
const BaseStack = createNativeStackNavigator();

function App() {


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppContextProvider>
          <NavigationContainer>
            <BaseStack.Navigator screenOptions={{ headerShown: false }}>

              <BaseStack.Screen
                name={AppGraph.AUTHENTICATION}
                component={AuthStackScreen}
              />
              <BaseStack.Screen
                name={MainGraph.graphName}
                component={MainNavigation}
              />


              <BaseStack.Screen
                name={ShoppingGraph.CheckoutScreen}
                component={CheckoutScreen}
              />

              <BaseStack.Screen
                name={AuthGraph.LoginScreen}
                component={LoginScreen}
              />
              <BaseStack.Screen
                name={AppGraph.MembershipScreen}
                component={MembershipScreen}
              />
              <BaseStack.Screen
                name={ShoppingGraph.ChatScreen}
                component={ChatScreen}
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
                name={ShoppingGraph.ProductDetailSheet}
                component={ProductDetailSheet}
                options={{
                  animation: 'slide_from_bottom',
                  presentation: 'transparentModal',
                  headerShown: false,
                }}
              />
              <BaseStack.Screen
                name={AppGraph.FavoriteScreen}
                component={FavoriteScreen}
              />


            </BaseStack.Navigator>
          </NavigationContainer>
        </AppContextProvider>

      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
