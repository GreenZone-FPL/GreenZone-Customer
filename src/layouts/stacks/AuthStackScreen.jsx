import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../screens/auth/LoginScreen';

import {
  AuthGraph
} from '../graphs';
import SplashScreen from '../../screens/auth/SplashScreen';
import SendOTPScreen from '../../screens/auth/SendOTPScreen';
import VerifyOTPScreen from '../../screens/auth/VerifyOTPScreen';

const AuthStack = createNativeStackNavigator();
const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name={AuthGraph.LoginScreen} component={LoginScreen} />
      <AuthStack.Screen name={AuthGraph.VerifyOTPScreen} component={VerifyOTPScreen} />
      <AuthStack.Screen name={AuthGraph.SendOTPScreen} component={SendOTPScreen} />
      <AuthStack.Screen name={AuthGraph.SplashScreen} component={SplashScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthStackScreen;
