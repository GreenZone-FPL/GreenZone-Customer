import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Column, Row } from "../../components";
import Ani_Success from "../../components/animations/Ani_Success";
import { colors, GLOBAL_KEYS } from "../../constants";
import { MainGraph, OrderGraph } from "../../layouts/graphs";

const OrderSuccessScreen = ({ route, navigation }) => {
    const  orderId  = "67c6b93961edaf498f587588";

    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButtons(true);
        }, 2000); // Hiển thị nút sau 2s

        return () => clearTimeout(timer); // Xóa timeout khi component bị unmount
    }, []);

    return (
        <Column style={styles.container}>

            <Ani_Success visible={true} />

            {showButtons && (
                <>
                    <Text style={styles.successText}>🎉 Đơn hàng đang chờ xác nhận</Text>
                    <Row>
                        {/* Nút Tiếp tục mua hàng */}
                        <TouchableOpacity
                            style={[styles.button, styles.continueButton]}
                            onPress={() => navigation.navigate(MainGraph.graphName)}
                        >
                            <Text style={styles.buttonText}>Tiếp tục mua hàng</Text>
                        </TouchableOpacity>

                        {/* Nút Xem đơn mua */}
                        <TouchableOpacity
                            style={[styles.button, styles.orderButton]}
                            onPress={() => navigation.navigate(OrderGraph.OrderDetailScreen, { orderId })}
                        >
                            <Text style={[styles.buttonText, { color: colors.primary }]}>Đơn mua</Text>
                        </TouchableOpacity>
                    </Row>
                </>

            )}
        </Column>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        gap: 20,
    },
    successText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
        fontWeight: "600",
        color: "#28a745",
        marginBottom: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 6,
        alignItems: "center",
        marginHorizontal: 5,
    },
    continueButton: {
        backgroundColor: colors.primary,
    },
    orderButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    buttonText: {
        color: "#fff",
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: "500",
    },
});

export default OrderSuccessScreen;
