import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../screens/auth/LoginScreen';
import OrderScreen from '../../screens/bottom-navs/OrderScreen';
import {ProductDetailSheet} from '../../components';
import {AuthGraph, BottomGraph, MainGraph, ShoppingGraph} from '../graphs';
import {ScreenEnum} from '../../constants';
import MyFavoriteProducts from '../../screens/favorite/MyFavoriteProducts';
import ProductsSearch from '../../screens/search/ProductsSearch';
import ChangeRecipientInformationSheet from '../../components/bottom-sheets/ChangeRecipientInformationSheet';

const OrderStack = createNativeStackNavigator();
const OrderStackScreen = () => {
  return (
    <OrderStack.Navigator
      name={MainGraph.OrderStackScreen}
      screenOptions={{headerShown: false}}>
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
        name={ScreenEnum.MyFavoriteProducts}
        component={MyFavoriteProducts}
      />
      <OrderStack.Screen
        name={ScreenEnum.ProductsSearch}
        component={ProductsSearch}
      />

      <OrderStack.Screen
        name={ScreenEnum.ChangeRecipientInformationSheet}
        component={ChangeRecipientInformationSheet}
      />
    </OrderStack.Navigator>
  );
};

export default OrderStackScreen;
