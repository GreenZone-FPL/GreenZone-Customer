import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ProductDetailSheet} from '../../components';
import LoginScreen from '../../screens/auth/LoginScreen';
import HomeScreen from '../../screens/bottom-navs/HomeScreen';
import {
  AuthGraph,
  BottomGraph,
  ShoppingGraph,
  UserGraph,
  OrderGraph,
} from '../graphs';
import ChangeRecipientInformationSheet from '../../components/bottom-sheets/ChangeRecipientInformationSheet';
import OrderCartScreen from '../../screens/order/OrderCartScreen';

const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
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
      <HomeStack.Screen
        name={OrderGraph.ChangeRecipientInformationSheet}
        component={ChangeRecipientInformationSheet}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={OrderGraph.OrderCartScreen}
        component={OrderCartScreen}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
