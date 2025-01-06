import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import GLOBAL_KEYS from '../../constants/globalKeys';
import colors from '../../constants/color';
import PrimaryButton from '../buttons/PrimaryButton';
import QuantitySelector from '../buttons/QuantitySelector';
/**
 *  <CheckoutFooter
        quantity={quantity}
        handlePlus={() => {
            if (quantity < 10) {
                setQuantity(quantity + 1)
            }
        }}
        handleMinus={() => {
            if (quantity > 1) {
                setQuantity(quantity - 1)
            }
        }}
        totalPrice={68000}
        addToCart={() => { }}
    />
 */
const CheckoutFooter = ({
    quantity,
    handlePlus,
    handleMinus,
    totalPrice = 68000,
    addToCart
}) => {
    return (
        <View style={styles.footer}>

            <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <View style={[styles.column, { paddingHorizontal: 0 }]}>
                    <Text style={styles.quantityInfoText}>{quantity} sản phẩm</Text>
                    <Text style={styles.totalText}>{totalPrice}đ</Text>
                </View>

                <QuantitySelector
                    quantity={quantity}
                    activeColor={colors.primary}
                    handlePlus={handlePlus}
                    handleMinus={handleMinus}
                />
            </View>


            <PrimaryButton title='Thêm vào giỏ hàng' onPress={addToCart} />
        </View>
    );
};


const styles = StyleSheet.create({
    footer: {
        padding: 16,
        elevation: 5,
        backgroundColor: colors.white
    },
    infoContainer: {
        flexDirection: 'column',
        marginBottom: 8,
    },
    quantityInfoText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
    },
    totalText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
        fontWeight: 'bold',
        color: colors.primary,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    quantityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.black,
        marginHorizontal: 8,
    },
})

export default CheckoutFooter
