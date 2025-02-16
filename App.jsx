import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContextProvider, AppContext } from './src/context/AppContext'; // Đảm bảo import đúng

import {
  AppGraph,
  AuthGraph,
  MainGraph,
  ShoppingGraph,
  UserGraph
} from './src/layouts/graphs';
import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';
import MembershipScreen from './src/screens/member-ship/MemberShipScreen';
import AdvertisingScreen from './src/screens/notification/AdvertisingScreen';
import ChatScreen from './src/screens/shopping/ChatScreen';
import AuthStackScreen from './src/layouts/stacks/AuthStackScreen';
import { ProductDetailSheet } from './src/components';
import SearchProductScreen from './src/screens/shopping/SearchProductScreen';
import CheckoutScreen from './src/screens/shopping/CheckoutScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import GuestStackScreen from './src/layouts/stacks/GuestStackScreen';
import FavoriteScreen from './src/screens/shopping/FavoriteScreen';
import SplashScreen from './src/screens/auth/SplashScreen';
import UpdateProfileScreen from './src/screens/user-profile/UpdateProfileScreen';

const BaseStack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <AppContextProvider>
          <NavigationContainer>
            <AppInner />
          </NavigationContainer>
        </AppContextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppInner() {
  const { isLoggedIn } = useContext(AppContext);


  useEffect(() => {

    console.log('isLoggedIn đã thay đổi:', isLoggedIn);


  }, [isLoggedIn]);
  return (
    <>
      {isLoggedIn ?
        <BaseStack.Navigator
          screenOptions={{ headerShown: false }}>

          <BaseStack.Screen
            name={AuthGraph.SplashScreen}
            component={SplashScreen}
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
            name={UserGraph.UpdateProfileScreen}
            component={UpdateProfileScreen}
          />

          <BaseStack.Screen
            name={AuthGraph.RegisterScreen}
            component={RegisterScreen}
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
        :
        <BaseStack.Navigator screenOptions={{ headerShown: false }}>
          <BaseStack.Screen
            name={AppGraph.GUEST}
            component={GuestStackScreen}
          />
        </BaseStack.Navigator>

      }

    </>


  );
}

export default App;
