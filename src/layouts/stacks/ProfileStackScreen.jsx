import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddressScreen from '../../screens/address/AddressScreen';
import NewAddressScreen from '../../screens/address/NewAddressScreen';
import SearchAddressScreen from '../../screens/address/SearchAddressScreen';
import SelectAddressScreen from '../../screens/address/SelectAddressScreen';
import LoginScreen from '../../screens/auth/LoginScreen';
import ProfileScreen from '../../screens/bottom-navs/ProfileScreen';
import OrderDetailScreen from '../../screens/order/OrderDetailScreen';
import OrderHistoryScreen from '../../screens/order/OrderHistoryScreen';
import RatingOrderScreen from '../../screens/order/RatingOrderScreen';
import ChatScreen from '../../screens/shopping/ChatScreen';
import ContactScreen from '../../screens/user-profile/ContactScreen';
import SettingScreen from '../../screens/user-profile/SettingScreen';
import UpdateProfileScreen from '../../screens/user-profile/UpdateProfileScreen';
import {
  AuthGraph,
  BottomGraph,
  MainGraph,
  OrderGraph,
  UserGraph,
} from '../graphs';

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator
      name={MainGraph.ProfileStackScreen}
      screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen
        name={BottomGraph.ProfileScreen}
        component={ProfileScreen}
      />

      <ProfileStack.Screen
        name={AuthGraph.LoginScreen}
        component={LoginScreen}
      />

      <ProfileStack.Screen
        name={UserGraph.UpdateProfileScreen}
        component={UpdateProfileScreen}
      />

      <ProfileStack.Screen
        name={UserGraph.AddressScreen}
        component={AddressScreen}
      />

      <ProfileStack.Screen
        name={UserGraph.ContactScreen}
        component={ContactScreen}
      />

      <ProfileStack.Screen
        name={UserGraph.SettingScreen}
        component={SettingScreen}
      />

      <ProfileStack.Screen
        name={UserGraph.NewAddressScreen}
        component={NewAddressScreen}
      />
      <ProfileStack.Screen
        name={UserGraph.SearchAddressScreen}
        component={SearchAddressScreen}
      />
      <ProfileStack.Screen
        name={UserGraph.SelectAddressScreen}
        component={SelectAddressScreen}
      />
      <ProfileStack.Screen
        name={OrderGraph.RatingOrderScreen}
        component={RatingOrderScreen}
      />
      <ProfileStack.Screen
        name={OrderGraph.OrderHistoryScreen}
        component={OrderHistoryScreen}
      />

      <ProfileStack.Screen
        name={OrderGraph.OrderDetailScreen}
        component={OrderDetailScreen}
      />
      <ProfileStack.Screen
        name={OrderGraph.ChatScreen}
        component={ChatScreen}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreen;
