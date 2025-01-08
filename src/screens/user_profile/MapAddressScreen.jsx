import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Icon } from 'react-native-paper';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import NormalHeader from '../../components/headers/NormalHeader';

const MapAddressScreen = (props) => {
    const navigation = props.navigation
    return (
        <SafeAreaView style={styles.container}>
            <LightStatusBar/>
            <NormalHeader title='Chọn địa chỉ'
                onLeftPress={() => navigation.goBack()}
                leftIcon='chevron-left'
                rightIcon='search' />
            <View style={styles.content}>
                <Image
                    source={require('../../assets/images/map.png')}
                    style={{ height: 500, width: '100%' }}
                />
                <Card
                    icon="google-maps"
                    title="Đ. Lê Trọng Tấn, Sơn Kỳ, Tân Phú, Hồ Chí Minh, Việt Nam"
                    distance='0.00km'
                    onPress={() => navigation.navigate('NewAddressScreen')}
                />
                <View style={styles.separator}></View>
                <Card
                    icon="google-maps"
                    title="Đ. Lê Trọng Tấn/3 Hẻm 221, Khu Phố 2, Tân Phú, Hồ Chí Minh, Việt Nam"
                    distance='1.00km'
                    onPress={() => navigation.navigate('NewAddressScreen')}
                />
            </View>

        </SafeAreaView>
    )
}
const Card = ({ icon, title, onPress, distance }) => (
    <Pressable style={styles.card} onPress={onPress}>
        <Icon source={icon} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.green500} />
        <View style={styles.textContainer}>
            <Text style={styles.cardText}>{title}</Text>
            <Text style={styles.distance}>{distance}</Text>
        </View>
    </Pressable>
);
export default MapAddressScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.white,
    },
    content: {
        paddingHorizontal: GLOBAL_KEYS.GAP_DEFAULT
    },
    card: {
        flexDirection: 'row',
        gap: GLOBAL_KEYS.GAP_DEFAULT,
        alignContent: 'center',
        alignItems: 'center',
        padding: GLOBAL_KEYS.PADDING_SMALL,
        marginVertical: GLOBAL_KEYS.GAP_DEFAULT,
    },
    cardText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
        color: colors.black,
    },
    separator: {
        height: 4,
        backgroundColor: colors.gray200,
        marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    },
    distance: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        color: colors.gray400
    },
    textContainer: {
        flex: 1,
    },
})