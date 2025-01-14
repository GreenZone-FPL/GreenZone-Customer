import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { MerchantDetailSheet } from '../../components';
import LoginScreen from '../../screens/auth/LoginScreen';
import MerchantScreen from '../../screens/bottom-navs/MerchantScreen';
import { AuthGraph, BottomGraph, MainGraph, ShoppingGraph } from '../graphs';

const MerchantStack = createNativeStackNavigator();
const MerchantStackScreen = () => {
  return (
    <MerchantStack.Navigator
      name={MainGraph.MerchantStackScreen}
      screenOptions={{ headerShown: false }}>
      <MerchantStack.Screen
        name={BottomGraph.MerchantScreen}
        component={MerchantScreen}
      />

      <MerchantStack.Screen
        name={AuthGraph.LoginScreen}
        component={LoginScreen}
      />

      <MerchantStack.Screen
        name={ShoppingGraph.MerchantDetailSheet}
        component={MerchantDetailSheet}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
    </MerchantStack.Navigator>
  );
};

export default MerchantStackScreen;
