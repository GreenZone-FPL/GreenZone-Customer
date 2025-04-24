import React, {
  createContext,
  useContext,
  useState
} from 'react';


export const AppContext = createContext(); 

export const AppContextProvider = ({ children }) => {
 
  const [updateOrderMessage, setUpdateOrderMessage] = useState({
    visible: false,
    order: null,
  });

  const [activeOrders, setActiveOrders] = useState([]);
  const [merchantLocation, setMerchantLocation] = useState(null);
  const [user, setUser] = useState(0)
  const [notifications, setNotifications] = useState([]);

  const [allProducts, setAllProducts] = useState([]);


  return (
    <AppContext.Provider
      value={{
        updateOrderMessage,
        setUpdateOrderMessage,
        activeOrders,
        setActiveOrders,
        merchantLocation,
        setMerchantLocation,
        user,
        setUser,
        notifications,
        setNotifications,
        allProducts,
        setAllProducts
      }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}
