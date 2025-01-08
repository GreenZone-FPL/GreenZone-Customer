import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Icon } from 'react-native-paper';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import CustomSearchBar from '../../components/inputs/CustomSearchBar';

const SearchAddressScreen = (props) => {
    const navigation = props.navigation
    const [searchQuery, setsearchQuery] = useState('')

    return (
        <SafeAreaView style={styles.container}>
            <LightStatusBar />
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon
                        source="chevron-left"
                        color={colors.black}
                        size={GLOBAL_KEYS.ICON_SIZE_LARGE}
                    />
                </Pressable>
                <CustomSearchBar
                    placeholder="Tìm kiếm..."
                    searchQuery={searchQuery}
                    setSearchQuery={setsearchQuery}
                    onClearIconPress={() => setsearchQuery('')}
                    leftIcon="magnify"
                    rightIcon="close"
                    style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1 }}
                />
            </View>

            <Pressable style={styles.map} onPress={() => navigation.navigate('MapAddressScreen')}>
                    <Icon
                        source="map-search"
                        color={colors.primary}
                        size={GLOBAL_KEYS.ICON_SIZE_LARGE}
                    />
                    <Text>Chọn trên bản đồ</Text>
                    <Icon
                        source="chevron-right"
                        color={colors.primary}
                        size={GLOBAL_KEYS.ICON_SIZE_LARGE}
                    />
            </Pressable>
        </SafeAreaView>
    )
}

export default SearchAddressScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        alignContent: 'center',
        alignItems: 'center',
        gap: GLOBAL_KEYS.GAP_DEFAULT
    },
    map:{
        flexDirection: 'row',
        backgroundColor: colors.white, 
        borderWidth: 1,
        justifyContent: 'space-between',
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        alignContent: 'center',
        alignItems: 'center',
        borderColor: colors.gray200,
        marginTop: GLOBAL_KEYS.GAP_DEFAULT
    }

})