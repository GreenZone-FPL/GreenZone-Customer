import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ProductDetailSheet } from '../../components';
import { ScreenEnum } from '../../constants';
import LoginScreen from '../../screens/auth/LoginScreen';
import HomeScreen from '../../screens/bottom-navs/HomeScreen';
import NotificationScreen from '../../screens/notification/NotificationScreen';


const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator
      name={ScreenEnum.HomeStackScreen}
      screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name={ScreenEnum.HomeScreen} component={HomeScreen} />

      <HomeStack.Screen name={ScreenEnum.LoginScreen} component={LoginScreen} />

      <HomeStack.Screen
        name={ScreenEnum.ProductDetailSheet}
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
