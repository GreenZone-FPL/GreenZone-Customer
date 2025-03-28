import { useEffect, useReducer } from 'react';
import { AuthActionTypes } from '../reducers';
import { useAppContext } from '../context/appContext';
import { useNavigation } from '@react-navigation/native';
import { ShoppingGraph } from '../layouts/graphs';
import { useAppContainer } from './useAppContainer';


export const useProductDetailContainer = () => {
    const { authDispatch, authState } = useAppContext()
    const { onNavigateLogin } = useAppContainer()

    const navigation = useNavigation()

    const onClickAddToCart = (addToCart) => {
        if (authState.isLoggedIn) {
            addToCart()
        } else {
            onNavigateLogin()
        }
    }

    return {
        onClickAddToCart,
    }
}


