import React from "react";
import { StyleSheet, View } from "react-native";
import { DualTextRow, NormalText } from '../../../components';
import { DeliveryMethod, GLOBAL_KEYS, colors } from "../../../constants";

interface ShippingAddressProps {
    deliveryMethod: string;
    shippingAddressInfo: any;
    chooseUserAddress: () => void;
}

export const ShippingAddress: React.FC<ShippingAddressProps> = ({
    deliveryMethod,
    shippingAddressInfo,
    chooseUserAddress,
}) => {
    return (
        <View style={[styles.containerItem, styles.containerOverride]}>
            <DualTextRow
                style={styles.dualTextRow}
                leftText="Địa chỉ nhận hàng"
                leftTextStyle={styles.leftText}
                rightText="Thay đổi"
                rightTextStyle={styles.rightText}
                onRightPress={chooseUserAddress}
            />
            {deliveryMethod !== DeliveryMethod.PICK_UP.value && shippingAddressInfo ? (
                <>
                    {shippingAddressInfo.description && (
                        <NormalText
                            text={shippingAddressInfo.description}
                            style={styles.textLine}
                        />
                    )}
                    {shippingAddressInfo.location && (
                        <NormalText
                            text={shippingAddressInfo.location}
                            style={styles.textLine}
                        />
                    )}
                </>
            ) : (
                <NormalText
                    text="Vui lòng chọn địa chỉ giao hàng"
                    style={styles.warningText}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    containerItem: {
        marginBottom: GLOBAL_KEYS.PADDING_SMALL,
        paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        backgroundColor: colors.white,
    },
    containerOverride: {
        marginBottom: 0,
    },
    dualTextRow: {
        marginVertical: 0,
        marginBottom: 8,
    },
    leftText: {
        fontWeight: '600',
    },
    rightText: {
        color: colors.primary,
    },
    textLine: {
        lineHeight: 20,
        color: colors.black,
    },
    warningText: {
        color: colors.orange700,
    },
});
