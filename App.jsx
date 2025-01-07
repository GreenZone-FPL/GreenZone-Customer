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
import LoginScreen from './src/screens/auth/LoginScreen';



const BaseStack = createNativeStackNavigator()
function App() {
  return (




    <NavigationContainer>


      <BaseStack.Navigator
        screenOptions={{ headerShown: false }}>
        <BaseStack.Screen name={"MainNavigation"} component={MainNavigation} />

        <BaseStack.Screen name={ScreenEnum.LoginScreen} component={LoginScreen} />



      </BaseStack.Navigator>


    </NavigationContainer>







  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default App;