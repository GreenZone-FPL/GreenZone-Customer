import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MerchantScreen from '../../screens/bottom-navs/MerchantScreen';
import { BottomGraph, MainGraph } from '../graphs';

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
     
    </MerchantStack.Navigator>
  );
};

export default MerchantStackScreen;
