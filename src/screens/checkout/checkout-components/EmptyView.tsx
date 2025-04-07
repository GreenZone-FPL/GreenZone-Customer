import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { LightStatusBar, NormalHeader, NormalText } from '../../../components';
import { colors } from '../../../constants';

export const EmptyView = ({ goBack }) => {
    return (
        <View style={styles.container}>
            <LightStatusBar />
            <NormalHeader title="Xác nhận đơn hàng" onLeftPress={goBack} />
            <Image
                resizeMode="contain"
                source={require('../../../assets/images/empty_cart.png')}
                style={{ width: '80%', height: 300, alignSelf: 'center' }}
            />

            <NormalText text="Giỏ hàng của bạn đang trống" />
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.fbBg,
        position: 'relative',
        alignItems: 'center',
        gap: 50
    },
})