import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import VoucherScreen from '../../screens/bottom-navs/VoucherScreen';
import { BottomGraph, MainGraph } from '../graphs';
const VoucherStack = createNativeStackNavigator();
const VoucherStackScreen = () => {
  return (
    <VoucherStack.Navigator
      name={MainGraph.VoucherStackScreen}
      screenOptions={{headerShown: false}}>
      <VoucherStack.Screen
        name={BottomGraph.VoucherScreen}
        component={VoucherScreen}
      />

    
    </VoucherStack.Navigator>
  );
};

export default VoucherStackScreen;
