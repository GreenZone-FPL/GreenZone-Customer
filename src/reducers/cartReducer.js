export const CartActionTypes = {
    READ_CART: 'READ_CART',
    CLEAR_CART: 'CLEAR_CART',
    UPDATE_CART: 'UPDATE_CART'
}
export const cartInitialState = {
    items: []
}

export const cartReducer = (state, action) => {
    switch (action.type) {
        case CartActionTypes.READ_CART:
        case CartActionTypes.UPDATE_CART: // dùng cho cả addToCart, updateItem, removeItem
            return { ...state, items: action.payload }

        case CartActionTypes.CLEAR_CART:
            return { ...state, items: [] }

        default:
            return state
    }
}
