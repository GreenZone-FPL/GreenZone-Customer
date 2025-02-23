import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { AppAsyncStorage } from '../utils';
import { authReducer, authInitialState, AuthActionTypes } from '../reducers';
export const AppContext = createContext();


export let globalAuthDispatch = null;

export const AppContextProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);

  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (product) => {
    setFavorites((prevFavorites) => [...prevFavorites, product]);
  };

  const checkLoginStatus = async () => {
    const isValid = await AppAsyncStorage.isTokenValid();
    if (isValid) {
      authDispatch({ type: AuthActionTypes.LOGIN })
    } else {
      authDispatch({ type: AuthActionTypes.LOGIN_SESSION_EXPIRED })
    }
  };
  const removeFromFavorites = (productId) => {
    setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== productId));
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    globalAuthDispatch = authDispatch;
    return () => { globalAuthDispatch = null; };
  }, [authState]);

  return (
    <AppContext.Provider value={{ authState, authDispatch, favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}


