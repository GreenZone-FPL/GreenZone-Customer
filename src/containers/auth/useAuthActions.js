import { useNavigation } from '@react-navigation/native';
import { useAuthContext, useCartContext } from '../../context';
import { BottomGraph } from '../../layouts/graphs';
import { AuthActionTypes, cartInitialState } from '../../reducers';
import { AppAsyncStorage, CartManager } from '../../utils';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn'
export const useAuthActions = () => {
  const { authDispatch } = useAuthContext();
  const { cartDispatch } = useCartContext();

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
      await ZegoUIKitPrebuiltCallService.uninit();
      authDispatch({
        type: AuthActionTypes.LOGOUT,
        payload: { isLoggedIn: false, lastName: null, needLogin: false, needRegister: false },
      });
      navigation.reset({
        index: 0,
        routes: [{ name: BottomGraph.graphName }],
      });
    } catch (error) {
      throw error
    }

  };

  return { onNavigateLogin, onNavigateRegister, onLogout };
};
