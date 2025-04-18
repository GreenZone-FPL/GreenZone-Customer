import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Text} from 'react-native';
import {Icon} from 'react-native-paper';
import {colors, GLOBAL_KEYS} from '../constants';
import {MainGraph} from './graphs';
import HomeStackScreen from './stacks/HomeStackScreen';
import MerchantStackScreen from './stacks/MerchantStackScreen';
import OrderStackScreen from './stacks/OrderStackScreen';
import ProfileStackScreen from './stacks/ProfileStackScreen';
import VoucherStackScreen from './stacks/VoucherStackScreen';

const BottomTab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <BottomTab.Navigator
      initialRouteName={MainGraph.HomeStackScreen}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.white,
          maxHeight: 80,
          height: 60,
        },
        tabBarIcon: ({focused}) => {
          let iconName;

          if (route.name === MainGraph.HomeStackScreen) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === MainGraph.OrderStackScreen) {
            iconName = focused ? 'food' : 'food-outline';
          } else if (route.name === MainGraph.MerchantStackScreen) {
            iconName = focused ? 'store' : 'store-outline';
          } else if (route.name === MainGraph.VoucherStackScreen) {
            iconName = focused ? 'gift-open' : 'gift-outline';
          } else if (route.name === MainGraph.ProfileStackScreen) {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          }

          return (
            <Icon
              source={iconName}
              color={focused ? colors.primary : colors.gray700}
              size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
            />
          );
        },
        tabBarLabel: ({focused}) => {
          let label;

          if (route.name === MainGraph.HomeStackScreen) {
            label = 'Trang chủ';
          } else if (route.name === MainGraph.OrderStackScreen) {
            label = 'Đặt hàng';
          } else if (route.name === MainGraph.MerchantStackScreen) {
            label = 'Cửa hàng';
          } else if (route.name === MainGraph.VoucherStackScreen) {
            label = 'Ưu đãi';
          } else if (route.name === MainGraph.ProfileStackScreen) {
            label = 'Cá nhân';
          }

          return (
            <Text
              style={{
                color: focused ? colors.primary : colors.gray700,
                fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
              }}>
              {label}
            </Text>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray700,
      })}>
      <BottomTab.Screen
        name={MainGraph.HomeStackScreen}
        component={HomeStackScreen}
      />
      <BottomTab.Screen
        name={MainGraph.OrderStackScreen}
        component={OrderStackScreen}
      />
      <BottomTab.Screen
        name={MainGraph.MerchantStackScreen}
        component={MerchantStackScreen}
      />
      <BottomTab.Screen
        name={MainGraph.VoucherStackScreen}
        component={VoucherStackScreen}
      />
      <BottomTab.Screen
        name={MainGraph.ProfileStackScreen}
        component={ProfileStackScreen}
      />
    </BottomTab.Navigator>
  );
};

export default MainNavigation;
