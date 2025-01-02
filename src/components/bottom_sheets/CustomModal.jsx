import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, StatusBar } from 'react-native';
import { IconButton } from 'react-native-paper';
import OverlayStatusBar from '../status_bars/OverlayStatusBar';
import GLOBAL_KEYS from '../../constants/global_keys';
import colors from '../../constants/color';

const CustomModal = (props) => {
    const { navigation } = props;
    const hideModal = () => { navigation.goBack(); };
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const handleOptionSelect = (option) => setSelectedOption(option);
    const handleEdit = (option) => console.log(`Editing ${option}`);

    return (
        <View style={styles.modalContainer}>
            <OverlayStatusBar />

            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <View style={{ width: GLOBAL_KEYS.ICON_SIZE_SMALL, height: GLOBAL_KEYS.ICON_SIZE_SMALL, backgroundColor: colors.transparent }}></View>
                    <Text style={styles.titleText}>Chọn phương thức đặt hàng</Text>
                    <IconButton icon="close" size={GLOBAL_KEYS.ICON_SIZE_SMALL} color={colors.black} onPress={hideModal} />
                </View>

                <View style={styles.optionsContainer}>
                    {options.map((option, index) => (
                        <Pressable
                            key={index}
                            style={[styles.optionItem, selectedOption === option.label && { backgroundColor: colors.green100 }]}
                            onPress={() => handleOptionSelect(option.label)}
                        >
                            <View style={styles.row}>
                                <View style={styles.row}>
                                    <View style={styles.iconContainer}>
                                        <Image source={option.image} style={styles.icon} />
                                    </View>
                                    <Text style={styles.optionText}>{option.label}</Text>
                                </View>
                                <IconButton
                                    icon="square-edit-outline"
                                    size={GLOBAL_KEYS.ICON_SIZE_SMALL}
                                    iconColor={colors.primary}
                                    onPress={() => handleEdit(option.label)}
                                />
                            </View>
                            <Text style={styles.normalText}>{option.address}</Text>
                            {option.phone && <Text style={[styles.normalText, { color: colors.black, fontWeight: '500' }]}>{option.phone}</Text>}
                        </Pressable>
                    ))}
                </View>
            </View>
        </View>
    );
}

const options = [
    {
        label: 'Giao hàng',
        image: require('../../assets/images/ic_delivery.png'),
        address: 'FPT Polytechnic TP. HCM - Tòa F, Công Viên Phần Mềm Quang Trung, Tòa nhà Gen Pacific Lô 3 đường 16, Trung Mỹ Tây, Quận 12, Hồ Chí Minh',
        phone: 'Ngọc Đại | 012345678'
    },

    {
        label: 'Mang đi',
        image: require('../../assets/images/ic_take_away.png'),
        address: 'HCM Đường D1 BTH',
        phone: ''
    }
];

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: colors.overlay,
        flex: 1,
        justifyContent: 'flex-end',
        width: '100%',
        marginTop: -StatusBar.currentHeight,
    },
    modalContent: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        backgroundColor: colors.white
    },
    titleText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: '700',
        color: colors.black,
        textAlign: 'center',
        flex: 1
    },
    optionsContainer: {
        gap: 8,
        backgroundColor: colors.gray200
    },
    optionItem: {
        paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        backgroundColor: colors.white
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.green100,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    icon: {
        width: 28,
        height: 28,
        resizeMode: 'cover'
    },
    optionText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: '700',
        color: colors.black
    },
    normalText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray850,
        textAlign: 'justify'
    },
});

export default CustomModal;
