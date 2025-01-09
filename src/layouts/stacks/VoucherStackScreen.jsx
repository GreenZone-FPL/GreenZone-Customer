
import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ScreenEnum from '../../constants/screenEnum';
import LoginScreen from '../../screens/auth/LoginScreen';
import VoucherScreen from '../../screens/bottom-navs/VoucherScreen';




const VoucherStack = createNativeStackNavigator()
const VoucherStackScreen = () => {

    return (

        <VoucherStack.Navigator
            name={ScreenEnum.VoucherStackScreen}
            screenOptions={{ headerShown: false }}>
            <VoucherStack.Screen name={ScreenEnum.VoucherScreen} component={VoucherScreen} />

            <VoucherStack.Screen name={ScreenEnum.LoginScreen} component={LoginScreen} />

        </VoucherStack.Navigator>

    )
}

export default VoucherStackScreen

