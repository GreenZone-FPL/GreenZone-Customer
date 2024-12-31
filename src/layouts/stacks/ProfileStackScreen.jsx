
import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ScreenEnum from '../../constants/screenEnum';
import LoginScreen from '../../screens/auth/LoginScreen';
import ProfileScreen from '../../screens/bottom_navs/ProfileScreen';


const ProfileStack = createNativeStackNavigator()
const ProfileStackScreen = () => {

    return (

        <ProfileStack.Navigator
            name={ScreenEnum.ProfileStackScreen}
            screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name={ScreenEnum.ProfileScreen} component={ProfileScreen} />

            <ProfileStack.Screen name={ScreenEnum.LoginScreen} component={LoginScreen} />

        </ProfileStack.Navigator>

    )
}

export default ProfileStackScreen

