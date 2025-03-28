import { useEffect, useReducer } from 'react';
import { AuthActionTypes } from '../reducers';
import { useAppContext } from '../context/appContext';
import { useNavigation } from '@react-navigation/native';
import { ShoppingGraph } from '../layouts/graphs';
import { useAppContainer } from './useAppContainer';
import { AppAsyncStorage } from '../utils';

export const useHomeContainer = () => {
    const { authDispatch, authState } = useAppContext()
    const { onNavigateLogin } = useAppContainer()
    const navigation = useNavigation()

  

    const onNavigateProductDetailSheet = productId => {
        navigation.navigate(ShoppingGraph.ProductDetailSheet, { productId });
    }

    const onClickAddToCart = async (productId) => {
        try {
            const isTokenValid = await AppAsyncStorage.isTokenValid()
            if (isTokenValid) {
                navigation.navigate(ShoppingGraph.ProductDetailShort, {
                    productId,
                });
            }
            else {
                onNavigateLogin()
            }
        } catch (error) {
            console.log('Error', error)
        }

    }

    return {
        // onNavigateLogin,
        onNavigateProductDetailSheet,
        onClickAddToCart
    }
}


