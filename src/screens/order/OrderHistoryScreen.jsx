import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, FlatList, Pressable } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import NormalHeader from '../../components/headers/NormalHeader';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import ScreenEnum from '../../constants/screenEnum';

const width = Dimensions.get('window').width;



// Màn hình chính
const OrderHistoryScreen = (props) => {
    const { navigation } = props;
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'picked', title: 'Đang thực hiện' },
        { key: 'completed', title: 'Đã hoàn thành' },
        { key: 'cancelled', title: 'Đã hủy' },
    ]);

    const renderScene = SceneMap({
        picked: () => (<OrderListView
            onItemPress={() => navigation.navigate(ScreenEnum.OrderDetailScreen)}
            status="Picked"
        />),
        completed: () => <OrderListView status="Completed" />,
        cancelled: () => <OrderListView status="Cancelled" />,
    });

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
                swipeEnabled={false}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: colors.primary, height: 2 }}
                        style={{ backgroundColor: colors.white }}
                        activeColor={colors.primary}
                        inactiveColor={colors.gray700}
                        labelStyle={{ fontSize: 12 }}
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
        <View style={styles.row}>
            <Text style={styles.orderName}>#{order.orderId}</Text>
            <Text style={styles.orderTotal}>{order.totalAmount}đ</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.orderStatus}>{order.status}</Text>
            <Text style={styles.normalText}>4 items</Text>
        </View>



        <Text style={styles.orderTime}>{order.createdAt}</Text>
        {order.estimatedTime && (
            <View style={styles.column} >
                <Text style={styles.normalText}>Đơn hàng đang được giao đến bạn</Text>
                <Text style={styles.estimatedTime}>Dự kiến đến nơi vào {order.estimatedTime} hôm nay</Text>
            </View>
        )}



        {/* FlatList con: Hiển thị danh sách sản phẩm */}
        <FlatList
            data={order.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.productItem}>
                    <Image
                        source={{ uri: 'https://static.vecteezy.com/system/resources/previews/019/199/710/non_2x/bubble-milk-tea-pearl-milk-tea-png.png' }}
                        style={styles.productImage}
                    />
                    <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
                        {item.name}
                    </Text>
                </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
            style={styles.productList}
        />
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
        // backgroundColor: 'green'
    },
    column: {
        flexDirection: 'column',
        gap: 6
    },
    orderItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
        paddingHorizontal: 8,
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
        marginRight: 16,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,

    },
    productName: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        color: '#333', // Màu chữ mặc định cho tên sản phẩm
        textAlign: 'center',
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
