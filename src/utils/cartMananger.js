import { DeliveryMethod } from "../constants";
import { CartActionTypes, cartInitialState } from "../reducers";
import { AppAsyncStorage } from "./appAsyncStorage";
import { Toaster } from "./toaster";

const requiredFieldsPickUp = [
    'deliveryMethod',
    'fulfillmentDateTime',
    'totalPrice',
    'paymentMethod',
    'owner',
    'orderItems',
    'store'
];
export const CartManager = (() => {

    const checkValid = (orderDetails, deliveryMethod = DeliveryMethod.PICK_UP) => {

        const missingFields = []

        if (deliveryMethod === DeliveryMethod.PICK_UP) {
            missingFields = requiredFieldsPickUp.filter(field =>
                !orderDetails[field] ||
                (Array.isArray(orderDetails[field]) && orderDetails[field].length === 0)
            );
        }
        return missingFields.length > 0 ? missingFields : null;
    };


    const updateOrderInfo = async (cartDispatch, orderDetails) => {
        try {

            const cart = await AppAsyncStorage.readData('CART', cartInitialState);
            // const userId = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.userId, null)
            if (cart.orderItems.length === 0) {
                Toaster.show('Giỏ hàng trống, không thể tạo đơn hàng');
                return;
            }

            cartDispatch({
                type: CartActionTypes.UPDATE_ORDER_INFO,
                payload: orderDetails
            });
            const newCart = {...cart, ...orderDetails}

            // Toaster.show('Update thành công');

            await AppAsyncStorage.storeData('CART', newCart);
        } catch (error) {
            console.log('Error update Order info:', error);
            Toaster.show('Lỗi khi tạo đơn hàng');
        }
    };
    const getCartTotal = (cart) => {
        return cart.orderItems.reduce((acc, item) => acc + item.price, 0)
    }
    const readCart = async () => {
        try {
            const cart = await AppAsyncStorage.readData('CART', cartInitialState);
            console.log("readCart:", JSON.stringify(cart, null, 3));

            return cart
        } catch (error) {
            console.log('error read cart', error);
        }
    };


    const addToCart = async (product, variant, selectedToppings, price, quantity, cartDispatch) => {
        try {
            const cart = await AppAsyncStorage.readData('CART', cartInitialState);

            const cartLength = cart.orderItems.reduce((total, item) => total + item.quantity, 0);
            if (cartLength + quantity > 10) {
                Toaster.show('Giỏ hàng tối đa 10 sản phẩm');
                return;
            }

            const sortedToppings = selectedToppings?.length
                ? [...selectedToppings].sort((a, b) => a._id.localeCompare(b._id))
                : [];


            const existingIndex = cart.orderItems.findIndex(item =>
                item.productId === product._id &&
                item.variant === variant._id &&
                (JSON.stringify(item.toppings || []) === JSON.stringify(sortedToppings))
            );

            if (existingIndex !== -1) {
                cart.orderItems[existingIndex].quantity += quantity;
            } else {
                cart.orderItems.push({ //cartItem
                    variant: variant?._id || null,
                    quantity: quantity,
                    price: price,
                    toppingItems: sortedToppings,

                    itemId: new Date().getTime(), //cartitemid
                    productId: product._id,
                    productName: product.name,
                    variantName: variant?.size || '',
                    image: product.image,
                    isVariantDefault: product.variant.length === 1
                });
            }


            await AppAsyncStorage.storeData('CART', cart);
            cartDispatch({type: CartActionTypes.UPDATE_ORDER_INFO, payload: cart})
            Toaster.show('Thêm vào giỏ hàng thành công');
            return cart;

        } catch (error) {
            console.log('Error addToCart', error);
        }
    };

    const removeFromCart = async (itemId, cartDispatch) => {
        try {
            let cart = await AppAsyncStorage.readData('CART', cartInitialState);


            cart.orderItems = cart.orderItems.filter(item => item.itemId !== itemId);

            await AppAsyncStorage.storeData('CART', cart);
            cartDispatch({type: CartActionTypes.UPDATE_ORDER_INFO, payload: cart})
            return cart


        } catch (error) {
            console.log('Error removeFromCart:', error);
        }
    };


    const updateCartItem = async (itemId, updatedProductData, cartDispatch) => {
        try {
            let cart = await AppAsyncStorage.readData('CART', {});

            const itemIndex = cart.orderItems.findIndex(item => item.itemId === itemId);
            if (itemIndex !== -1) {
                cart.orderItems[itemIndex] = {
                    ...cart.orderItems[itemIndex],
                    ...updatedProductData,
                };
            }

            await AppAsyncStorage.storeData('CART', cart);
            cartDispatch({type: CartActionTypes.UPDATE_ORDER_INFO, payload: cart})

            Toaster.show('Cập nhật giỏ hàng thành công');
            return cart
        } catch (error) {
            console.log('Error updateCartItem:', error);
        }
    };



    const clearCart = async (cartDispatch) => {
        try {
            await AppAsyncStorage.storeData('CART', cartInitialState);
            cartDispatch({type: CartActionTypes.RESET_STATE})
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


