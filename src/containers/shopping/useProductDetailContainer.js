import { useAuthContext } from '../../context';
import { useAuthActions } from '../auth/useAuthActions';

export const useProductDetailContainer = () => {
  const {authState} = useAuthContext();
  const {onNavigateLogin} = useAuthActions();

  const onClickAddToCart = async addToCart => {
    try {
      if (authState.lastName) {
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
