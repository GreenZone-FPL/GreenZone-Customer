// context/AuthContext.js
import React, {
    createContext,
    useContext,
    useEffect,
    useReducer
  } from 'react';
  import {
    AuthActionTypes,
    authInitialState,
    authReducer
  } from '../reducers/authReducer';
  import { AppAsyncStorage } from '../utils';
  
  export const AuthContext = createContext();
  
  export let globalAuthDispatch = null;
  
  export const AuthProvider = ({ children }) => {
    const [authState, authDispatch] = useReducer(authReducer, authInitialState);
  
    useEffect(() => {
      const checkLoginStatus = async () => {
        const isValid = await AppAsyncStorage.isTokenValid();
        const user = await AppAsyncStorage.readData(
          AppAsyncStorage.STORAGE_KEYS.user,
        );
  
        if (isValid && user.lastName) {
          authDispatch({
            type: AuthActionTypes.LOGIN,
            payload: {
              needLogin: false,
              isLoggedIn: true,
              lastName: user.lastName,
              firstName: user.firstName,
              needRegister: false,
              phoneNumber: user.phoneNumber
            },
          });
        } else {
          authDispatch({
            type: AuthActionTypes.LOGIN,
            payload: { needLogin: false, isLoggedIn: false, needRegister: false },
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
  
    return (
      <AuthContext.Provider value={{ authState, authDispatch }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export function useAuthContext() {
    return useContext(AuthContext);
  }
  