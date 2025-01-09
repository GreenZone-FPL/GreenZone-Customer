
import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ScreenEnum from '../../constants/screenEnum';
import LoginScreen from '../../screens/auth/LoginScreen';
import OrderScreen from '../../screens/bottom-navs/OrderScreen';




const OrderStack = createNativeStackNavigator()
const OrderStackScreen = () => {

    return (

        <OrderStack.Navigator
            name={ScreenEnum.OrderStackScreen}
            screenOptions={{ headerShown: false }}>
            <OrderStack.Screen name={ScreenEnum.OrderScreen} component={OrderScreen} />

            <OrderStack.Screen name={ScreenEnum.LoginScreen} component={LoginScreen} />

        </OrderStack.Navigator>

    )
}

export default OrderStackScreen

