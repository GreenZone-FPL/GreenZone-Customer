import { useEffect, useReducer } from 'react';
import { AuthActionTypes } from '../reducers';
import { useAppContext } from '../context/appContext';
import { useNavigation } from '@react-navigation/native';
import { ShoppingGraph } from '../layouts/graphs';

export const useHomeContainer = () => {
    const { authDispatch, authState } = useAppContext()
    const navigation = useNavigation()

    // const onNavigateLogin = () => {
    //     authDispatch({ type: AuthActionTypes.LOGIN, payload: { needLogin: true, needAuthen: true } })
    // }

    const onNavigateProductDetailSheet = productId => {
        navigation.navigate(ShoppingGraph.ProductDetailSheet, { productId });
    }

    const onClickAddToCart = (productId) => {
        if (authState.isLoggedIn) {
            navigation.navigate(ShoppingGraph.ProductDetailShort, {
                productId,
            });
        } else {
            onNavigateLogin()
        }
    }

    return {
        // onNavigateLogin,
        onNavigateProductDetailSheet,
        onClickAddToCart
    }
}


