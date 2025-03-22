import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Column, Row } from "../../components";
import Ani_Success from "../../components/animations/Ani_Success";
import { colors, GLOBAL_KEYS, OrderStatus } from "../../constants";
import { MainGraph, OrderGraph } from "../../layouts/graphs";
import { useAppContext } from "../../context/appContext";

const OrderSuccessScreen = ({ route, navigation }) => {
    const { order, orderId } = route.params || null
    const { updateOrderMessage } = useAppContext();
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButtons(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

//    console.log('id:' , orderId)
    return (
        <Column style={styles.container}>

            <Ani_Success visible={true} />

            {showButtons && (
                <>
                    <Text style={styles.successText}>🎉 {updateOrderMessage.message}</Text>
                    <Row>

                        <TouchableOpacity
                            style={[styles.button, styles.continueButton]}
                            onPress={() => navigation.navigate(MainGraph.graphName)}
                        >
                            <Text style={styles.buttonText}>Tiếp tục mua hàng</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={[styles.button, styles.orderButton]}
                            onPress={() => navigation.navigate(OrderGraph.OrderDetailScreen, { orderId: order?.data?._id || orderId })}
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
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
        fontWeight: "500",
        color: colors.black,
        marginBottom: 10,
        textAlign: 'justify',
        lineHeight: 22
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
