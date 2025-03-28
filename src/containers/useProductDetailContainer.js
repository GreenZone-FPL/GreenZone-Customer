import { useEffect, useReducer } from 'react';
import { AuthActionTypes } from '../reducers';
import { useAppContext } from '../context/appContext';
import { useNavigation } from '@react-navigation/native';
import { ShoppingGraph } from '../layouts/graphs';
import { useAppContainer } from './useAppContainer';
import { AppAsyncStorage } from '../utils';


export const useProductDetailContainer = () => {
    const { authDispatch, authState } = useAppContext()
    const { onNavigateLogin } = useAppContainer()

    const navigation = useNavigation()

    const onClickAddToCart = async (addToCart) => {
        try {
            const isTokenValid = await AppAsyncStorage.isTokenValid()
            if (isTokenValid) {
                addToCart()
            }
            else {
                onNavigateLogin()
            }
        } catch (error) {
            console.log('Error', error)
        }

    }




    return {
        onClickAddToCart,
    }
}


