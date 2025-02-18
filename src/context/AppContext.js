import React, { createContext, useState, useEffect } from 'react';
import { AppAsyncStorage } from '../utils';


export const AppContext = createContext();


export const AppContextProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);


  const login = () => setIsLoggedIn(true);

  const logout = async () => {
    // Xoá accessToken và refreshToken từ storage
    await AppAsyncStorage.removeData(AppAsyncStorage.STORAGE_KEYS.accessToken);
    await AppAsyncStorage.removeData(AppAsyncStorage.STORAGE_KEYS.refreshToken);

    // Cập nhật trạng thái đăng nhập
    setIsLoggedIn(false);
  };

  const checkLoginStatus = async () => {
    const isValid = await AppAsyncStorage.isTokenValid();
    if (isValid) {
      setIsLoggedIn(true); // Token hợp lệ
    } else {
      setIsLoggedIn(false); // Token không hợp lệ hoặc hết hạn
    }
  };


  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Cập nhật trạng thái đăng nhập (thủ công khi login/logout)

  const addToFavorites = (product) => {
    setFavorites((prevFavorites) => [...prevFavorites, product]);
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== productId));
  };



  return (
    <AppContext.Provider value={{ isLoggedIn, login, logout, favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </AppContext.Provider>
  );
};


