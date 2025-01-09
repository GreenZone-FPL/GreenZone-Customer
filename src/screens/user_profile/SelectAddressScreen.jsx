import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Icon } from 'react-native-paper';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import NormalHeader from '../../components/headers/NormalHeader';

const SelectAddressScreen = (props) => {
    const navigation = props.navigation
    return (
        <SafeAreaView style={styles.container}>
            <LightStatusBar/>
            <NormalHeader title='Chọn địa chỉ'
                onLeftPress={() => navigation.goBack()}
                rightIcon='magnify'
                enableRightIcon = {true} />
            <View style={styles.content}>
                <Image
                    source={require('../../assets/images/map.png')}
                    style={{ height: 500, width: '100%' }}
                />
                <Card
                    location="Đ. Lê Trọng Tấn, Sơn Kỳ, Tân Phú, Hồ Chí Minh, Việt Nam"
                    distance='0.00km'
                    onPress={() => console.log('thêm địa chỉ')}
                />
                <Card
                    location="Đ. Lê Trọng Tấn/3 Hẻm 221, Khu Phố 2, Tân Phú, Hồ Chí Minh, Việt Nam"
                    distance='1.00km'
                    onPress={() => console.log('thêm địa chỉ')}
                />
            </View>

        </SafeAreaView>
    )
}
const Card = ({ location, onPress, distance }) => (
    <Pressable style={styles.card} onPress={onPress}>
        <Icon source="google-maps" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
        <View style={styles.textContainer}>
            <Text style={styles.cardText}>{location}</Text>
            <Text style={styles.distance}>{distance}</Text>
        </View>
    </Pressable>
);
export default SelectAddressScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.white,
    },
    content: {
        padding: GLOBAL_KEYS.GAP_DEFAULT
    },
    card: {
        flexDirection: 'row',
        gap: GLOBAL_KEYS.GAP_DEFAULT,
        alignItems: 'center',
        padding: GLOBAL_KEYS.PADDING_SMALL,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    cardText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
    },
    distance: {
        color: colors.gray400,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    },
    textContainer: {
        flex: 1,
        gap: GLOBAL_KEYS.GAP_SMALL,
    },
})