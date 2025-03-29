import PropTypes from 'prop-types';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { GLOBAL_KEYS, colors } from '../../constants';
import { TextFormatter } from '../../utils';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { Row } from '../containers/Row';
import { TitleText } from '../texts/TitleText';

const CheckoutFooterPropTypes = {
    quantity: PropTypes.number.isRequired,
    handlePlus: PropTypes.func.isRequired,
    handleMinus: PropTypes.func.isRequired,
    totalPrice: PropTypes.number,
    buttonTitle: PropTypes.string,
    onButtonPress: PropTypes.func,
    backgroundColor: PropTypes.string
};

/**
 * Usage Example
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
        buttonTitle="Thêm vào giỏ hàng"
        onButtonPress={() => { console.log('Thêm vào giỏ hàng') }}
    />
 */
export const CheckoutFooter = ({

    quantity,
    handlePlus,
    handleMinus,
    totalPrice,
    buttonTitle,
    onButtonPress,
    backgroundColor = colors.green100
}) => {
    return (
        <Row style={[styles.footer, { backgroundColor: backgroundColor }]}>

            <Row style={{gap: 20}}>

                <Pressable style={styles.circleWrapper} onPress={handleMinus}>
                    <Feather name={"minus"} color={colors.primary} size={18} />
                </Pressable>


                <TitleText
                    style={{fontSize: 18}}
                    text={quantity}
                />


                <Pressable style={styles.circleWrapper} onPress={handlePlus}>
                    <Feather name={"plus"} color={colors.primary} size={18} />
                </Pressable>

            </Row>

            <PrimaryButton
                style={{ flex: 1, borderRadius: 16 }}
                titleStyle={{ fontSize: 16 }}
                title={`${buttonTitle} ${TextFormatter.formatCurrency(totalPrice)}`}
                onPress={onButtonPress} />
        </Row>
    );
};


CheckoutFooter.propTypes = CheckoutFooterPropTypes;


const styles = StyleSheet.create({
    footer: {
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        backgroundColor: colors.green100,
        gap: 16,
        flexDirection: 'row',
        borderColor: colors.fbBg,
        borderWidth: 1
    },
    quantityInfoText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
    },
    totalText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
    },

    quantityText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: 'bold',
        color: colors.black,
        marginHorizontal: GLOBAL_KEYS.PADDING_SMALL,
    },
    circleWrapper: {
        borderRadius: 28,
        backgroundColor: colors.fbBg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12
    }
});


