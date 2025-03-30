import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import VoucherScreen from '../../screens/bottom-navs/VoucherScreen';
import MyVoucherScreen from '../../screens/voucher/MyVoucherScreen';

import VoucherDetailSheet from '../../screens/voucher/VoucherDetailSheet';
import {AppGraph, BottomGraph, MainGraph, VoucherGraph} from '../graphs';
import MembershipScreen from '../../screens/member-ship/MemberShipScreen';
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
        name={VoucherGraph.MyVouchersScreen}
        component={MyVoucherScreen}
      />

      <VoucherStack.Screen
        name={AppGraph.VoucherDetailSheet}
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
