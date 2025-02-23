import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { AppAsyncStorage } from '../utils';

export const AppContext = createContext();


export const ActionTypes = {
  LOGIN: 'LOGIN',
  LOGIN_SESSION_EXPIRED: 'LOGIN_SESSION_EXPIRED',
  REGISTER: 'REGISTER',
  LOGOUT: 'LOGOUT',
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
};

const initialState = {
  isLoggedIn: false,
  message: '',
};

function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return { ...state, isLoggedIn: true, message: '' };

    case ActionTypes.LOGIN_SESSION_EXPIRED:
      return { ...state, isLoggedIn: false, message: 'Phiên đăng nhập hết hạn' };

    case ActionTypes.REGISTER:
      return { ...state, isLoggedIn: false, message: '' };

    case ActionTypes.LOGOUT:
      return { ...state, isLoggedIn: false, message: '' };

    case ActionTypes.CLEAR_MESSAGE:
      return { ...state, message: '' };

    default:
      return state;
  }
}

export let appDispatch = null;

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (product) => {
    setFavorites((prevFavorites) => [...prevFavorites, product]);
  };

  const checkLoginStatus = async () => {
    const isValid = await AppAsyncStorage.isTokenValid();
    if (isValid) {
      dispatch({type: ActionTypes.LOGIN})
    } else {
      dispatch({type: ActionTypes.LOGIN_SESSION_EXPIRED})
    }
  };
  const removeFromFavorites = (productId) => {
    setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== productId));
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    appDispatch = dispatch;
    return () => { appDispatch = null; };
  }, [dispatch]);

  return (
    <AppContext.Provider value={{ state, dispatch, favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}


