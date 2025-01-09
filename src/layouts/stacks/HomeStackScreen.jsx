import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ProductDetailSheet from '../../components/bottom-sheets/ProductDetailSheet';
import DialogShippingMethod from '../../components/dialogs/DialogShippingMethod';
import ScreenEnum from '../../constants/screenEnum';
import LoginScreen from '../../screens/auth/LoginScreen';
import HomeScreen from '../../screens/bottom-navs/HomeScreen';

const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator
      name={ScreenEnum.HomeStackScreen}
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name={ScreenEnum.HomeScreen} component={HomeScreen} />

      <HomeStack.Screen name={ScreenEnum.LoginScreen} component={LoginScreen} />

      <HomeStack.Screen
        name="ProductDetailSheet"
        component={ProductDetailSheet}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="DialogShippingMethod"
        component={DialogShippingMethod}
        options={{
          animation: 'simple_push',
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
