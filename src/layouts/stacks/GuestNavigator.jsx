import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../screens/auth/LoginScreen';

import RegisterScreen from '../../screens/auth/RegisterScreen';
import SplashScreen from '../../screens/auth/SplashScreen';
import VerifyOTPScreen from '../../screens/auth/VerifyOTPScreen';
import AddressMerchantScreen from '../../screens/address/AddressMerchantScreen';
import MapAdressScreen from '../../screens/address/MapAdressScreen';
import {
  AuthGraph,
  MainGraph,
  UserGraph
} from '../graphs';
import MainNavigation from '../MainNavigation';

const GuestStack = createNativeStackNavigator();
const GuestNavigator = () => {
  console.log('in GuestNavigator')
  return (
    <GuestStack.Navigator
      initialRouteName={AuthGraph.SplashScreen}
      screenOptions={{ headerShown: false }}>
      <GuestStack.Screen
        name={AuthGraph.SplashScreen}
        component={SplashScreen}
      />
      <GuestStack.Screen
        name={MainGraph.graphName}
        component={MainNavigation}
      />
      <GuestStack.Screen name={AuthGraph.LoginScreen} component={LoginScreen} />
      <GuestStack.Screen name={AuthGraph.VerifyOTPScreen} component={VerifyOTPScreen} />


      <GuestStack.Screen name={AuthGraph.RegisterScreen} component={RegisterScreen} />
      <GuestStack.Screen name={UserGraph.AddressMerchantScreen} component={AddressMerchantScreen} />
      <GuestStack.Screen name={UserGraph.MapAdressScreen} component={MapAdressScreen} />
    </GuestStack.Navigator>
  );
};

export default GuestNavigator
