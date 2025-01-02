
import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ScreenEnum from '../../constants/screenEnum';
import HomeScreen from '../../screens/bottom_navs/HomeScreen';
import LoginScreen from '../../screens/auth/LoginScreen';
import colors from '../../constants/color';
import ProductDetailSheet from '../../components/bottom_sheets/ProductDetailSheet';


const HomeStack = createNativeStackNavigator()
const HomeStackScreen = () => {

    return (

        <HomeStack.Navigator
            name={ScreenEnum.HomeStackScreen}
            screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name={ScreenEnum.HomeScreen} component={HomeScreen} />

            <HomeStack.Screen name={ScreenEnum.LoginScreen} component={LoginScreen} />

            <HomeStack.Screen
                name="ProductDetailSheet"
                component={ProductDetailSheet}
                options={{
                    gestureEnabled: false,
                    animation: 'slide_from_bottom',
                    presentation: 'transparentModal', // Tạo modal với nền trong suốt
                    headerShown: false,
                    cardStyle: {
                        backgroundColor: colors.overlay, // Modal nền trong suốt
                    }, // Ẩn header của modal
                }}

            />
        </HomeStack.Navigator>

    )
}

export default HomeStackScreen

