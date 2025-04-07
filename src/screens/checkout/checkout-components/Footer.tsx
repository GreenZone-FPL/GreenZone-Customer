import React from "react";
import { Alert, Pressable, StyleSheet } from "react-native";
import { Column, NormalText, Row, TitleText } from '../../../components';
import { GLOBAL_KEYS, colors } from "../../../constants";
import { CartManager, TextFormatter } from '../../../utils';
import { TimeInfo } from "../../../type/checkout";


interface FooterProps {
    cartState: any;
    showDialog: () => void;
    timeInfo: TimeInfo;
    cartDispatch: React.Dispatch<any>;
}

export const Footer: React.FC<FooterProps> = ({ cartState, showDialog, timeInfo, cartDispatch }) => {
    const paymentDetails = CartManager.getPaymentDetails(cartState);

    return (
        <Row style={styles.container}>
            <Column>
                <TitleText
                    style={styles.totalText}
                    text={`${TextFormatter.formatCurrency(paymentDetails.paymentTotal)}`}
                />
                <NormalText text={`${cartState.orderItems.length} sản phẩm`} />
                {cartState?.voucher && (
                    <NormalText
                        text={`Bạn tiết kiệm ${TextFormatter.formatCurrency(paymentDetails.voucherAmount)}`}
                        style={styles.voucherText}
                    />
                )}
            </Column>

            <Pressable
                onPress={async () => {
                    const orderInfo = {
                        fulfillmentDateTime:
                            timeInfo?.fulfillmentDateTime || new Date().toISOString(),
                        totalPrice: paymentDetails.paymentTotal,
                    };
                    const newCart = await CartManager.updateOrderInfo(cartDispatch, orderInfo);

                    const missingFields = CartManager.checkValid(newCart);
                    if (missingFields) {
                        Alert.alert('Thiếu thông tin', `${missingFields.join(', ')}`);
                        return;
                    }
                    showDialog();
                }}
                style={styles.orderButton}
            >
                <TitleText
                    text="Đặt hàng"
                    style={styles.orderButtonText}
                />
            </Pressable>
        </Row>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderTopColor: colors.gray200,
        borderTopWidth: 1,
        justifyContent: 'space-between',
        marginBottom: 6,
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
    },
    totalText: {
        fontSize: 18,
        color: colors.pink500,
        fontWeight: '700',
    },
    voucherText: {
        color: colors.primary,
        fontWeight: '500',
    },
    orderButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    orderButtonText: {
        color: colors.white,
        textAlign: 'right',
        fontSize: 14,
    },
});
