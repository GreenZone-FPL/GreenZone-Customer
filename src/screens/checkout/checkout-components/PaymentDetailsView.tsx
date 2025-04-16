import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { DualTextRow, TitleText } from '../../../components';
import { DeliveryMethod, GLOBAL_KEYS, colors } from "../../../constants";
import { CartManager, TextFormatter } from "../../../utils";


interface PaymentDetailsViewProps {
    onSelectVoucher: () => void;
    cartState: any;
    style: ViewProps
}

export const PaymentDetailsView: React.FC<PaymentDetailsViewProps> = ({
    onSelectVoucher,
    cartState,
    style
}) => {
    const {
        orderItems = [],
        deliveryMethod,
        voucher,
        voucherInfo
    } = cartState;

    const paymentDetails = CartManager.getPaymentDetails(cartState);

    return (
        <View style={[styles.containerItem, style]}>
            <TitleText text="Chi tiết thanh toán" style={styles.leftText} />

            <DualTextRow
                style={styles.dualTextRow}
                leftText={`Tạm tính (${orderItems.length} sản phẩm)`}
                rightText={`${TextFormatter.formatCurrency(paymentDetails.cartTotal)}`}
            />

            {deliveryMethod === DeliveryMethod.DELIVERY.value && (
                <DualTextRow
                    style={styles.dualTextRow}
                    leftText="Phí giao hàng"
                    rightText={`${TextFormatter.formatCurrency(paymentDetails.deliveryAmount)}`}
                />
            )}

            <DualTextRow
                style={styles.dualTextRow}
                leftText={voucher ? voucherInfo?.code : 'Chọn khuyến mãi'}
                leftTextStyle={voucher ? styles.voucherSelected : styles.voucherDefault}
                rightText={
                    paymentDetails.voucherAmount === 0
                        ? ''
                        : `- ${TextFormatter.formatCurrency(paymentDetails.voucherAmount)}`
                }
                rightTextStyle={styles.voucherAmount}
                onLeftPress={onSelectVoucher}
            />

            <DualTextRow
                style={styles.dualTextRow}
                leftText="Tổng tiền"
                rightText={`${TextFormatter.formatCurrency(paymentDetails.paymentTotal)}`}
                leftTextStyle={styles.totalLeftText}
                rightTextStyle={styles.totalRightText}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    containerItem: {
        backgroundColor: colors.white,
        marginTop: 5,
    },
    dualTextRow: {
        marginVertical: 0,
        paddingVertical: 8,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
    },
    leftText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
        marginHorizontal: 16,
        marginTop: 10
    },
    voucherSelected: {
        color: colors.primary,
        fontWeight: '500',
    },
    voucherDefault: {
        color: colors.orange700,
        fontWeight: '500',
    },
    voucherAmount: {
        color: colors.primary,
    },
    totalLeftText: {
        color: colors.black,
        fontWeight: '500',
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    },
    totalRightText: {
        fontWeight: '700',
        color: colors.primary,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    },
});
