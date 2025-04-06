import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import VoucherScreen from '../../screens/bottom-navs/VoucherScreen';
import VouchersMerchantScreen from '../../screens/voucher/VouchersMerchantScreen';
import VoucherDetailSheet from '../../screens/voucher/VoucherDetailSheet';
import {AppGraph, BottomGraph, MainGraph, VoucherGraph} from '../graphs';
import MyVouchersScreen from '../../screens/voucher/MyVouchersScreen';
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
        name={VoucherGraph.VouchersMerchantScreen}
        component={VouchersMerchantScreen}
      />

      <VoucherStack.Screen
        name={VoucherGraph.MyVouchersScreen}
        component={MyVouchersScreen}
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
