import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../screens/auth/LoginScreen';

import RegisterScreen from '../../screens/auth/RegisterScreen';
import SplashScreen from '../../screens/auth/SplashScreen';
import VerifyOTPScreen from '../../screens/auth/VerifyOTPScreen';
import {
  AuthGraph,
  MainGraph
} from '../graphs';
import MainNavigation from '../MainNavigation';

const GuestStack = createNativeStackNavigator();
const GuestStackScreen = () => {
  return (
    <GuestStack.Navigator screenOptions={{ headerShown: false }}>
      <GuestStack.Screen name={AuthGraph.SplashScreen} component={SplashScreen} />
      <GuestStack.Screen
        name={MainGraph.graphName}
        component={MainNavigation}
      />
      <GuestStack.Screen name={AuthGraph.LoginScreen} component={LoginScreen} />
      <GuestStack.Screen name={AuthGraph.VerifyOTPScreen} component={VerifyOTPScreen} />


      <GuestStack.Screen name={AuthGraph.RegisterScreen} component={RegisterScreen} />

    </GuestStack.Navigator>
  );
};

export default GuestStackScreen
