import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAppContext } from '../../context/appContext';
import LoginScreen from '../../screens/auth/LoginScreen';
import RegisterScreen from '../../screens/auth/RegisterScreen';
import VerifyOTPScreen from '../../screens/auth/VerifyOTPScreen';
import { AuthGraph, MainGraph } from '../graphs';
import MainNavigation from '../MainNavigation';

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { authState } = useAppContext(); // Lấy trạng thái đăng nhập


  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {authState.needLogin ? (
        <>
          <AuthStack.Screen
            name={AuthGraph.LoginScreen}
            component={LoginScreen}
          />

          <AuthStack.Screen
            name={AuthGraph.VerifyOTPScreen}
            component={VerifyOTPScreen}
          />
          <AuthStack.Screen
            name={AuthGraph.RegisterScreen}
            component={RegisterScreen}
          />
        </>

      ) : (

        <AuthStack.Screen
          name={MainGraph.graphName}
          component={MainNavigation}
        />
      )}
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
