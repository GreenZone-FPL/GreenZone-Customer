import {useAppContext} from '../../context/appContext';
import {useNavigation} from '@react-navigation/native';
import {useAppContainer} from '../useAppContainer';
import {AppAsyncStorage} from '../../utils';
import { useAuthActions } from '../auth/useAuthActions';

export const useProductDetailContainer = () => {
  const {authDispatch, authState} = useAppContext();
  const {onNavigateLogin, onNavigateRegister} = useAuthActions();

  const navigation = useNavigation();

  const onClickAddToCart = async addToCart => {
    try {
      const isTokenValid = await AppAsyncStorage.readData(
        AppAsyncStorage.STORAGE_KEYS.accessToken,
      );

      if (isTokenValid && authState.lastName) {
        if (addToCart) addToCart();
      } else {
        onNavigateLogin();
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  return {
    onClickAddToCart,
  };
};
