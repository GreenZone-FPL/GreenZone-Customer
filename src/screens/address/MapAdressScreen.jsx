import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { CustomSearchBar, LightStatusBar, NormalHeader } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';

const MapAdressScreen = (props) => {
    const navigation = props.navigation
    const [searchQuery, setsearchQuery] = useState('');
    return (
        <SafeAreaView style={styles.container}>
            <LightStatusBar />
            <NormalHeader
                title='Bản đồ'
                onLeftPress={() => navigation.goBack()} />
            <View style={styles.tool}>
                <CustomSearchBar
                    placeholder="Tìm kiếm..."
                    searchQuery={searchQuery}
                    setSearchQuery={setsearchQuery}
                    onClearIconPress={() => setsearchQuery('')}
                    leftIcon="magnify"
                    rightIcon="close"
                    style={{ flex: 1, elevation: 3 }}
                />
            </View>

            <Image
                source={require('../../assets/images/logo.png')}
                style={{ height: '100%', width: '100%' }}
            />

        </SafeAreaView>
    )
}
export default MapAdressScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.white,
    },
    tool: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
        justifyContent: 'space-between',
        gap: GLOBAL_KEYS.GAP_DEFAULT,
        marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    },
})