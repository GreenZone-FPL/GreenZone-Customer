import React from 'react';
import { View, Modal, StyleSheet, Text, Image, Pressable } from 'react-native';
import { IconButton } from 'react-native-paper';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';

const DialogShippingMethod = ({
    isVisible,
    selectedOption,
    onHide,
    onEdit,
    onOptionSelect,
}) => {
    return (
        <Modal
            visible={isVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={onHide}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    <View style={styles.header}>
                        <View style={styles.placeholderIcon} />
                        <Text style={styles.titleText}>Chọn phương thức đặt hàng</Text>
                        <IconButton
                            icon="close"
                            size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                            color={colors.black}
                            onPress={onHide}
                        />
                    </View>

                    <View style={styles.optionsContainer}>
                        {options.map((option, index) => (
                            <Pressable
                                key={index}
                                style={[
                                    styles.optionItem,
                                    selectedOption === option.label && styles.selectedOption,
                                ]}
                                onPress={() => onOptionSelect(option.label)}
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
                                        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                                        iconColor={colors.primary}
                                        onPress={() => onEdit(option.label)}
                                    />
                                </View>
                                <Text style={styles.normalText}>{option.address}</Text>
                                {option.phone && (
                                    <Text style={styles.phoneText}>{option.phone}</Text>
                                )}
                            </Pressable>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Data mẫu
const options = [
    {
        label: 'Giao hàng',
        image: require('../../assets/images/ic_delivery.png'),
        address:
            'FPT Polytechnic TP. HCM - Tòa F, Công Viên Phần Mềm Quang Trung, Tòa nhà Gen Pacific Lô 3 đường 16, Trung Mỹ Tây, Quận 12, Hồ Chí Minh',
        phone: 'Ngọc Đại | 012345678',
    },
    {
        label: 'Mang đi',
        image: require('../../assets/images/ic_take_away.png'),
        address: 'HCM Đường D1 BTH',
        phone: '',
    },
];

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.overlay,
    },
    modalContainer: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: GLOBAL_KEYS.PADDING_DEFAULT,
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    },
    placeholderIcon: {
        width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        backgroundColor: colors.transparent,
    },
    titleText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
        fontWeight: 'bold',
        color: colors.black,
        textAlign: 'center',
        flex: 1,
    },
    optionsContainer: {
        gap: 8,
        backgroundColor: colors.gray200,
    },
    optionItem: {
        paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        backgroundColor: colors.white,
    },
    selectedOption: {
        backgroundColor: colors.green100,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.green100,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    icon: {
        width: 28,
        height: 28,
        resizeMode: 'cover',
    },
    optionText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: 'bold',
        color: colors.black,
    },
    normalText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray850,
    },
    phoneText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
        fontWeight: '500',
    },
});

export default DialogShippingMethod;
