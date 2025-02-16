import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  AppGraph,
  AuthGraph,
  MainGraph,
  ShoppingGraph
} from './src/layouts/graphs';
import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';
import MembershipScreen from './src/screens/member-ship/MemberShipScreen';
import AdvertisingScreen from './src/screens/notification/AdvertisingScreen';
import ChatScreen from './src/screens/shopping/ChatScreen';
import AuthStackScreen from './src/layouts/stacks/AuthStackScreen';

const BaseStack = createNativeStackNavigator();

function App() {


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
       
        <NavigationContainer>
          <BaseStack.Navigator screenOptions={{ headerShown: false }}>
          
          <BaseStack.Screen
              name={AppGraph.AUTHENTICATION}
              component={AuthStackScreen}
            />
            <BaseStack.Screen
              name={MainGraph.graphName}
              component={MainNavigation}
            />
            <BaseStack.Screen
              name={AuthGraph.LoginScreen}
              component={LoginScreen}
            />
            <BaseStack.Screen
              name={AppGraph.MembershipScreen}
              component={MembershipScreen}
            />
            <BaseStack.Screen
              name={ShoppingGraph.ChatScreen}
              component={ChatScreen}
            />
            <BaseStack.Screen
              name={AppGraph.AdvertisingScreen}
              component={AdvertisingScreen}
            />
          </BaseStack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
