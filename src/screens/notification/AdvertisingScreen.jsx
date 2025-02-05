import { StyleSheet, Text, View, FlatList, Image, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { colors, GLOBAL_KEYS } from '../../constants';
import { LightStatusBar, NormalHeader } from '../../components';
import { Tab, TabView } from '@rneui/themed';
import { Icon } from 'react-native-paper';
import { Row } from '../../components';


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

            {/* Tabs */}
            <View style={{margin: 16}}>
                <Tab
                    value={index}
                    onChange={setIndex}
                    indicatorStyle={styles.indicator}>
                    {categories.map((category, i) => (
                        <Tab.Item
                            key={i}
                            title={category}
                            titleStyle={styles.tabTitle} />
                    ))}
                </Tab>
            </View>
            

            {/* Tab View */}
            <View style={{flex: 1}}>
                <TabView
                    value={index}
                    onChange={setIndex}
                    animationType="spring">
                    {categories.map((category, i) => (
                        <TabView.Item
                            key={i}
                            style={styles.listContainer}>
                            <FlatList
                                data={filterAdsByType(category)}
                                keyExtractor={(item) => item.id.toString()}
                                numColumns={2}
                                columnWrapperStyle={{gap: 10 , width: '50%', alignItems: 'center'}}
                                style
                                renderItem={({ item }) => (
                                    <View style={{width: "95%", marginVertical: 6}}>
                                        <Image source={item.image} style={styles.image} />
                                        <Text style={styles.title} numberOfLines={2} >{item.title}</Text>
                                        <Text style={styles.type}>{item.type}</Text>
                                        <Row>
                                            <Icon
                                                source="calendar-month-outline"
                                                size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                                                color={colors.primary}
                                            />
                                            <Text style={styles.date}>{item.date}</Text>
                                        </Row>
                                    </View>
                                )}
                            />
                        </TabView.Item>
                    ))}
                </TabView>
            </View>
         
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
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        fontWeight: 'bold',
        color: colors.black,
    },
    listContainer: {
        padding: 10,
        marginHorizontal: 8,
        justifyContent: 'space-between',
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
        height: 40
    },
    type: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        color: 'gray',
    },
    date: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        color: colors.gray400,
        marginTop: 4,
    },
});
