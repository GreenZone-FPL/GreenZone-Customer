import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ScreenEnum } from '../../constants';
import LoginScreen from '../../screens/auth/LoginScreen';
import ProfileScreen from '../../screens/bottom-navs/ProfileScreen';
import AddressScreen from '../../screens/user_profile/AddressScreen';
import NewAddressScreen from '../../screens/user_profile/NewAddressScreen';
import SearchAddressScreen from '../../screens/user_profile/SearchAddressScreen';
import SelectAddressScreen from '../../screens/user_profile/SelectAddressScreen';
import UpdateProfileScreen from '../../screens/user_profile/UpdateProfileScreen';
import ContactScreen from '../../screens/user_profile/ContactScreen';

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator
      name={ScreenEnum.ProfileStackScreen}
      screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen
        name={ScreenEnum.ProfileScreen}
        component={ProfileScreen}
      />

      <ProfileStack.Screen
        name={ScreenEnum.LoginScreen}
        component={LoginScreen}
      />

      <ProfileStack.Screen
        name={ScreenEnum.UpdateProfileScreen}
        component={UpdateProfileScreen}
      />

      <ProfileStack.Screen
        name={ScreenEnum.AddressScreen}
        component={AddressScreen}
      />

      <ProfileStack.Screen
        name={ScreenEnum.ContactScreen}
        component={ContactScreen}
      />



      <ProfileStack.Screen
        name={ScreenEnum.NewAddressScreen}
        component={NewAddressScreen}
      />
      <ProfileStack.Screen
        name={ScreenEnum.SearchAddressScreen}
        component={SearchAddressScreen}
      />
      <ProfileStack.Screen
        name={ScreenEnum.SelectAddressScreen}
        component={SelectAddressScreen}
      />


    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreen;
