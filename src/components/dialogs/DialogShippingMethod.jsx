import React, { useState } from 'react';
import { View, Button, Modal, StyleSheet, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import { IconButton } from 'react-native-paper';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/global_keys';



const DialogShippingMethod = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => setSelectedOption(option);
    const showModal = () => {
        if (!isVisible) {
            setIsVisible(true);
        }
    };

    const hideModal = () => {
        if (isVisible) {
            setIsVisible(false);
        }
    };

    const handleEdit = (option) => console.log(`Editing ${option}`);

    return (
        <View style={styles.container}>
            <Button title="Open Modal" onPress={showModal} />
            <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={hideModal}>
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <View style={{ width: GLOBAL_KEYS.ICON_SIZE_DEFAULT, height: GLOBAL_KEYS.ICON_SIZE_DEFAULT, backgroundColor: colors.transparent }} ></View>
                            <Text style={styles.titleText}>Chọn phương thức đặt hàng</Text>
                            <IconButton icon="close" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.black} onPress={hideModal} />
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
                                            size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
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
            </Modal>
        </View>
    );
};
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
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
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
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom:  GLOBAL_KEYS.PADDING_DEFAULT, paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT },
    titleText: { fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER, fontWeight: 'bold', color: colors.black, textAlign: 'center', flex: 1 },
    optionsContainer: { gap: 8, backgroundColor: colors.gray200 },
    optionItem: { paddingVertical:  GLOBAL_KEYS.PADDING_SMALL, paddingHorizontal:  GLOBAL_KEYS.PADDING_DEFAULT, backgroundColor: colors.white },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.green100, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    icon: { width: 28, height: 28, resizeMode: 'cover' },
    optionText: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: 'bold', color: colors.black },
    normalText: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.gray850 },
});

export default DialogShippingMethod;
