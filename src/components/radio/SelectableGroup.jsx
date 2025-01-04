import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GLOBAL_KEYS from '../../constants/global_keys';
import colors from '../../constants/color';
import Selectable from './Selectable';



const SelectableGroup = ({
    items,
    title = "Default title",
    selectedGroup,
    required = false,
    note,
    setSelectedGroup
}) => {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {title}
                {required && <Text style={styles.redText}>*</Text>}
                {note && <Text style={styles.note}> ({note})</Text>}
            </Text>
            {items.map(item => {
                return (
                    <Selectable
                        item={item}
                        quantity={selectedGroup.find(selectedItem => selectedItem.id === item.id)?.quantity || 0}
                        selected={selectedGroup.some(selectedItem => selectedItem.id === item.id)}
                        handlePlus={(item) => handlePlus(item, selectedGroup, setSelectedGroup)} 
                        handleMinus={(item) => handleMinus(item, selectedGroup, setSelectedGroup)}
                        key={item.id}
                    />
                );
            })}
        </View>
    );
};


// Hàm xử lý tăng số lượng
const handlePlus = (itemToPlus, selectedGroup, setSelectedGroup) => {
    const existingItem = selectedGroup.find(item => item.id === itemToPlus.id);

    if (!existingItem) {
        // Thêm item mới với quantity là 1
        setSelectedGroup(prevGroup => [...prevGroup, { ...itemToPlus, quantity: 1 }]);
    } else {
        // Nếu item đã tồn tại và quantity nhỏ hơn 3, tăng quantity
        if (existingItem.quantity < 3) {
            setSelectedGroup(prevGroup =>
                prevGroup.map(item =>
                    item.id === itemToPlus.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        }
    }
};

// Hàm xử lý giảm số lượng
const handleMinus = (itemToMinus, selectedGroup, setSelectedGroup) => {
    const existingItem = selectedGroup.find(item => item.id === itemToMinus.id);

    if (existingItem && existingItem.quantity > 1) {
        setSelectedGroup(prevGroup =>
            prevGroup.map(item =>
                item.id === itemToMinus.id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    } else {
        setSelectedGroup(prevGroup => prevGroup.filter(item => item.id !== itemToMinus.id));
    }
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    title: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
        fontWeight: 'bold',
        marginBottom: GLOBAL_KEYS.PADDING_SMALL,
    },
    redText: {
        color: colors.red800,
    },
    note: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: '400',
    }
});

export default SelectableGroup;
