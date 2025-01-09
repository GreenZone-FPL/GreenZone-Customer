import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';
import { Icon } from 'react-native-paper';
import colors from '../constants/color';
import GLOBAL_KEYS from '../constants/globalKeys';
import ScreenEnum from '../constants/screenEnum';
import HomeStackScreen from './stacks/HomeStackScreen';
import MerchantStackScreen from './stacks/MerchantStackScreen';
import ProfileStackScreen from './stacks/ProfileStackScreen';
import VoucherStackScreen from './stacks/VoucherStackScreen';

const BottomTab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <BottomTab.Navigator
      initialRouteName={ScreenEnum.HomeStackScreen}
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

          if (route.name === ScreenEnum.HomeStackScreen) {
            iconName = focused ? 'home' : 'home-outline';
          } 
          // else if (route.name === ScreenEnum.OrderStackScreen) {
          //   iconName = focused ? 'food' : 'food-outline';
          // } 
          else if (route.name === ScreenEnum.MerchantStackScreen) {
            iconName = focused ? 'store' : 'store-outline';
          } else if (route.name === ScreenEnum.VoucherStackScreen) {
            iconName = focused ? 'gift-open' : 'gift-outline';
          } else if (route.name === ScreenEnum.ProfileStackScreen) {
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

          if (route.name === ScreenEnum.HomeStackScreen) {
            label = 'Trang chủ';
          } 
          // else if (route.name === ScreenEnum.OrderStackScreen) {
          //   label = 'Đặt hàng';
          // }
           else if (route.name === ScreenEnum.MerchantStackScreen) {
            label = 'Cửa hàng';
          } else if (route.name === ScreenEnum.VoucherStackScreen) {
            label = 'Ưu đãi';
          } else if (route.name === ScreenEnum.ProfileStackScreen) {
            label = 'Cá nhân';
          }

          return (
            <Text style={{ color: focused ? colors.primary : colors.gray700, fontSize: 12 }}>
              {label}
            </Text>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray700,
      })}>
      <BottomTab.Screen
        name={ScreenEnum.HomeStackScreen}
        component={HomeStackScreen}
      
      />
      {/* <BottomTab.Screen
        name={ScreenEnum.OrderStackScreen}
        component={OrderStackScreen}
      /> */}
      <BottomTab.Screen
        name={ScreenEnum.MerchantStackScreen}
        component={MerchantStackScreen}
      />
      <BottomTab.Screen
        name={ScreenEnum.VoucherStackScreen}
        component={VoucherStackScreen}
      />
      <BottomTab.Screen
        name={ScreenEnum.ProfileStackScreen}
        component={ProfileStackScreen}
      />
    </BottomTab.Navigator>
  );
};

export default MainNavigation;
