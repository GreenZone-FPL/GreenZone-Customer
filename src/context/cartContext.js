import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { cartReducer, cartInitialState, CartActionTypes } from '../reducers/cartReducer';
import { CartManager } from '../utils';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartState, cartDispatch] = useReducer(cartReducer, cartInitialState);

    useEffect(() => {
        const readCart = async () => {
            try {
                const cart = await CartManager.readCart();
                cartDispatch({ type: CartActionTypes.READ_CART, payload: cart });
            } catch (error) {
                console.log('Error loading cart', error);
            }
        };
        readCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartState, cartDispatch }}>
            {children}
        </CartContext.Provider>
    );
};


export function useCartContext() {
  return useContext(CartContext);
}


