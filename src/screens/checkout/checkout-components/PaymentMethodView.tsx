import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import { NormalText, Row } from "../../../components";
import { colors } from "../../../constants";

interface PaymentMethodViewProps {
    selectedMethod: any,
    openDialog: () => void;
}

export const PaymentMethodView: React.FC<PaymentMethodViewProps> = ({
    selectedMethod,
    openDialog
}) => {

    return (

        <Row style={styles.row}>
            <NormalText text="Phương thức thanh toán" />

            <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={openDialog}
            >
                {selectedMethod && (
                    <>
                        <Image source={selectedMethod.image} style={styles.image} />
                        <NormalText text={selectedMethod.label} />
                    </>
                )}
                <Icon source="chevron-down" size={24} color={colors.gray700} />
            </TouchableOpacity>
        </Row>

    );
};

const styles = StyleSheet.create({
    row: {
        justifyContent: "space-between",
        paddingHorizontal: 16,
        backgroundColor: colors.white,
        paddingVertical: 8,
        marginVertical: 0
    },
    touchableOpacity: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    image: {
        width: 30,
        height: 30,
        resizeMode: "contain",
        marginRight: 8,
    },
});
