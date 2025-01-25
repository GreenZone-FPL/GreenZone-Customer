import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../screens/auth/LoginScreen';
import VoucherScreen from '../../screens/bottom-navs/VoucherScreen';
import MyVoucherScreen from '../../screens/voucher/MyVoucherScreen';
import {AuthGraph, BottomGraph, MainGraph, VoucherGraph} from '../graphs';

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
        name={VoucherGraph.MyVouchersScreen}
        component={MyVoucherScreen}
      />

      <VoucherStack.Screen
        name={ScreenEnum.VoucherDetailSheet}
        component={VoucherDetailSheet}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
    </VoucherStack.Navigator>
  );
};

export default VoucherStackScreen;
