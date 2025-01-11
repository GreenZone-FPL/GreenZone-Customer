import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ScreenEnum} from '../../constants';
import LoginScreen from '../../screens/auth/LoginScreen';
import VoucherScreen from '../../screens/bottom-navs/VoucherScreen';
import AllVoucherScreen from '../../screens/voucher/MyVoucherScreen';
import VoucherDetailSheet from '../../components/bottom-sheets/VoucherDetailSheet';

const VoucherStack = createNativeStackNavigator();
const VoucherStackScreen = () => {
  return (
    <VoucherStack.Navigator
      name={ScreenEnum.VoucherStackScreen}
      screenOptions={{headerShown: false}}>
      <VoucherStack.Screen
        name={ScreenEnum.VoucherScreen}
        component={VoucherScreen}
      />

      <VoucherStack.Screen
        name={ScreenEnum.LoginScreen}
        component={LoginScreen}
      />
      <VoucherStack.Screen
        name={ScreenEnum.AllVoucherScreen}
        component={AllVoucherScreen}
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
