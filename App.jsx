import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContextProvider, AppContext } from './src/context/AppContext'; 

import {
  AppGraph,
  AuthGraph,
  MainGraph,
  ShoppingGraph,
  UserGraph
} from './src/layouts/graphs';
import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';
import MembershipScreen from './src/screens/member-ship/MemberShipScreen';
import AdvertisingScreen from './src/screens/notification/AdvertisingScreen';
import ChatScreen from './src/screens/shopping/ChatScreen';
import { ProductDetailSheet } from './src/components';
import SearchProductScreen from './src/screens/shopping/SearchProductScreen';
import CheckoutScreen from './src/screens/shopping/CheckoutScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import FavoriteScreen from './src/screens/shopping/FavoriteScreen';
import SplashScreen from './src/screens/auth/SplashScreen';
import UpdateProfileScreen from './src/screens/user-profile/UpdateProfileScreen';
import GuestNavigator from './src/layouts/stacks/GuestNavigator';
import UserNavigator from './src/layouts/stacks/UserNavigator';
const BaseStack = createNativeStackNavigator();


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
 

  useEffect(() => {
    console.log('isLoggedIn = ', isLoggedIn)
  }, [isLoggedIn ]);

  // Không cần NavigationContainer ở đây nữa, nó đã có trong App
  return isLoggedIn ? <UserNavigator /> : <GuestNavigator />;
}






// return (


//   <BaseStack.Navigator 
//   initialRouteName={AuthGraph.SplashScreen}
//   screenOptions={{ headerShown: false }}>
//     <BaseStack.Screen
//       name={AuthGraph.SplashScreen}
//       component={SplashScreen}
//     />
//     {isLoggedIn ?

//       <BaseStack.Screen
//         name={AppGraph.USER}
//         component={UserNavigator}
//       /> :

//       <BaseStack.Screen
//         name={AppGraph.GUEST}
//         component={GuestNavigator}
//       />}

//   </BaseStack.Navigator>
// );


export default App;
