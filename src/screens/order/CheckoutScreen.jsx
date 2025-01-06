import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { IconButton, Icon } from 'react-native-paper';
import GLOBAL_KEYS from '../../constants/globalKeys';
import colors from '../../constants/color';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import NormalHeader from '../../components/headers/NormalHeader';
import CheckoutFooter from '../../components/footer/CheckoutFooter';


const CheckoutScreen = (props) => {

    const { navigation } = props;
    const [quantity, setQuantity] = useState(1);

    const totalPrice = 68000
    return (

        <View style={styles.container}>
            <LightStatusBar />
            <NormalHeader title='Xác nhận đơn hàng' />

            <View style={styles.column}>
                <View style={styles.row}>
                    <Text style={styles.title}>GIAO HÀNG</Text>
                    <Text style={styles.greenText}>Thay đổi</Text>
                </View>
            </View>


            <CheckoutFooter
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
        </View>


    );
};

const CustomRow = ({
    leftText,
    rightText,
    leftColor = colors.black,
    rightColor = colors.black
}) => {
    return (
        <View style={styles.column}>
            <View style={styles.row}>
                <Text style={[styles.leftText, { color: leftColor }]}>{leftText}</Text>
                <Text style={[styles.rightText, { color: rightColor }]}>{rightText}</Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    column: {
        flexDirection: 'column',
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    title: {
        fontWeight: 'bold',
        color: colors.primary
    },
    greenText: {
        color: colors.primary
    }
});

export default CheckoutScreen;

