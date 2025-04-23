import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAppContext } from '../../context/appContext';
import LoginScreen from '../../screens/auth/LoginScreen';
import RegisterScreen from '../../screens/auth/RegisterScreen';
import VerifyOTPScreen from '../../screens/auth/VerifyOTPScreen';
import BottomTab from '../BottomTab';
import { AuthGraph, BottomGraph } from '../graphs';

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { authState } = useAppContext();


  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {authState.needRegister ? (
        <AuthStack.Screen
          name={AuthGraph.RegisterScreen}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'transparentModal',
            headerShown: false,
          }}
          component={RegisterScreen}
        />
      ) : authState.needLogin ? (
        <>
          <AuthStack.Screen
            name={AuthGraph.LoginScreen}
            component={LoginScreen}
          />
          <AuthStack.Screen
            name={AuthGraph.VerifyOTPScreen}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'transparentModal',
              headerShown: false,
            }}
            component={VerifyOTPScreen}
          />
        </>
      ) : null}

      {/* Luôn thêm MainNavigation vào AuthStack để reset() hoạt động */}
      <AuthStack.Screen name={BottomGraph.graphName} component={BottomTab} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
