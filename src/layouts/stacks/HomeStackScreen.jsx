import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ProductDetailSheet } from '../../components';
import LoginScreen from '../../screens/auth/LoginScreen';
import HomeScreen from '../../screens/bottom-navs/HomeScreen';
import NotificationScreen from '../../screens/notification/NotificationScreen';
import { AuthGraph, BottomGraph, ShoppingGraph } from '../graphs';



const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name={BottomGraph.HomeScreen} component={HomeScreen} />

      <HomeStack.Screen name={AuthGraph.LoginScreen} component={LoginScreen} />

      <HomeStack.Screen
        name={ShoppingGraph.ProductDetailSheet}
        component={ProductDetailSheet}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <HomeStack.Screen name={ScreenEnum.NotificationScreen} component={NotificationScreen} />
    </HomeStack.Navigator>
  );
};


export default HomeStackScreen;
