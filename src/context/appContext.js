import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {AppAsyncStorage} from '../utils';
import {
  authReducer,
  authInitialState,
  AuthActionTypes,
} from '../reducers/authReducer';
import {
  cartReducer,
  cartInitialState,
  CartActionTypes,
} from '../reducers/cartReducer';
import {CartManager} from '../utils';

export const AppContext = createContext();

export let globalAuthDispatch = null;

export const AppContextProvider = ({children}) => {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);
  const [cartState, cartDispatch] = useReducer(cartReducer, cartInitialState);

  const [updateOrderMessage, setUpdateOrderMessage] = useState({
    visible: false,
    order: null,
  });
  const [activeOrders, setActiveOrders] = useState([]);
  const [merchantLocation, setMerchantLocation] = useState(null);
  
   const [awaitingPayments, setAwaitingPayments] = useState(null);
 

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isValid = await AppAsyncStorage.isTokenValid();

      const user = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.user)
      console.log('token valid', isValid, 'lastName', user?.lastName)
      if (isValid && user.lastName) {
       
        authDispatch({
          type: AuthActionTypes.LOGIN,
          payload: {needLogin: false, isLoggedIn: true, lastName: user.lastName, needRegister: false},
        });
      
      }else{ // Không có accessToken, chưa đăng ký
        authDispatch({
          type: AuthActionTypes.LOGIN,
          payload: {needLogin: false, isLoggedIn: false, needRegister: false},
        });
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    globalAuthDispatch = authDispatch;

    return () => {
      globalAuthDispatch = null;
    };
  }, [authState]);

  useEffect(() => {
    const readCart = async () => {
      try {
        const cart = await CartManager.readCart();
        cartDispatch({type: CartActionTypes.READ_CART, payload: cart});
      } catch (error) {
        console.log('Error loading cart', error);
      }
    };
    readCart();

    return () => {};
  }, []);

  useEffect(() => {
      const getAwaitingPayments = async () => {
        try {
          setAwaitingPayments(
            await AppAsyncStorage.readData(
              AppAsyncStorage.STORAGE_KEYS.awaitingPayments,
            ),
          );
        } catch (error) {
          console.log('error', error);
        }
      };
  
      getAwaitingPayments();
    }, []);

  return (
    <AppContext.Provider
      value={{
        authState,
        authDispatch,
        cartState,
        cartDispatch,
        updateOrderMessage,
        setUpdateOrderMessage,
        activeOrders,
        setActiveOrders,
        merchantLocation,
        setMerchantLocation,
        awaitingPayments,
        setAwaitingPayments,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}
