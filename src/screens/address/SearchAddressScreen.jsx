import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { CustomSearchBar, LightStatusBar, DialogBasic, PrimaryButton } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { UserGraph } from '../../layouts/graphs';
import SelectLocation from './locations/SelectLocation';
import { useAppContext } from '../../context/appContext';

const SearchAddressScreen = (props) => {
    const navigation = props.navigation;
    const [searchQuery, setSearchQuery] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const { selectedAddresses, addAddress, setSelectedAddress } = useAppContext();

    const handleSelectAddress = (address) => {
        const formattedAddress = {
            ...address,
            selectedWard: address.selectedWard || { label: '---', value: '' },
            selectedDistrict: address.selectedDistrict || { label: '---', value: '' },
            selectedProvince: address.selectedProvince || { label: '---', value: '' },
        };
    
        console.log('Địa chỉ sau khi chuẩn hóa:', formattedAddress);
        addAddress(formattedAddress);
        setSelectedAddress(formattedAddress);
        setIsVisible(false);
    };
    
    

    return (
        <SafeAreaView style={styles.container}>
            <LightStatusBar />
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon
                        source="arrow-left"
                        color={colors.black}
                        size={GLOBAL_KEYS.ICON_SIZE_LARGE}
                    />
                </Pressable>
                <CustomSearchBar
                    placeholder="Tìm kiếm..."
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onClearIconPress={() => setSearchQuery('')}
                    leftIcon="magnify"
                    rightIcon="close"
                    style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray300 }}
                />
            </View>
            <Pressable
                style={styles.map}
                onPress={() => navigation.navigate(UserGraph.SelectAddressScreen)}>
                <Icon source="map-search" color={colors.primary} size={GLOBAL_KEYS.ICON_SIZE_LARGE} />
                <Text style={styles.normalText}>Chọn trên bản đồ</Text>
                <Icon source="chevron-right" color={colors.primary} size={GLOBAL_KEYS.ICON_SIZE_LARGE} />
            </Pressable>
            <Pressable style={styles.map} onPress={() => setIsVisible(true)}>
                <Icon source="form-select" color={colors.primary} size={GLOBAL_KEYS.ICON_SIZE_LARGE} />
                <Text style={styles.normalText}>Chọn địa chỉ</Text>
                <Icon source="chevron-down" color={colors.primary} size={GLOBAL_KEYS.ICON_SIZE_LARGE} />
            </Pressable>
            {isVisible && <SelectLocation onHide={() => setIsVisible(false)} onSelectAddress={handleSelectAddress} />}
            <View style={styles.viewLocation}>
                {selectedAddresses.length > 0 && selectedAddresses.map((address, index) => (
                    <Card
                    key={index}
                    address={address}
                    onPress={() => {
                        setSelectedAddress(address); // Lưu vào context
                        navigation.goBack(); // Quay lại màn hình trước đó
                    }}
                />
                
                ))}
            </View>
        </SafeAreaView>
    );
};

const Card = ({ address, onPress }) => (
    <Pressable style={styles.card} onPress={onPress}>
        <Icon source="google-maps" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE }}>
                {address?.specificAddress}
            </Text>
            <Text style={styles.location}>
                {address?.specificAddress}, {address?.ward || address?.selectedWard?.label},
                {address?.district || address?.selectedDistrict?.label},
                {address?.province || address?.selectedProvince?.label}
            </Text>
            <Text style={styles.distance}>0km</Text>
        </View>
    </Pressable>
);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        alignItems: 'center',
        gap: GLOBAL_KEYS.GAP_DEFAULT
    },
    map: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        justifyContent: 'space-between',
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        alignItems: 'center',
        marginTop: GLOBAL_KEYS.GAP_DEFAULT,
        borderRadius: 6,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    normalText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black
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
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
        width: '68%'
    },
    distance: {
        color: colors.gray700,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    },
    viewLocation: {
        margin: 16
    },
});

export default SearchAddressScreen;
