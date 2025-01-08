import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ScreenEnum from '../../constants/screenEnum';
import LoginScreen from '../../screens/auth/LoginScreen';
import MerchantScreen from '../../screens/bottom-navs/MerchantScreen';
import MerchantDetailSheet from '../../components/bottom-sheets/MerchantDetailSheet';

const MerchantStack = createNativeStackNavigator();
const MerchantStackScreen = () => {
  return (
    <MerchantStack.Navigator
      name={ScreenEnum.MerchantStackScreen}
      screenOptions={{headerShown: false}}>
      <MerchantStack.Screen
        name={ScreenEnum.MerchantScreen}
        component={MerchantScreen}
      />

      <MerchantStack.Screen
        name={ScreenEnum.LoginScreen}
        component={LoginScreen}
      />

      <MerchantStack.Screen
        name={ScreenEnum.MerchantDetailSheet}
        component={MerchantDetailSheet}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
    </MerchantStack.Navigator>
  );
};

export default MerchantStackScreen;
