import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, FlatList, Dimensions } from 'react-native';
import { NormalHeader, LightStatusBar, DialogReviewOder, Row } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';


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
            <NormalHeader title='Đánh giá đơn hàng' onLeftPress={() => navigation.goBack()} />
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
        <Row>
        <Image
                source={require('../../assets/images/ic_take_away.png')}
                style={styles.cardImage}
            />
            <View style={{flex: 1}}>
                <Text style={styles.title}>{item.title}</Text>
                <Row>
                    <Text style={styles.textInfo}>{item.time}</Text>
                        <Text style={styles.textInfo}> - </Text>
                        <Text style={styles.textInfo}>{item.date}</Text>
                </Row>
            </View>
            <Text style={styles.price}>{item.price}</Text>
        </Row>
    </TouchableOpacity>
);

const data = [
    {
        id: '1',
        title: 'Smootthie xoài Nhiệt đới Granola',
        date: '14/1',
        time: '11:50',
        price: '58.000đ',
    },
    {
        id: '2',
        title: 'Trà sữa ô long chân châu',
        date: '14/1',
        time: '18:50',
        price: '100.000đ',
    },
];

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
