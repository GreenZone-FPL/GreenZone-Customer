import { DeliveryMethod, PaymentMethod } from "../constants"
import { AppAsyncStorage } from "../utils"

export const CartActionTypes = {
    READ_CART: 'READ_CART',
    CLEAR_ORDER_ITEMS: 'CLEAR_ORDER_ITEMS',
    UPDATE_ORDER_ITEMS: 'UPDATE_ORDER_ITEMS',
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
    deliveryMethod: DeliveryMethod.PICK_UP.value,
    fulfillmentDateTime: '',
    note: '',
    totalPrice: 0,
    paymentMethod: PaymentMethod.COD.value,
    shippingAddress: '',
    store: '',
    owner: '',
    voucher: '',
    orderItems: []
}

export const cartReducer = (state, action) => {
    switch (action.type) {
        case CartActionTypes.UPDATE_ORDER_ITEMS: // dùng cho cả addToCart, updateItem, removeItem
            return { ...state, orderItems: action.payload }

        case CartActionTypes.READ_CART:
        case CartActionTypes.UPDATE_ORDER_INFO:
            // Chỉ cập nhật các thông tin liên quan đến đơn hàng mà không đụng đến orderItems
            return { ...state, ...action.payload };

        case CartActionTypes.CLEAR_ORDER_ITEMS:
            return { ...state, orderItems: [] }

        case CartActionTypes.RESET_STATE:
            return cartInitialState;
        default:
            return state
    }
}
