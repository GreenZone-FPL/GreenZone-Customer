import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { AppAsyncStorage } from '../utils';
import { authReducer, authInitialState, AuthActionTypes } from '../reducers/authReducer';
import { cartReducer, cartInitialState, CartActionTypes } from '../reducers/cartReducer';
import { CartManager } from '../utils';

export const AppContext = createContext();

// fix file name
export let globalAuthDispatch = null;

export const AppContextProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);
  const [cartState, cartDispatch] = useReducer(cartReducer, cartInitialState)

  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (product) => {
    setFavorites((prevFavorites) => [...prevFavorites, product]);
  };


  const removeFromFavorites = (productId) => {
    setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== productId));
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isValid = await AppAsyncStorage.isTokenValid();
      if (isValid) {
        authDispatch({ type: AuthActionTypes.LOGIN })
      } else {
        authDispatch({ type: AuthActionTypes.LOGIN_SESSION_EXPIRED, payload: 'Phiên đăng nhập hết hạn' })
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    globalAuthDispatch = authDispatch;

    return () => { globalAuthDispatch = null; };
  }, [authState]);

  useEffect(() => {
    const readCart = async () => {
      try {
        const cartData = await CartManager.readCart();
        cartDispatch({ type: CartActionTypes.READ_CART, payload: cartData });
      } catch (error) {
        console.log("Error loading cart", error);
      }
    };
    readCart()

    return () => { }
  }, [])

  return (
    <AppContext.Provider
      value={{ authState, authDispatch, cartState, cartDispatch, favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}


