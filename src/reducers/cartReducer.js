import { DeliveryMethod, PaymentMethod } from '../constants';

export const CartActionTypes = {
  READ_CART: 'READ_CART',
  CLEAR_ORDER_ITEMS: 'CLEAR_ORDER_ITEMS',
  UPDATE_ORDER_ITEMS: 'UPDATE_ORDER_ITEMS',
  UPDATE_ORDER_INFO: 'UPDATE_ORDER_INFO',
  RESET_STATE: 'RESET_STATE',

  // Các action riêng cho từng field
  UPDATE_DELIVERY_METHOD: 'UPDATE_DELIVERY_METHOD',
  UPDATE_FULFILLMENT_DATE: 'UPDATE_FULFILLMENT_DATE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  UPDATE_TOTAL_PRICE: 'UPDATE_TOTAL_PRICE',
  UPDATE_PAYMENT_METHOD: 'UPDATE_PAYMENT_METHOD',
  UPDATE_SHIPPING_ADDRESS: 'UPDATE_SHIPPING_ADDRESS',
  UPDATE_STORE: 'UPDATE_STORE',
  UPDATE_VOUCHER: 'UPDATE_VOUCHER',
  UPDATE_STORE_INFO: 'UPDATE_STORE_INFO',
  UPDATE_VOUCHER_INFO: 'UPDATE_VOUCHER_INFO',
  UPDATE_ONLINE_METHOD: 'UPDATE_ONLINE_METHOD'
};


const fullInfo = {
  deliveryMethod: 'pickup', // (Required) -Phương thức giao hàng
  fulfillmentDateTime: '', // (Required) - Thời gian dự kiến giao/nhận hàng
  note: '',
  totalPrice: 0, // (Required) - Tổng giá trị đơn hàng.
  paymentMethod: 'cod', // (Required) - Phương thức thanh toán.
  shippingAddress: '', // id địa chỉ giao hàng (khi phương thức giao hàng là delivery).
  store: '', // ID cửa hàng
  voucher: '', // ID voucher áp dụng (nếu có).
  orderItems: [], // (Required)
  storeInfo: '',
  voucherInfo: {},
};

export const cartInitialState = {
  deliveryMethod: DeliveryMethod.DELIVERY.value,
  fulfillmentDateTime: '',
  note: '',
  totalPrice: 0,
  paymentMethod: PaymentMethod.COD.value,
  store: '',
  orderItems: [],
};

export const cartReducer = (state, action) => {
  switch (action.type) {

    case CartActionTypes.UPDATE_ORDER_INFO:
    case CartActionTypes.READ_CART: {
      const newState = { ...state };
      let changed = false;

      for (const key in action.payload) {
        if (action.payload.hasOwnProperty(key) && state[key] !== action.payload[key]) {
          newState[key] = action.payload[key];
          changed = true;
        }
      }

      return changed ? newState : state;
    }

    case CartActionTypes.CLEAR_ORDER_ITEMS:
      return state.orderItems.length === 0 ? state : { ...state, orderItems: [] };

    case CartActionTypes.RESET_STATE:
      return cartInitialState;
    case CartActionTypes.UPDATE_ORDER_ITEMS:
      return updateFieldIfChanged(state, 'orderItems', action.payload);

    case CartActionTypes.UPDATE_DELIVERY_METHOD:
      return updateFieldIfChanged(state, 'deliveryMethod', action.payload);

    case CartActionTypes.UPDATE_FULFILLMENT_DATE:
      return updateFieldIfChanged(state, 'fulfillmentDateTime', action.payload);

    case CartActionTypes.UPDATE_NOTE:
      return updateFieldIfChanged(state, 'note', action.payload);

    case CartActionTypes.UPDATE_TOTAL_PRICE:
      return updateFieldIfChanged(state, 'totalPrice', action.payload);

    case CartActionTypes.UPDATE_PAYMENT_METHOD:
      return updateFieldIfChanged(state, 'paymentMethod', action.payload);

    case CartActionTypes.UPDATE_SHIPPING_ADDRESS:
      return updateFieldIfChanged(state, 'shippingAddress', action.payload);

    case CartActionTypes.UPDATE_STORE:
      return updateFieldIfChanged(state, 'store', action.payload);

    case CartActionTypes.UPDATE_VOUCHER:
      return updateFieldIfChanged(state, 'voucher', action.payload);

    case CartActionTypes.UPDATE_STORE_INFO:
      return updateFieldIfChanged(state, 'storeInfo', action.payload);

    case CartActionTypes.UPDATE_VOUCHER_INFO:
      return updateFieldIfChanged(state, 'voucherInfo', action.payload);
      
    case CartActionTypes.UPDATE_ONLINE_METHOD:
      return updateFieldIfChanged(state, 'onlineMethod', action.payload);
    default:
      return state;
  }
};


function updateFieldIfChanged(state, key, value) {
  return state[key] === value ? state : { ...state, [key]: value };
}

