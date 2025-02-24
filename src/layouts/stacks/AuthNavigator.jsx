import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../screens/auth/LoginScreen';

import RegisterScreen from '../../screens/auth/RegisterScreen';
import SplashScreen from '../../screens/auth/SplashScreen';
import VerifyOTPScreen from '../../screens/auth/VerifyOTPScreen';
import {AuthGraph} from '../graphs';
import {useAppContext} from '../../context/AppContext';

const AuthStack = createNativeStackNavigator();
const AuthNavigator = ({route}) => {
  const {authState} = useAppContext();
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      {authState.message !== 'Phiên đăng nhập hết hạn' && (
        <AuthStack.Screen
          name={AuthGraph.SplashScreen}
          component={SplashScreen}
        />
      )}

      <AuthStack.Screen name={AuthGraph.LoginScreen} component={LoginScreen} />
      <AuthStack.Screen
        name={AuthGraph.VerifyOTPScreen}
        component={VerifyOTPScreen}
      />
      <AuthStack.Screen
        name={AuthGraph.RegisterScreen}
        component={RegisterScreen}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
