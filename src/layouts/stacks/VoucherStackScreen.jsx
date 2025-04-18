import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import VoucherScreen from '../../screens/bottom-navs/VoucherScreen';
import SelectVouchersScreen from '../../screens/voucher/SelectVouchersScreen';
import { BottomGraph, MainGraph, VoucherGraph } from '../graphs';
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
        name={VoucherGraph.SelectVouchersScreen}
        component={SelectVouchersScreen}
      />
    </VoucherStack.Navigator>
  );
};

export default VoucherStackScreen;
