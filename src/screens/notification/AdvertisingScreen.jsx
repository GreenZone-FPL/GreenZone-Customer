import { Tab, TabView } from '@rneui/themed';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Column, CustomTabView, LightStatusBar, NormalHeader, Row } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { Pressable } from 'react-native';
import { Toaster } from '../../utils';


const width = Dimensions.get('window').width;

const AdvertisingScreen = ({ navigation }) => {
    const [index, setIndex] = useState(0);

    const categories = [
        '#Ưu đãi đặc biệt',
        '#Cập nhật từ GreenZone',
        '#Favorite',
    ];

    const filterAdsByType = (type) =>
        ListAdvertising.filter((item) => item.type === type);

    return (
        <View style={styles.container}>
            <LightStatusBar />
            <NormalHeader title="Khám phá thêm" onLeftPress={() => navigation.goBack()} />



            <Tab
                value={index}
                scrollable
                style={{ marginHorizontal: 16 }}
                onChange={setIndex}
                indicatorStyle={styles.indicator}>
                {categories.map((category, i) => (
                    <Tab.Item
                        key={i}
                        title={category}
                        titleStyle={styles.tabTitle} />
                ))}
            </Tab>



            <TabView
                value={index}
                onChange={setIndex}
                style={{ flex: 1 }}
                animationType="spring">
                {categories.map((category, i) => (
                    <TabView.Item
                        key={i}
                        style={styles.listContainer}>
                        <FlatList
                            data={filterAdsByType(category)}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2}
                            columnWrapperStyle={{ gap: 16, width: '50%', alignItems: 'center' }}
                            style
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => Toaster.show('Tính năng đang phát triển')}
                                    style={{ width: "95%", marginBottom: 16, gap: 5 }}>
                                    <Image source={item.image} style={styles.image} />
                                    <Text style={styles.title} numberOfLines={2} >{item.title}</Text>
                                    <Text style={styles.type}>{item.type}</Text>
                                    <Row>
                                        <Icon
                                            source="calendar-month-outline"
                                            size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                                            color={colors.yellow700}
                                        />
                                        <Text style={styles.date}>{item.date}</Text>
                                    </Row>
                                </Pressable>
                            )}
                        />
                    </TabView.Item>
                ))}
            </TabView>


        </View>
    );
};

const ListAdvertising = [
    {
        id: '1',
        title: 'Ưu đãi đặc biệt',
        image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
        type: '#Ưu đãi đặc biệt',
        date: '03/02'
    },
    {
        id: '2',
        title: 'Giảm 50% combo Trà Sữa Trân Châu Hoàng Kim',
        image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
        type: '#Ưu đãi đặc biệt',
        date: '03/02'
    },
    {
        id: '3',
        title: 'Combo 2 Trà Sữa Trân Châu Hoàng Kim',
        image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
        type: '#Ưu đãi đặc biệt',
        date: '03/02'
    },
    {
        id: '4',
        title: 'Combo 2 Trà Sữa Trân Châu Hoàng Kim',
        image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
        type: '#Ưu đãi đặc biệt',
        date: '03/02'
    },
    {
        id: '5',
        title: 'Sản phẩm mới',
        image: require('../../assets/images/banerlogin.png'),
        type: '#Cập nhật từ GreenZone',
        date: '03/02'
    },
    {
        id: '6',
        title: 'Mùa hè bùng cháy cùng GreenZone Trải ngiệm ngay',
        image: require('../../assets/images/banerlogin.png'),
        type: '#Cập nhật từ GreenZone',
        date: '03/02'
    },
    {
        id: '7',
        title: 'Sản phẩm mới',
        image: require('../../assets/images/banerlogin.png'),
        type: '#Cập nhật từ GreenZone',
        date: '03/02'
    },
    {
        id: '8',
        title: 'Sản phẩm mới',
        image: require('../../assets/images/banerlogin.png'),
        type: '#Cập nhật từ GreenZone',
        date: '03/02'
    },
    {
        id: '9',
        title: 'Cùng thưởng thức đồ uống yêu thích của bạn',
        image: require('../../assets/images/drinkfaforite.jpg'),
        type: '#Favorite',
        date: '03/02'
    },
];

export default AdvertisingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    indicator: {
        backgroundColor: colors.primary,
        height: 3,
    },
    tabTitle: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: '500',
        color: colors.black,
    },
    listContainer: {
        padding: 10,
        marginHorizontal: 8,
        flex: 1
    },
    image: {
        width: '100%',
        height: 160,
        borderRadius: 10,
    },
    title: {
        fontSize: GLOBAL_KEYS.TE,
        fontWeight: 'bold',
        marginTop: 8,
        height: 40,
        color: colors.black
    },
    type: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray900,
    },
    date: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.brown700,
        marginTop: 4,
    },
});
