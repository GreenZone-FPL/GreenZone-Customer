import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/appContext';
import { ShoppingGraph } from '../layouts/graphs';
import { AppAsyncStorage } from '../utils';
import { useAppContainer } from './useAppContainer';

export const useHomeContainer = () => {
    const { authDispatch, authState } = useAppContext()
    const { onNavigateLogin, onNavigateRegister } = useAppContainer()
    const navigation = useNavigation()

    const onNavigateProductDetailSheet = productId => {
        navigation.navigate(ShoppingGraph.ProductDetailSheet, { productId });
    }

    const onClickAddToCart = async (productId) => {
        try {

            const isTokenValid = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.accessToken)

            if (isTokenValid && authState.lastName) {
                navigation.navigate(ShoppingGraph.ProductDetailShort, {productId});}
            else {
                onNavigateLogin()
            }

        } catch (error) {
            console.log('Error', error)
        }

    }

    const handleLogin = () => {
        console.log('press')
        onNavigateLogin()

    }

    return {
        handleLogin,
        onNavigateProductDetailSheet,
        onClickAddToCart
    }
}


