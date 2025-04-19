import { useAppContext } from '../../context/appContext';
import { AuthActionTypes } from '../../reducers';
import { AppAsyncStorage, CartManager } from '../../utils';
import { cartInitialState } from '../../reducers';
import { useNavigation } from '@react-navigation/native';
import { MainGraph } from '../../layouts/graphs';

export const useAuthActions = () => {
  const { authDispatch, cartDispatch } = useAppContext();

  const navigation = useNavigation()
  const onNavigateLogin = () => {
    authDispatch({
      type: AuthActionTypes.LOGIN,
      payload: { needLogin: true, needAuthen: true, needRegister: false },
    });
  };

  const onNavigateRegister = () => {
    authDispatch({
      type: AuthActionTypes.LOGIN,
      payload: { needLogin: false, needAuthen: true, needRegister: true },
    });
  };

  const onLogout = async () => {
    try {
      await AppAsyncStorage.clearAll();
      await CartManager.updateOrderInfo(cartDispatch, cartInitialState);
      authDispatch({
        type: AuthActionTypes.LOGOUT,
        payload: { isLoggedIn: false, lastName: null, needLogin: false, needRegister: false },
      });
      navigation.reset({
        index: 0,
        routes: [{ name: MainGraph.graphName }],
      });
    } catch (error) {
      throw error
    }

  };

  return { onNavigateLogin, onNavigateRegister, onLogout };
};
