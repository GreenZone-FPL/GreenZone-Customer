import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ScreenEnum} from '../../constants';
import LoginScreen from '../../screens/auth/LoginScreen';
import VoucherScreen from '../../screens/bottom-navs/VoucherScreen';
import AllVoucherScreen from '../../screens/voucher/MyVoucherScreen';
import { AuthGraph, BottomGraph, MainGraph } from '../graphs';

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

      <VoucherStack.Screen
        name={AuthGraph.LoginScreen}
        component={LoginScreen}
      />
      <VoucherStack.Screen
        name={ScreenEnum.AllVoucherScreen}
        component={AllVoucherScreen}
      />
    </VoucherStack.Navigator>
  );
};

export default VoucherStackScreen;
