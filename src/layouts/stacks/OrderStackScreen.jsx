import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OrderScreen from '../../screens/bottom-navs/OrderScreen';
import { BottomGraph, MainGraph } from '../graphs';

const OrderStack = createNativeStackNavigator();
const OrderStackScreen = () => {
  return (
    <OrderStack.Navigator
      name={MainGraph.OrderStackScreen}
      screenOptions={{ headerShown: false }}>
      <OrderStack.Screen
        name={BottomGraph.OrderScreen}
        component={OrderScreen}
      />
    </OrderStack.Navigator>
  );
};

export default OrderStackScreen;
