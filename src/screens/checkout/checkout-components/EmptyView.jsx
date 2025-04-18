import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { LightStatusBar, NormalHeader, NormalText } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';

export const EmptyView = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <LightStatusBar />
            <NormalHeader title="Xác nhận đơn hàng" onLeftPress={() => navigation.goBack()} />
            <Image
                resizeMode="contain"
                source={require('../../../assets/images/empty_cart.png')}
                style={styles.image}
            />
            <NormalText text="Giỏ hàng của bạn đang trống" style={styles.text} />
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
        gap: 50,
    },
    image: {
        width: '80%',
        height: 300,
        alignSelf: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
        color: colors.black,
    },
});
