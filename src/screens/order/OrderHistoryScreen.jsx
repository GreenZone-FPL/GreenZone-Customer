import React, { useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { Column, DualTextRow, LightStatusBar, NormalHeader, NormalText, Row } from '../../components';
import { colors, GLOBAL_KEYS, ScreenEnum } from '../../constants';

const width = Dimensions.get('window').width;


const OrderHistoryScreen = (props) => {
    const { navigation } = props;
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'picked', title: 'Đang thực hiện' },
        { key: 'completed', title: 'Đã hoàn thành' },
        { key: 'cancelled', title: 'Đã hủy' },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'picked':
                return (
                    <OrderListView
                        onItemPress={() => navigation.navigate(ScreenEnum.OrderDetailScreen)}
                        status="Picked"
                    />
                );
            case 'completed':
                return <OrderListView
                    onItemPress={() => navigation.navigate(ScreenEnum.OrderDetailScreen)}
                    status="Completed" />;
            case 'cancelled':
                return <OrderListView
                    onItemPress={() => navigation.navigate(ScreenEnum.OrderDetailScreen)}
                    status="Cancelled" />;
            default:
                return null;
        }
    };


    return (
        <View style={styles.container}>
            <LightStatusBar />
            <NormalHeader
                title="Lịch sử đơn hàng"
                onLeftPress={() => navigation.goBack()}
            />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width }}
                swipeEnabled={true}
                lazy // Kích hoạt chế độ lazy
                renderLazyPlaceholder={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Đang tải...</Text>
                    </View>
                )}

                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: colors.primary, height: 2 }}
                        style={{ backgroundColor: colors.white }}
                        activeColor={colors.primary}
                        inactiveColor={colors.gray700}
                    />
                )}
            />

        </View>
    );
};


const OrderItem = ({
    order,
    onPress
}) => (
    <Pressable
        onPress={onPress}
        style={styles.orderItem}>

        <DualTextRow
            leftText={order.orderId}
            rightText={`${order.totalAmount}`}
            leftTextStyle={styles.orderName}
            rightTextStyle={styles.orderTotal}
            style={{ marginVertical: 0 }}
        />

        <DualTextRow
            leftText={order.status}
            rightText="4 items"
            leftTextStyle={styles.orderStatus}
            rightTextStyle={styles.normalText}
            style={{ marginVertical: 0 }}
        />


        {/* FlatList con: Hiển thị danh sách sản phẩm */}
        <FlatList
            data={order.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <Column style={styles.productItem}>
                    <Image
                        source={{ uri: 'https://www.onicifood.com/cdn/shop/products/332594556_3485601318363625_7384526670140317642_n.png?v=1677766982&width=1445' }}
                        style={styles.productImage}
                    />
                    <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
                        {item.name}
                    </Text>
                </Column>
            )}
            horizontal={true}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
        />

        <Row style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>

            <NormalText
                style={{ color: colors.gray850 }}
                text={order.createdAt} />

            {order.estimatedTime && (

                <Column>
                    <NormalText text='Đơn hàng đang được giao đến bạn' />

                    <NormalText
                        style={{ color: colors.primary }}
                        text={`Dự kiến đến nơi vào ${order.estimatedTime} hôm nay`} />
                </Column>


            )}
        </Row>
    </Pressable>
);

// Dữ liệu đơn hàng (mẫu)
const orders = [
    {
        orderId: '22124-3772987543535',
        totalAmount: 150000,
        status: 'Picked', // Đang thực hiện
        createdAt: '10:16, 22/12/2024',
        estimatedTime: '10:30',
        items: [
            { id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000 },
            { id: '2', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '3', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '4', name: 'Kem Cheese', quantity: 2, price: 20000 },
        ],
    },

    {
        orderId: '22124-3772987543537',
        totalAmount: 200000,
        status: 'Completed', // Đã hoàn thành
        createdAt: '10:16, 22/12/2024',
        estimatedTime: null,
        items: [{ id: '3', name: 'Trà Sữa Truyền Thống', quantity: 3, price: 50000 }],
    },
    {
        orderId: '22124-3772987543538',
        totalAmount: 80000,
        status: 'Cancelled', // Đã hủy
        createdAt: '10:16, 22/12/2024',
        estimatedTime: null,
        items: [{ id: '4', name: 'Trà Đào Cam Sả', quantity: 1, price: 80000 }],
    },
    {
        orderId: '22124-3772987543539',
        totalAmount: 150000,
        status: 'Picked',
        createdAt: '10:16, 22/12/2024',
        estimatedTime: '10:30',
        items: [
            { id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000 },
            { id: '2', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '3', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '4', name: 'Kem Cheese', quantity: 2, price: 20000 },
        ],
    },
];





// Màn hình từng trạng thái
const OrderListView = ({ status, onItemPress }) => {
    const filteredOrders = orders.filter((order) => order.status === status);

    return (
        <View style={styles.scene}>
            {filteredOrders.length > 0 ? (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={(item) => item.orderId}
                    contentContainerStyle={{ gap: 8 }}
                    renderItem={({ item }) =>
                        <OrderItem
                            onPress={() => { onItemPress() }}
                            order={item} />
                    }
                />
            ) : (
                <EmptyView
                    message={
                        status === 'Picked'
                            ? 'Chưa có đơn hàng cần thực hiện'
                            : status === 'Completed'
                                ? 'Chưa có đơn hàng hoàn thành'
                                : 'Chưa có đơn hàng đã hủy'
                    }
                />
            )}
        </View>
    );
};

// Component trống
const EmptyView = ({ message }) => (
    <View style={styles.emptyContainer}>
        <Image
            style={styles.image}
            resizeMode="cover"
            source={require('../../assets/images/logo.png')}
        />
        <Text>{message}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scene: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width / 2,
        height: width / 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    column: {
        flexDirection: 'column',
        gap: 6
    },
    orderItem: {
        backgroundColor: colors.white,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
        paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL,
        gap: 6,
        shadowColor: colors.black,
        shadowOffset: { width: 5, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    orderName: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: '500',
    },
    orderStatus: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.pink500,
        fontWeight: '500'

    },
    orderTotal: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.pink500,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    orderTime: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray850,

    },

    productItem: {
        width: 80,
        maxHeight: 120,
        alignItems: 'center',
        gap: 5
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,

    },
    productName: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        color: colors.black,
        textAlign: 'center',
        overflow: 'hidden'
    },
    normalText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray850
    },
    estimatedTime: {
        fontWeight: '400',
        color: colors.primary,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    }
});

export default OrderHistoryScreen;
