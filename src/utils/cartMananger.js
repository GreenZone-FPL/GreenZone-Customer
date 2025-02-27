import { CartActionTypes } from "../reducers";
import { AppAsyncStorage } from "./appAsyncStorage";
import { Toaster } from "./toaster";
export const CartManager = (() => {

    const checkValid = (orderDetails) => {
        const requiredFields = [
            'deliveryMethod',
            'fulfillmentDateTime',
            'totalPrice',
            'paymentMethod',
            'owner',
            'orderItems',
            'store'
        ];

        const missingFields = requiredFields.filter(field =>
            !orderDetails[field] ||
            (Array.isArray(orderDetails[field]) && orderDetails[field].length === 0)
        );

        return missingFields.length > 0 ? missingFields : null;
    };


    const updateOrderInfo = async (dispatch, orderDetails) => {
        try {

            const cart = await AppAsyncStorage.readData('CART', []);
            const userId = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.userId, null)
            if (cart.length === 0) {
                Toaster.show('Giỏ hàng trống, không thể tạo đơn hàng');
                return;
            }

            dispatch({
                type: CartActionTypes.UPDATE_ORDER_INFO,
                payload: { ...orderDetails, owner: userId }
            });

            // Toaster.show('Update thành công');

            // await AppAsyncStorage.storeData('CART', []);
        } catch (error) {
            console.log('Error update Order info:', error);
            Toaster.show('Lỗi khi tạo đơn hàng');
        }
    };
    const getCartTotal = (cart) => {
        return cart.reduce((acc, item) => acc + item.price, 0)
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

            // Nếu không có variant, gán variantId là productId
            const variantId = variant?._id || product._id;

            const existingIndex = cart.findIndex(item =>
                item.productId === product._id &&
                item.variant === variantId &&
                (JSON.stringify(item.toppings || []) === JSON.stringify(sortedToppings))
            );

            if (existingIndex !== -1) {
                cart[existingIndex].quantity += quantity;
            } else {
                cart.push({
                    variant: variantId, // Nếu không có variant, dùng productId
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
            return cart;

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
        checkValid,
        updateOrderInfo,
        getCartTotal,
        readCart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart

    };
})();


