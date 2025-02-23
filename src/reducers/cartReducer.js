export const CartActionTypes = {
    CLEAR_CART: 'CLEAR_CART',
    UPDATE_CART: 'UPDATE_CART'
}
export const cartInitialState = {
    items: []
}

export const cartReducer = (state, action) => {
    switch (action.type) {
        case CartActionTypes.UPDATE_CART: 
            return { ...state, items: [...state.items, action.payload] }
        

        case CartActionTypes.CLEAR_CART: 
            return { ...state, items: [] }
        

        default: 
            return state
        
    }
}
