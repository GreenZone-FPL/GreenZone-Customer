import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MerchantDetailSheet from '../../screens/shopping/MerchantDetailSheet'
import LoginScreen from '../../screens/auth/LoginScreen';
import MerchantScreen from '../../screens/bottom-navs/MerchantScreen';
import { AppGraph, AuthGraph, BottomGraph, MainGraph, ShoppingGraph } from '../graphs';

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

     
    </MerchantStack.Navigator>
  );
};

export default MerchantStackScreen;
