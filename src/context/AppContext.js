import React, { createContext, useState, useEffect } from 'react';
import { AppAsyncStorage } from '../utils';


export const AppContext = createContext();


export const AppContextProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);


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
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);




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

// Custom hook để sử dụng context
// export const useAppContext = () => useContext(AppContext);
