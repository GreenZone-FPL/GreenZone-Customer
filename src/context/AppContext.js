import React, { createContext, useState } from 'react';

// Tạo context
export const AppContext = createContext();

// Provider để cung cấp dữ liệu cho toàn bộ ứng dụng
export const AppContextProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    const addToFavorites = (product) => {
      setFavorites((prevFavorites) => [...prevFavorites, product]);
    };
  
    const removeFromFavorites = (productId) => {
      setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== productId));
    };
  

  // Bạn có thể thêm các trạng thái khác vào đây nếu cần

  return (
    <AppContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook để sử dụng context
// export const useAppContext = () => useContext(AppContext);
