import { AppAsyncStorage } from "./appAsyncStorage";
import { EventBus, EVENT } from "./eventBus";
import { Toaster } from "./toaster";
// closure

export const CART_ACTIONS = {
    LOAD_CART: 'LOAD_CART',
    ADD_ITEM: 'ADD_ITEM',
    UPDATE_ITEM: 'UPDATE_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    CLEAR_CART: 'CLEAR_CART',
};


export const CartManager = (() => {
    const readCart = async () => {
        try {
            const CART = await AppAsyncStorage.readData('CART', null);
            console.log('read CART', CART);
            console.log('read cart length', CART?.length || 0);
            return CART
        } catch (error) {
            console.log('error read CART', error);
        }
    };

    const addToCart = async (product, variant, selectedToppings, amount, quantity) => {
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
                    itemId: new Date().getTime(),
                    productId: product._id,
                    productName: product.name,
                    variant: variant?._id || null,
                    variantName: variant?.size || '',
                    quantity: quantity,
                    price: amount,
                    toppings: sortedToppings,
                    image: product.image
                });
            }

            await AppAsyncStorage.storeData('CART', cart);

            EventBus.emit(EVENT.ADD_TO_CART, cart.length)
            EventBus.emit(EVENT.UPDATE_CART, cart.length)

            Toaster.show('Thêm vào giỏ hàng thành công');
        } catch (error) {
            console.log('Error addToCart', error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            let cart = await AppAsyncStorage.readData('CART', []);
    
            
            cart = cart.filter(item => item.itemId !== itemId);
    
            await AppAsyncStorage.storeData('CART', cart);
    
           
            EventBus.emit(EVENT.DELETE_ITEM, cart);
            EventBus.emit(EVENT.UPDATE_CART, cart.length);
    
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

            EventBus.emit(EVENT.EDIT_ITEM, cart);
            EventBus.emit(EVENT.UPDATE_CART, cart.length);

            Toaster.show('Cập nhật giỏ hàng thành công');
        } catch (error) {
            console.log('Error updateCartItem:', error);
        }
    };



    const clearCart = async () => {
        try {
            await AppAsyncStorage.storeData('CART', []);
            EventBus.emit(EVENT.CLEAR_CART, 0)
        } catch (error) {
            console.log('Error clearCart:', error);
        }
    }

    return {
        readCart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItem
    };
})();


