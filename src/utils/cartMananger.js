import { DeliveryMethod } from '../constants';
import { CartActionTypes, cartInitialState } from '../reducers';
import { AppAsyncStorage } from './appAsyncStorage';
import { Toaster } from './toaster';

const requiredFieldsPickUp = [
  'deliveryMethod',
  'fulfillmentDateTime',
  // 'totalPrice',
  'paymentMethod',
  'store',
  'orderItems',
];

const requiredFieldsDelivery = [
  'deliveryMethod',
  'fulfillmentDateTime',
  // 'totalPrice',
  'paymentMethod',
  'consigneeName',
  'consigneePhone',
  'store',
  'shippingAddress',
  'orderItems',
  'latitude',
  'longitude',
  
];
export const CartManager = (() => {
  const setupDeliveryOrder = cartState => {
    const deliveryOrder = {
      deliveryMethod: cartState.deliveryMethod,
      fulfillmentDateTime: cartState.fulfillmentDateTime,
      totalPrice: cartState.totalPrice,
      paymentMethod: cartState.paymentMethod,
      consigneeName: cartState.consigneeName,
      consigneePhone: cartState.consigneePhone,
      store: cartState.store,
      shippingAddress: cartState.shippingAddressInfo.location,
      voucher: cartState.voucher,
      orderItems: cartState.orderItems.map(item => ({
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        toppingItems: item.toppingItems.map(t => ({
          topping: t.topping,
          quantity: t.quantity,
          price: t.price,
        })),
      })),
      latitude: cartState.shippingAddressInfo.latitude.toString(),
      longitude: cartState.shippingAddressInfo.longitude.toString(),
    };
    if (!cartState.voucher) {
      delete deliveryOrder.voucher;
    }
    return deliveryOrder;
  };

  const setUpPickupOrder = cartState => {
    const pickupOrder = {
      deliveryMethod: cartState.deliveryMethod,
      fulfillmentDateTime: cartState.fulfillmentDateTime,
      totalPrice: cartState.totalPrice,
      paymentMethod: cartState.paymentMethod,
      store: cartState.store,
      voucher: cartState.voucher,
      orderItems: cartState.orderItems.map(item => ({
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        toppingItems: item.toppingItems.map(t => ({
          topping: t.topping,
          quantity: t.quantity,
          price: t.price,
        })),
      })),
    };
    if (!cartState.voucher) {
      delete pickupOrder.voucher;
    }
    return pickupOrder;
  };

  const checkValid = (
    orderDetails,
    deliveryMethod = DeliveryMethod.PICK_UP.value,
  ) => {
    const requiredFields =
      deliveryMethod === DeliveryMethod.PICK_UP.value
        ? requiredFieldsPickUp
        : requiredFieldsDelivery;

    const errorMessages = {
      fulfillmentDateTime: 'Vui lòng chọn thời gian nhận hàng',
      store: 'Vui lòng chọn cửa hàng',
    };

    let missingFields = requiredFields
      .filter(
        field =>
          !orderDetails[field] ||
          (Array.isArray(orderDetails[field]) &&
            orderDetails[field].length === 0),
      )
      .map(field => errorMessages[field] || `Thiếu thông tin: ${field}`);

    return missingFields.length > 0 ? missingFields : null;
  };

  const updateOrderInfo = async (cartDispatch, orderDetails) => {
    try {
      const cart = await AppAsyncStorage.readData('CART', cartInitialState);
      cartDispatch({
        type: CartActionTypes.UPDATE_ORDER_INFO,
        payload: orderDetails,
      });

      const newCart = { ...cart, ...orderDetails };

      await AppAsyncStorage.storeData('CART', newCart);
      return newCart;
    } catch (error) {
      console.log('Error update Order info:', error);
      Toaster.show('Lỗi khi tạo đơn hàng');
    }
  };

  const getPaymentDetails = cartState => {
    const cartTotal = CartManager.getCartTotal(cartState);
    const deliveryAmount =
      cartState?.deliveryMethod === DeliveryMethod.DELIVERY.value ? 20000 : 0;
    let voucherAmount = 0;

    if (cartState?.voucherInfo?.discountType === 'percentage') {
      voucherAmount = (cartState?.voucherInfo?.value * cartTotal) / 100;
    } else if (cartState?.voucherInfo?.discountType === 'fixedAmount') {
      voucherAmount = cartState?.voucherInfo?.value;
    }

    const paymentTotal =
      cartTotal + deliveryAmount - voucherAmount < 0
        ? 0
        : cartTotal + deliveryAmount - voucherAmount;
    return { cartTotal, deliveryAmount, voucherAmount, paymentTotal };
  };

  const getCartTotal = cart => {
    return cart.orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
  };
  const readCart = async () => {
    try {
      const cart = await AppAsyncStorage.readData('CART', cartInitialState);

      return cart;
    } catch (error) {
      console.log('error read cart', error);
    }
  };

  const addToCart = async (
    product,
    variant,
    selectedToppings,
    price,
    quantity,
    cartDispatch,

  ) => {
    try {
      const cart = await AppAsyncStorage.readData('CART', cartInitialState);
     
      if (cart.orderItems.length >= 10) {
        Toaster.show('Giỏ hàng tối đa 10 sản phẩm');
        return;
      }

      const sortedToppings = selectedToppings?.length
        ? [...selectedToppings].sort((a, b) => a._id.localeCompare(b._id))
        : [];

      const existingIndex = cart.orderItems.findIndex(
        item =>
          item.productId === product._id &&
          item.variant === variant._id &&
          JSON.stringify(item.toppings || []) ===
          JSON.stringify(sortedToppings),
      );

      if (existingIndex !== -1) {
        cart.orderItems[existingIndex].quantity += quantity;
      } else {
        cart.orderItems.push({
          //cartItem
          variant: variant?._id || null,
          quantity: quantity,
          price: price,
          toppingItems: sortedToppings,

          itemId: new Date().getTime(), //cartitemid
          productId: product._id,
          productName: product.name,
          variantName: variant?.size || '',
          image: product.image,
          isVariantDefault: product.variant.length === 1,
        });
      }
      cartDispatch({
        type: CartActionTypes.UPDATE_ORDER_ITEMS,
        payload: cart.orderItems,
      });
  
      Toaster.show('Thêm vào giỏ hàng thành công');

      await AppAsyncStorage.storeData('CART', cart);

      return cart;
    } catch (error) {
      console.log('Error addToCart', error);
    }
  };

  const updateCartItem = async (itemId, updatedData, cartDispatch) => {
    try {
      const cart = await AppAsyncStorage.readData('CART', {});
      const items = cart.orderItems;
      const index = items.findIndex(i => i.itemId === itemId);
      if (index === -1) return;
  
      const updatedItem = { ...items[index], ...updatedData };
      const toppings = updatedItem.toppingItems?.sort((a, b) => a._id.localeCompare(b._id)) || [];
  
      const isSameToppings = (a, b) => {
        if (a.length !== b.length) return false;
        const aIds = a.map(t => t._id).sort();
        const bIds = b.map(t => t._id).sort();
        return JSON.stringify(aIds) === JSON.stringify(bIds);
      };
  
      const dupIndex = items.findIndex((i, idx) =>
        idx !== index &&
        i.productId === updatedItem.productId &&
        i.variant === updatedItem.variant &&
        isSameToppings(i.toppingItems || [], toppings)
      );
  
      if (dupIndex !== -1 && index !== dupIndex) {
        items[dupIndex].quantity += updatedItem.quantity;
        items.splice(index, 1);
      } else {
        items[index] = { ...updatedItem, toppingItems: toppings };
      }
  
      cart.orderItems = [...items];
      await AppAsyncStorage.storeData('CART', cart);
      cartDispatch({ type: CartActionTypes.UPDATE_ORDER_ITEMS, payload: cart.orderItems });
  
      Toaster.show('Cập nhật giỏ hàng thành công');
      return cart;
    } catch (e) {
      console.log('Error updateCartItem:', e);
    }
  };
  
  
  

  const removeFromCart = async (itemId, cartDispatch) => {
    try {
      let cart = await AppAsyncStorage.readData('CART', cartInitialState);

      cart.orderItems = cart.orderItems.filter(item => item.itemId !== itemId);
      cartDispatch({ type: CartActionTypes.UPDATE_ORDER_ITEMS, payload: cart.orderItems });
      await AppAsyncStorage.storeData('CART', cart);

      return cart;
    } catch (error) {
      console.log('Error removeFromCart:', error);
    }
  };

  const clearOrderItems = async cartDispatch => {
    try {
      let cart = await AppAsyncStorage.readData('CART', cartInitialState);
      cart.orderItems = [];

      await AppAsyncStorage.storeData('CART', cart);

      cartDispatch({
        type: CartActionTypes.UPDATE_ORDER_INFO,
        payload: {
          orderItems: [],
          voucherInfo: {},
          voucher: '',
        },
      });
    } catch (error) {
      console.log('Error clearCart:', error);
    }
  };

  const clearCartState = async cartDispatch => {
    try {
      await AppAsyncStorage.storeData('CART', cartInitialState);
      cartDispatch({ type: CartActionTypes.RESET_STATE });
    } catch (error) {
      console.log('Error clearCart:', error);
    }
  };

 

  return {
    setupDeliveryOrder,
    setUpPickupOrder,
    getPaymentDetails,
    checkValid,
    updateOrderInfo,
    getCartTotal,
    readCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCartState,
    clearOrderItems,
  };
})();
