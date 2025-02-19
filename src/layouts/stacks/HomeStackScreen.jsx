import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../../screens/bottom-navs/HomeScreen';
import {
  BottomGraph
} from '../graphs';

const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name={BottomGraph.HomeScreen} component={HomeScreen} />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
