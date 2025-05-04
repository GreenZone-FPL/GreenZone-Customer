// ProductContext.tsx
import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  return (
    <ProductContext.Provider
      value={{allProducts, setAllProducts, newProducts, setNewProducts}}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
