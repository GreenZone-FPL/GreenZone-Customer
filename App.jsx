import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { LogBox } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import 'react-native-reanimated';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useAppContainer } from './src/containers/useAppContainer';
import { AppContextProvider, AuthProvider, CartProvider, ProductProvider, useAuthContext } from './src/context';
import {
  AppGraph
} from './src/layouts/graphs';
import AuthNavigator from './src/layouts/stacks/AuthNavigator';
import MainNavigator from './src/layouts/stacks/MainNavigator';
import ZegoCallUI from './src/zego/ZegoCallUI';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const BaseStack = createNativeStackNavigator();
export const navigationRef = React.createRef();

export default function App() {
  return (
    <AppContextProvider>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <PaperProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaProvider>
                  <AppNavigator />
                  <FlashMessage position="top" />
                  <Toast />
                </SafeAreaProvider>
              </GestureHandlerRootView>
            </PaperProvider>
          </ProductProvider>

        </CartProvider>

      </AuthProvider>



    </AppContextProvider>
  );
}
function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigator />
      <ZegoCallUI />
    </NavigationContainer>
  );
}

function RootNavigator() {
  const { authState } = useAuthContext();

  useAppContainer();

  return (
    <BaseStack.Navigator screenOptions={{ headerShown: false }}>
      {authState.needAuthen === false ?
        <BaseStack.Screen
          name={AppGraph.MAIN}
          component={MainNavigator}
        />

        :
        <BaseStack.Screen
          name={AppGraph.AUTHENTICATION}
          component={AuthNavigator}
        />
      }

    </BaseStack.Navigator>
  );
}
