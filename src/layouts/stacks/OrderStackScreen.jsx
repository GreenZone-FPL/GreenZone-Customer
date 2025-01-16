
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../screens/auth/LoginScreen';
import OrderScreen from '../../screens/bottom-navs/OrderScreen';
import { AuthGraph, BottomGraph, MainGraph } from '../graphs';





const OrderStack = createNativeStackNavigator()
const OrderStackScreen = () => {

    return (

        <OrderStack.Navigator
            name={MainGraph.OrderStackScreen}
            screenOptions={{ headerShown: false }}>
            <OrderStack.Screen name={BottomGraph.OrderScreen} component={OrderScreen} />

            <OrderStack.Screen name={AuthGraph.LoginScreen} component={LoginScreen} />

        </OrderStack.Navigator>

    )
}

export default OrderStackScreen

