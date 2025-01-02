/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';


import HorizontalPagerWithImages from './src/components/HorizontalPager';
import MainNavigation from './src/layouts/MainNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenEnum from './src/constants/screenEnum';
import ProductDetail from './src/screens/buy_products/VoucherScreen';
import LoginScreen from './src/screens/auth/LoginScreen';

import UpdateProfileScreen from './src/screens/auth/UpdateProfileScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';



const BaseStack = createNativeStackNavigator()
function App() {
  return (


    <SafeAreaProvider>
        <UpdateProfileScreen/>
    </SafeAreaProvider>

    // <NavigationContainer>


    //   <BaseStack.Navigator
    //     screenOptions={{ headerShown: false }}>
    //     <BaseStack.Screen name={"MainNavigation"} component={MainNavigation} />

    //     <BaseStack.Screen name={ScreenEnum.ProductDetail} component={ProductDetail} />
    //     <BaseStack.Screen name={ScreenEnum.LoginScreen} component={LoginScreen} />



    //   </BaseStack.Navigator>


    // </NavigationContainer>







  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default App;