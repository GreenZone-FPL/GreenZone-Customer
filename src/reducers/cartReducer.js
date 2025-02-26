export const CartActionTypes = {
    READ_CART: 'READ_CART',
    CLEAR_CART: 'CLEAR_CART',
    UPDATE_CART: 'UPDATE_CART',
    UPDATE_ORDER_INFO: 'UPDATE_ORDER_INFO',

}
export const cartInitialState = {
    deliveryMethod: 'pickup',  // Mặc định là 'pickup'
    fulfillmentDateTime: '',   // Mặc định là rỗng
    note: '',                  // Mặc định là rỗng
    totalPrice: 0,             // Mặc định là 0
    paymentMethod: 'online',   // Mặc định là 'online'
    shippingAddress: '',       // Mặc định là rỗng
    store: '',                 // Mặc định là rỗng
    owner: '',                 // Mặc định là rỗng
    voucher: '',               // Mặc định là rỗng
    orderItems: []             // Danh sách sản phẩm
}

export const cartReducer = (state, action) => {
    switch (action.type) {
        case CartActionTypes.READ_CART:
        case CartActionTypes.UPDATE_CART: // dùng cho cả addToCart, updateItem, removeItem
            return { ...state, items: action.payload }

        case CartActionTypes.UPDATE_ORDER_INFO:
            // Chỉ cập nhật các thông tin liên quan đến đơn hàng mà không đụng đến orderItems
            return { ...state, ...action.payload };

        case CartActionTypes.CLEAR_CART:
            return { ...state, items: [] }

        default:
            return state
    }
}
