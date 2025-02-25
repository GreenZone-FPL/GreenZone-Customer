import { AppAsyncStorage } from "./appAsyncStorage";
import { Toaster } from "./toaster";

// closure
export const CartManager = (() => {
    
    const readCart = async () => {
        try {
            const CART = await AppAsyncStorage.readData('CART', null);
            console.log('read CART ', CART);
            console.log('read cart length', CART?.length || 0);
            return CART
        } catch (error) {
            console.log('error read CART', error);
        }
    };

    const addToCart = async (product, variant, selectedToppings, amount, quantity, note) => {
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
                    price: amount,
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
       
        readCart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart

    };
})();


