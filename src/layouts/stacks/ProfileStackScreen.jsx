import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddressScreen from '../../screens/address/AddressScreen';
import NewAddressScreen from '../../screens/address/NewAddressScreen';
import SearchAddressScreen from '../../screens/address/SearchAddressScreen';
import SelectAddressScreen from '../../screens/address/SelectAddressScreen';
import LoginScreen from '../../screens/auth/LoginScreen';
import ProfileScreen from '../../screens/bottom-navs/ProfileScreen';
import ContactScreen from '../../screens/user-profile/ContactScreen';
import UpdateProfileScreen from '../../screens/user-profile/UpdateProfileScreen';
import RatingOrderScreen from '../../screens/order/RatingOrderScreen';
import { AuthGraph, BottomGraph, MainGraph, UserGraph, OrderGraph } from '../graphs';

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


    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreen;
