import { AppAsyncStorage } from "../utils"

export const CartActionTypes = {
    READ_CART: 'READ_CART',
    CLEAR_CART: 'CLEAR_CART',
    UPDATE_CART: 'UPDATE_CART',
    UPDATE_ORDER_INFO: 'UPDATE_ORDER_INFO',
    RESET_STATE: 'RESET_STATE'

}

const fullInfo = {
    deliveryMethod: 'pickup',  // (Required) -Phương thức giao hàng
    fulfillmentDateTime: '',   // (Required) - Thời gian dự kiến giao/nhận hàng
    note: '',
    totalPrice: 0,             // (Required) - Tổng giá trị đơn hàng.
    paymentMethod: 'cod',      // (Required) - Phương thức thanh toán.
    shippingAddress: '',       // id địa chỉ giao hàng (khi phương thức giao hàng là delivery).
    store: '',                 // ID cửa hàng
    owner: '',                 // (Required) ID customer
    voucher: '',               // ID voucher áp dụng (nếu có).
    orderItems: []             // (Required)
}


export const cartInitialState = {
    deliveryMethod: 'pickup',
    fulfillmentDateTime: '',
    note: '',
    totalPrice: 0,
    paymentMethod: 'cod',
    store: '',
    owner: '',
    orderItems: []
}

export const cartReducer = (state, action) => {
    switch (action.type) {
        case CartActionTypes.READ_CART:
        case CartActionTypes.UPDATE_CART: // dùng cho cả addToCart, updateItem, removeItem
            return { ...state, orderItems: action.payload }

        case CartActionTypes.UPDATE_ORDER_INFO:
            // Chỉ cập nhật các thông tin liên quan đến đơn hàng mà không đụng đến orderItems
            return { ...state, ...action.payload };

        case CartActionTypes.CLEAR_CART:
            return { ...state, orderItems: [] }

        case CartActionTypes.RESET_STATE:
            return cartInitialState;
        default:
            return state
    }
}
