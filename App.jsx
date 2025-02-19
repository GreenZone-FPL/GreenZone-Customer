import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContext, AppContextProvider } from './src/context/AppContext';

import GuestNavigator from './src/layouts/stacks/GuestNavigator';
import UserNavigator from './src/layouts/stacks/UserNavigator';
const BaseStack = createNativeStackNavigator();

import { AuthGraph } from './src/layouts/graphs';
import AuthNavigator from './src/layouts/stacks/AuthNavigator';

function App() {
  return (
    <AppContextProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AppContextProvider>
  );
}

function AppNavigator() {
  const { isLoggedIn } = useContext(AppContext);
  
  
// useReducer
  useEffect(() => {
    console.log('isLoggedIn = ', isLoggedIn);
  }, [isLoggedIn]);


  return isLoggedIn ? <UserNavigator /> : <GuestNavigator />;
}




export default App;
