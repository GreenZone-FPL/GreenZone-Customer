import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../screens/auth/LoginScreen';

import RegisterScreen from '../../screens/auth/RegisterScreen';
import {
  AppGraph,
  AuthGraph,
  MainGraph,
  ShoppingGraph,
  UserGraph
} from '../graphs';
import MainNavigation from '../MainNavigation';
import CheckoutScreen from '../../screens/shopping/CheckoutScreen';
import UpdateProfileScreen from '../../screens/user-profile/UpdateProfileScreen';
import MembershipScreen from '../../screens/member-ship/MemberShipScreen';
import ChatScreen from '../../screens/shopping/ChatScreen';
import AdvertisingScreen from '../../screens/notification/AdvertisingScreen';
import SearchProductScreen from '../../screens/shopping/SearchProductScreen';
import { ProductDetailSheet } from '../../components';
import FavoriteScreen from '../../screens/shopping/FavoriteScreen';
import SplashScreen from '../../screens/auth/SplashScreen';

const UserStack = createNativeStackNavigator();
const UserNavigator = () => {
  console.log('in UserNavigator')
  return (
    <UserStack.Navigator
      initialRouteName={AuthGraph.SplashScreen}
      screenOptions={{ headerShown: false }}>

      <UserStack.Screen
        name={AuthGraph.SplashScreen}
        component={SplashScreen}
      />

      <UserStack.Screen
        name={MainGraph.graphName}
        component={MainNavigation}
      />
      <UserStack.Screen
        name={ShoppingGraph.CheckoutScreen}
        component={CheckoutScreen}
      />

      <UserStack.Screen
        name={UserGraph.UpdateProfileScreen}
        component={UpdateProfileScreen}
      />

      <UserStack.Screen
        name={AuthGraph.RegisterScreen}
        component={RegisterScreen}
      />
      {/* <UserStack.Screen
        name={AuthGraph.LoginScreen}
        component={LoginScreen}
      /> */}
      <UserStack.Screen
        name={AppGraph.MembershipScreen}
        component={MembershipScreen}
      />
      <UserStack.Screen
        name={ShoppingGraph.ChatScreen}
        component={ChatScreen}
      />

      <UserStack.Screen
        name={AppGraph.AdvertisingScreen}
        component={AdvertisingScreen}
      />
      <UserStack.Screen
        name={ShoppingGraph.SearchProductScreen}
        component={SearchProductScreen}
      />
      <UserStack.Screen
        name={ShoppingGraph.ProductDetailSheet}
        component={ProductDetailSheet}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <UserStack.Screen
        name={AppGraph.FavoriteScreen}
        component={FavoriteScreen}
      />

    </UserStack.Navigator>
  );
};

export default UserNavigator
