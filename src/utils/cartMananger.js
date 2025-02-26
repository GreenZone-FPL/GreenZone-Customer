import { AppAsyncStorage } from "./appAsyncStorage";
import { Toaster } from "./toaster";
import { CartActionTypes } from "../reducers";
import { PaymentMethod, DeliveryMethod } from "../constants";
export const CartManager = (() => {


    const updateOrderInfo = async (dispatch, orderDetails) => {
        try {

            const cart = await AppAsyncStorage.readData('CART', []);

            if (cart.length === 0) {
                Toaster.show('Giỏ hàng trống, không thể tạo đơn hàng');
                return;
            }

            const order = {
                deliveryMethod: orderDetails.deliveryMethod || DeliveryMethod.PICK_UP,
                fulfillmentDateTime: orderDetails.fulfillmentDateTime || new Date().toISOString(),
                note: orderDetails.note || '',
                totalPrice: orderDetails.totalPrice,
                paymentMethod: orderDetails.paymentMethod || PaymentMethod.COD,
                shippingAddress: orderDetails.shippingAddress || '',
                store: orderDetails.store || '',
                owner: orderDetails.owner || '',
                voucher: orderDetails.voucher || '',

            };

            console.log('order = ', order)
            dispatch({
                type: CartActionTypes.MAKE_ORDER,
                payload: order
            });



            Toaster.show('Đặt hàng thành công');

            // await AppAsyncStorage.storeData('CART', []);
        } catch (error) {
            console.log('Error update Order info:', error);
            Toaster.show('Lỗi khi tạo đơn hàng');
        }
    };
    const getCartTotal = (cart) => {
        return cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    }
    const readCart = async () => {
        try {
            const cart = await AppAsyncStorage.readData('CART', null);
            console.log('read cart ', cart);
            // console.log('read cart length', cart?.length || 0);
            // if (cart.length > 0) {
            //     console.log('cart[1]  = ', cart[1])
            // }

            return cart
        } catch (error) {
            console.log('error read cart', error);
        }
    };

    const addToCart = async (product, variant, selectedToppings, price, quantity) => {
        try {
            const cart = await AppAsyncStorage.readData('CART', []);

            const cartLength = cart.reduce((total, item) => total + item.quantity, 0);
            if (cartLength + quantity > 10) {
                Toaster.show('Giỏ hàng tối đa 10 sản phẩm');
                return;
            }

            const sortedToppings = selectedToppings?.length
                ? [...selectedToppings].sort((a, b) => a._id.localeCompare(b._id))
                : [];

            const existingIndex = cart.findIndex(item =>
                item.productId === product._id &&
                (item.variant === (variant?._id || null)) &&
                (JSON.stringify(item.toppings || []) === JSON.stringify(sortedToppings))
            );

            if (existingIndex !== -1) {
                cart[existingIndex].quantity += quantity;
            } else {
                cart.push({
                    variant: variant?._id || null,
                    quantity: quantity,
                    price: price,
                    toppingItems: sortedToppings,

                    itemId: new Date().getTime(),
                    productId: product._id,
                    productName: product.name,
                    variantName: variant?.size || '',
                    image: product.image
                });
            }

            await AppAsyncStorage.storeData('CART', cart);
            Toaster.show('Thêm vào giỏ hàng thành công');
            return cart


        } catch (error) {
            console.log('Error addToCart', error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            let cart = await AppAsyncStorage.readData('CART', []);


            cart = cart.filter(item => item.itemId !== itemId);

            await AppAsyncStorage.storeData('CART', cart);
            return cart


        } catch (error) {
            console.log('Error removeFromCart:', error);
        }
    };


    const updateCartItem = async (itemId, updatedProductData) => {
        try {
            let cart = await AppAsyncStorage.readData('CART', []);

            const itemIndex = cart.findIndex(item => item.itemId === itemId);
            if (itemIndex !== -1) {
                cart[itemIndex] = {
                    ...cart[itemIndex],
                    ...updatedProductData,
                };
            }

            await AppAsyncStorage.storeData('CART', cart);

            Toaster.show('Cập nhật giỏ hàng thành công');
            return cart
        } catch (error) {
            console.log('Error updateCartItem:', error);
        }
    };



    const clearCart = async () => {
        try {
            await AppAsyncStorage.storeData('CART', []);
        } catch (error) {
            console.log('Error clearCart:', error);
        }
    }

    return {
        updateOrderInfo,
        getCartTotal,
        readCart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart

    };
})();


