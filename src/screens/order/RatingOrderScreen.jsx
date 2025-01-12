import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, FlatList, Dimensions } from 'react-native';
import { NormalHeader, LightStatusBar } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { DialogReviewOder } from '../../components/dialogs/DialogReviewOder';

const { height, width } = Dimensions.get('window');

const RatingOrderScreen = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigation = props.navigation;

    const handleItemPress = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LightStatusBar />
            <NormalHeader title='Đánh giá đơn hàng' onPress={() => navigation.goBack()} />
            <FlatList
                data={data}
                renderItem={({ item }) => <Card item={item} onPress={() => handleItemPress(item)} />}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
            />
            <DialogReviewOder
                isVisible={modalVisible}
                onHide={closeModal}
                item={selectedItem} 
            />
        </SafeAreaView>
    );
};

const Card = ({ item, onPress }) => (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
        <View style={styles.row}>
            <Image
                source={require('../../assets/images/ic_take_away.png')}
                style={styles.cardImage}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.textInfo}>{item.createdAt}</Text>
            </View>
            <Text style={styles.price}>{item.price}</Text>
        </View>
    </TouchableOpacity>
);





export default RatingOrderScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 16,
        padding: GLOBAL_KEYS.PADDING_SMALL,
        borderBottomWidth: 1,
        borderColor: colors.gray200,
    },
    cardImage: {
        width: width / 8,
        height: height / 14,
        resizeMode: 'contain',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        gap: GLOBAL_KEYS.GAP_SMALL,
    },
    rowtime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: '700',
        color: colors.black,
        flexWrap: 'wrap',
    },
    textInfo: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        color: colors.gray700,
    },
    price: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: '600',
        color: colors.primary,
    },
});
