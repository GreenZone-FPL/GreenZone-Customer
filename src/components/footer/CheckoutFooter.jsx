import PropTypes from 'prop-types';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { GLOBAL_KEYS, colors } from '../../constants';
import { TextFormatter, Toaster } from '../../utils';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { Row } from '../containers/Row';
import { TitleText } from '../texts/TitleText';
import { TextInput } from 'react-native';

const CheckoutFooterPropTypes = {
    quantity: PropTypes.number.isRequired,
    setQuantity: PropTypes.func.isRequired,
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
    setQuantity,
    handlePlus,
    handleMinus,
    totalPrice,
    buttonTitle,
    onButtonPress,
    backgroundColor = colors.green100
}) => {
    return (
        <Row style={[styles.footer, { backgroundColor: backgroundColor }]}>
            <Row style={{ gap:  5}}>
                <Pressable style={styles.circleWrapper} onPress={handleMinus}>
                    <Feather name={"minus"} color={colors.primary} size={18} />
                </Pressable>

                <TextInput
                    style={{
                        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
                        textAlign: 'center',
                        borderBottomWidth: 1,
                        borderColor: colors.gray300,
                        width: 35
                    }}
                    keyboardType="numeric"
                    value={String(quantity)}
                    onChangeText={(value) => {
                        // Chỉ giữ lại ký tự số
                        const cleanedValue = value.replace(/[^0-9]/g, '');

                        if (cleanedValue === '') {
                            setQuantity('');
                            return;
                        }

                        const parsed = parseInt(cleanedValue, 10);

                        if (isNaN(parsed)) {
                            return;
                        }

                        if (parsed > 99) {
                            setQuantity(99);
                            Toaster.show('Số lượng không vượt quá 99');
                        } else {
                            setQuantity(parsed);
                        }
                    }}
                    onBlur={() => {
                        // Giới hạn khi mất focus, nếu số quá nhỏ, đặt lại thành 1
                        if (!quantity || quantity < 1) setQuantity(1);
                    }}
                />


                <Pressable style={styles.circleWrapper} onPress={handlePlus}>
                    <Feather name={"plus"} color={colors.primary} size={18} />
                </Pressable>
            </Row>

            <PrimaryButton
                style={{ flex: 1, borderRadius: 30, paddingVertical: 13 }}
                titleStyle={{ fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE }}
                title={`${buttonTitle} ${TextFormatter.formatCurrency(totalPrice)}`}
                onPress={onButtonPress}
            />
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


