import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ProductDetailSheet } from '../../components';
import LoginScreen from '../../screens/auth/LoginScreen';
import OrderScreen from '../../screens/bottom-navs/OrderScreen';
import CheckoutScreen from '../../screens/shopping/CheckoutScreen';
import RecipientInfoSheet from '../../screens/shopping/RecipientInfoSheet';
import { AuthGraph, BottomGraph, MainGraph, ShoppingGraph } from '../graphs';

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

      <OrderStack.Screen name={AuthGraph.LoginScreen} component={LoginScreen} />
      <OrderStack.Screen
        name={ShoppingGraph.ProductDetailSheet}
        component={ProductDetailSheet}
      />
      
    

      <OrderStack.Screen
        name={ShoppingGraph.RecipientInfoSheet}
        component={RecipientInfoSheet}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />

    </OrderStack.Navigator>
  );
};

export default OrderStackScreen;
