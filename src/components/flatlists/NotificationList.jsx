import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Pressable } from 'react-native';
import React from 'react';
import { GLOBAL_KEYS, colors } from '../../constants';
import { TitleText } from '../texts/TitleText';
import { Icon } from 'react-native-paper';
import { Row } from '../containers/Row';
import { Column } from '../containers/Column';

const width = Dimensions.get('window').width;

export const NotificationList = props => {
    const { onSeeMorePress } = props;
    return (
        <View style={{ marginTop: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TitleText text='Khám phá thêm' style={{ marginStart: 16 }} />
                <Pressable
                    style={{ flexDirection: 'row', marginEnd: 16, alignItems: 'center' }}
                    onPress={onSeeMorePress}>
                    <Text style={{ color: colors.primary }}>Xem thêm</Text>
                    <Icon
                        source="chevron-double-right"
                        size={18}
                        color={colors.primary}
                    />
                </Pressable>
            </View>
            <FlatList
                data={ListAdventising}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Column style={styles.itemContainer}>
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

                    </Column>
                )}
            />
        </View>
    );
};

// Danh sách 
const ListAdventising = [
    {
        id: '1',
        title: 'Sản phẩm mới',
        image: require('../../assets/images/banerlogin.png'),
        type: '#Cập nhật từ GreenZone',
        date: '03/02'
    },
    {
        id: '2',
        title: 'Cùng thưởng thức đồ uống yêu thích của bạn',
        image: require('../../assets/images/drinkfaforite.jpg'),
        type: '#Favorite',
        date: '03/02'
    },
    {
        id: '3',
        title: 'Ưu đãi đặc biệt',
        image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
        type: '#Ưu đãi đặc biệt',
        date: '03/02'
    },
];

// Style
const styles = StyleSheet.create({
    itemContainer: {
        width: width / 2,
        padding: 16,
    },
    image: {
        width: '100%',
        height: 160,
        borderRadius: 10,
    },
    title: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
        fontWeight: '500',
        color: colors.black,
    },
    type: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray850,
    },
    date: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        color: colors.brown700,
    },
});

export default NotificationList
