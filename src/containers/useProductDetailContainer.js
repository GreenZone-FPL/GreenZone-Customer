import { useEffect, useReducer } from 'react';
import { AuthActionTypes } from '../reducers';
import { useAppContext } from '../context/appContext';
import { useNavigation } from '@react-navigation/native';
import { ShoppingGraph } from '../layouts/graphs';
import { useAppContainer } from './useAppContainer';
import { AppAsyncStorage } from '../utils';


export const useProductDetailContainer = () => {
    const { authDispatch, authState } = useAppContext()
    const { onNavigateLogin, onNavigateRegister} = useAppContainer()

    const navigation = useNavigation()

    const onClickAddToCart = async (addToCart) => {
        try {
            const isTokenValid = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.accessToken)

            if (isTokenValid && authState.lastName) {
                addToCart()
            }
            else if(isTokenValid && !authState.lastName) {
                onNavigateRegister()
            }else{
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


