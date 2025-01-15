import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Icon } from 'react-native-paper';
import { LightStatusBar, NormalHeader } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';

const SelectAddressScreen = (props) => {
    const navigation = props.navigation
    return (
        <SafeAreaView style={styles.container}>
            <LightStatusBar />
            <NormalHeader
                title='Chọn địa chỉ'
                onLeftPress={() => navigation.goBack()}
                rightIcon='magnify'
                enableRightIcon={true} />

            <ScrollView style={styles.content}>
                <Image
                    source={require('../../assets/images/map.png')}
                    style={{ height: 500, width: '100%', marginBottom: 8 }}
                />
                <Card
                    location="Đ. Lê Trọng Tấn, Sơn Kỳ, Tân Phú, Hồ Chí Minh, Việt Nam"
                    distance='0.00 km'
                    onPress={() => { }}
                />
                <Card
                    location="Đ. Lê Trọng Tấn/3 Hẻm 221, Khu Phố 2, Tân Phú, Hồ Chí Minh, Việt Nam"
                    distance='1.00 km'
                    onPress={() => { }}
                />
            </ScrollView>

        </SafeAreaView>
    )
}
const Card = ({ location, onPress, distance }) => (
    <Pressable style={styles.card} onPress={onPress}>
        <Icon source="google-maps" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
        <View style={styles.textContainer}>
            <Text style={styles.location}>{location}</Text>
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
        paddingHorizontal: GLOBAL_KEYS.GAP_DEFAULT,
        gap: 16
    },
    card: {
        flexDirection: 'row',
        gap: GLOBAL_KEYS.GAP_DEFAULT,
        alignItems: 'center',
        padding: GLOBAL_KEYS.PADDING_SMALL,
        backgroundColor: colors.white,
        borderRadius: 8,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 8
    },
    location: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
        textAlign: 'justify',
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT
    },
    distance: {
        color: colors.gray700,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    },
    textContainer: {
        flex: 1,
        gap: GLOBAL_KEYS.GAP_SMALL,
    },
})