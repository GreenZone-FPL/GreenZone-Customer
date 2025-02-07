import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import { NormalHeader, Row, Column, DualTextRow, LightStatusBar, DialogBasic, PrimaryButton } from '../../components';
import { Icon, RadioButton } from 'react-native-paper';



const OrderCartScreen = (props) => {
    const navigation = props.navigation;

    return (
        <View style={styles.container}>
            <LightStatusBar />
            <NormalHeader title="Xác nhận đơn hàng" onLeftPress={() => navigation.goBack()} />
            <ScrollView>
                <AddressInfo />
                <Timegive />
                <ProductsInfo />

                <PaymentDetails />

                <PayOrder />
            </ScrollView>


        </View>
    );
};
export default OrderCartScreen;


const AddressInfo = () => {

    const [currentLocation, setCurrentLocation] = useState('');
    const [locationAvailable, setLocationAvailable] = useState(false);

    // Lấy vị trí người dùng
    useEffect(() => {
        Geolocation.getCurrentPosition(position => {
            if (position.coords) {
                reverseGeocode({
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                });
            }
        });
    }, []);

    const reverseGeocode = async ({ lat, long }) => {
        const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VI&apikey=Q9zv9fPQ8xwTBc2UqcUkP32bXAR1_ZA-8wLk7tjgRWo`;

        try {
            const res = await axios(api);
            if (res && res.status === 200 && res.data) {
                const items = res.data.items;
                setCurrentLocation(items[0]);
                setLocationAvailable(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const options = [
        {
            id: 1,
            label: 'Giao hàng',
            address: locationAvailable
                ? currentLocation.address.label
                : 'Đang lấy vị trí...',
            phone: 'Ngọc Đại | 012345678',
        },
    ];

    return (
        <View style={styles.optionsContainer}>
            <FlatList
                data={options}
                keyExtractor={(item) => item.id.toString()}
                nestedScrollEnabled
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.optionItem}>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionLabel}>{item.label}</Text>
                            <Row style={styles.row}>
                                <Text style={styles.title}>Địa chỉ nhận hàng</Text>
                                <Icon
                                    source="square-edit-outline"
                                    size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                                    color={colors.primary}
                                />
                            </Row>
                            <Text style={styles.optionAddress}>{item.address}</Text>
                            <View>
                                <Row style={styles.row}>
                                    <Text style={styles.title}>Thông tin người nhận</Text>
                                    <Icon
                                        source="square-edit-outline"
                                        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                                        color={colors.primary}
                                    />
                                </Row>
                            </View>
                            <Text style={styles.optionPhone}>{item.phone}</Text>

                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const days = ["Hôm nay", "Ngày mai"];
const timeSlots = Array.from({ length: 14 }, (_, i) => `${8 + Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`);

const Timegive = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedDay, setSelectedDay] = useState(days[0]); // Mặc định là "Hôm nay"
    const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
    const timeListRef = useRef(null);

    return (
        <View style={{ paddingHorizontal: 16 }}>
            <TouchableOpacity onPress={() => setIsVisible(true)}>
                <Text style={styles.title}>Thời gian nhận</Text>
                <Text style={styles.selectedTime}>{selectedDay} - {selectedTime}</Text>
            </TouchableOpacity>
            <DialogBasic isVisible={isVisible} onHide={() => setIsVisible(false)} title="Thời gian nhận">
                <View style={styles.containerTime}>
                    {/* Danh sách ngày */}
                    <FlatList
                        data={days}
                        keyExtractor={(item) => item}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.dayItem, selectedDay === item && styles.selectedDay]}
                                onPress={() => {
                                    setSelectedDay(item);
                                    setSelectedTime(timeSlots[0]); // Reset về 8:00 khi đổi ngày
                                }}
                            >
                                <Text style={[styles.dayText, selectedDay === item && styles.selectedDayText]}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    {/* Danh sách giờ */}
                    <FlatList
                        ref={timeListRef}
                        data={timeSlots}
                        keyExtractor={(item) => item}
                        showsVerticalScrollIndicator={false}
                        snapToAlignment="center"
                        nestedScrollEnabled={true}
                        snapToInterval={50} // Điều chỉnh để căn giữa
                        decelerationRate="fast"
                        initialNumToRender={3} // Chỉ render trước 3 item
                        maxToRenderPerBatch={3} // Render tối đa 3 item cùng lúc
                        windowSize={3} // Giữ 3 item trong bộ nhớ để tối ưu hiệu suất
                        style={{ maxHeight: 150 }} // Giới hạn chiều cao để chỉ hiển thị 3 item (50px mỗi item)
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.timeItem, selectedTime === item && styles.selectedTimeItem]}
                                onPress={() => setSelectedTime(item)}
                            >
                                <Text style={[styles.timeText, selectedTime === item && styles.selectedTimeText]}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Nút Xác nhận */}
                <PrimaryButton title='Xác nhận' onPress={() => setIsVisible(false)}/>
            </DialogBasic>
        </View>
    );
};

const ProductsInfo = () => {
    return (
        <View style={[styles.areaContainer, { borderBottomWidth: 0 }]}>
            <FlatList
                data={products}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <ProductItem item={item} />}
                contentContainerStyle={styles.flatListContentContainer}
                scrollEnabled={false}
            />
        </View>
    );
};
const ProductItem = ({ item }) => {
    return (


        <View style={styles.productItem}>

            <Row>
                <Image source={item.image} style={styles.productImage} />
                <Column>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Column>
                        <Text style={styles.productSize}>{item.size}</Text>
                        <Text style={styles.productSize}>{item.topping}</Text>
                    </Column>
                </Column>
            </Row>
            <Column>
                <Text style={styles.productPrice}>{item.price.toLocaleString()}đ</Text>
                <Text style={styles.textDiscount}>{item.discount.toLocaleString()}đ</Text>
            </Column>
        </View>
    );
};

const products = [
    {
        id: '1',
        name: 'Trà Xanh Sữa Hạnh Nhân (Latte)',
        image: require('../../assets/images/product1.png'),
        price: 69000,
        size: 'Lớn',
        discount: 89000,
        topping: 'kem phô mai machiato'
    },
    {
        id: '2',
        name: 'Combo 3 Olong Tee',
        image: require('../../assets/images/product1.png'),
        price: 55000,
        size: 'Lớn',
        discount: 89000,
        topping: 'chân châu trắng'
    },
];

const PaymentDetails = () => (
    <View style={{ marginBottom: 8, paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT }}>

        <DualTextRow
            leftText="CHI TIẾT THANH TOÁN"
            leftTextStyle={{ color: colors.primary, fontWeight: 'bold' }}
        />
        {[
            { leftText: 'Tạm tính (2 sản phẩm)', rightText: '69.000đ' },
            { leftText: 'Phí giao hàng', rightText: '18.000đ' },
            { leftText: 'Giảm giá', rightText: '-28.000đ', rightTextStyle: { color: colors.primary } },
            {
                leftText: 'Tổng tiền',
                rightText: '68.000đ',
                leftTextStyle: { color: colors.black, fontWeight: '500' },
                rightTextStyle: { fontWeight: '700', color: colors.primary }
            },

        ].map((item, index) => (
            <DualTextRow key={index} {...item} />
        ))}
        <Row style={{ justifyContent: 'space-between' }}>
            <Row>
                <Text style={styles.textQuantity}>3</Text>
                <Text style={{ color: colors.primary, fontWeight: '500' }}>Ưu đãi</Text>
                <Icon
                    source="chevron-down"
                    size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                    color={colors.primary}
                />
            </Row>
            <Text style={{ color: colors.primary, fontWeight: '500' }}>Tiết kiệm 19.000đ</Text>
        </Row>

        <PaymentMethod />
    </View>
);


const PaymentMethod = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState({
        name: 'Tiền mặt',
        image: require('../../assets/images/logo_vnd.png'),
    });

    // Danh sách phương thức thanh toán
    const paymentMethods = [
        {
            name: 'Tiền mặt',
            image: require('../../assets/images/logo_vnd.png'),
            value: 'cash',
        },
        {
            name: 'Momo',
            image: require('../../assets/images/logo_momo.png'),
            value: 'momo',
        },
        {
            name: 'ZaloPay',
            image: require('../../assets/images/logo_zalopay.png'),
            value: 'zalopay',
        },
        {
            name: 'PayOs',
            image: require('../../assets/images/logo_payos.png'),
            value: 'PayOs',
        },
        {
            name: 'Thanh toán bằng thẻ',
            image: require('../../assets/images/logo_card.png'),
            value: 'Card',
        },
    ];

    const handleSelectMethod = (method) => {
        setSelectedMethod(method);
        setIsVisible(false);
    };

    return (
        <Row style={{ justifyContent: 'space-between', marginVertical: 8 }}>
            <Text>Phương thức thanh toán</Text>
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setIsVisible(true)}
            >
                <Image source={selectedMethod.image} style={styles.image} />
                <Text style={{ color: colors.gray700, marginLeft: 8 }}>{selectedMethod.name}</Text>
                <Icon
                    source="chevron-down"
                    size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                    color={colors.gray700}
                />
            </TouchableOpacity>

            {/* Dialog chọn phương thức thanh toán */}
            <DialogBasic
                isVisible={isVisible}
                onHide={() => setIsVisible(false)}
                title="Chọn phương thức thanh toán"
            >
                <View style={{ marginHorizontal: 16 }}>
                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.value}
                            onPress={() => handleSelectMethod(method)}
                            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
                        >
                            <RadioButton
                                value={method.value}
                                status={selectedMethod.name === method.name ? 'checked' : 'unchecked'}
                                color={colors.primary}
                            />
                            <Image source={method.image} style={styles.image} />
                            <Text style={{ color: colors.gray700, marginLeft: 8 }}>{method.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </DialogBasic>
        </Row>
    );
};

const PayOrder = () => {
    return (
        <View style={{ backgroundColor: colors.green200, padding: GLOBAL_KEYS.PADDING_DEFAULT, justifyContent: 'flex-end' }}>
            <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <Text>2 sản phẩm</Text>
                <Row>
                    <Text style={{ fontWeight: '700', color: colors.primary }}>68.000đ</Text>
                    <Text style={styles.textDiscount}>69.000đ</Text>
                </Row>
            </Row>
            <PrimaryButton title='Đặt hàng' />
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,

    },
    optionsContainer: {
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        gap: GLOBAL_KEYS.GAP_DEFAULT,
    },
    optionItem: {
        flexDirection: 'row',

    },
    optionContent: {
        flex: 1,
    },
    optionLabel: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
        fontWeight: 'bold',
        color: colors.primary,
    },
    optionAddress: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray700
    },
    optionPhone: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray700
    },
    row: {
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    title: {
        fontWeight: '500'
    },
    areaContainer: {
        borderColor: colors.gray200,
    },
    flatListContentContainer: {
        marginVertical: GLOBAL_KEYS.PADDING_DEFAULT
    },
    productItem: {
        flexDirection: 'row',
        marginVertical: 4,
        marginHorizontal: 16,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: colors.gray200,
        paddingBottom: GLOBAL_KEYS.PADDING_SMALL
    },
    productImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT
    },
    productName: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: '500',
    },
    productPrice: {
        fontSize: 14,
        color: 'green',
    },
    productSize: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        color: colors.gray700
    },
    textDiscount: {
        textDecorationLine: "line-through",
        color: colors.gray700
    },
    textQuantity: {
        borderWidth: 1,
        borderColor: colors.gray200,
        backgroundColor: colors.primary,
        color: colors.white,
        paddingHorizontal: 6,
        borderRadius: 10
    },
    image: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    selectedTime: { fontSize: 14, color: colors.gray700, marginTop: 4 },

    containerTime: { flexDirection: "row", justifyContent: "space-between", padding: 10 },

    dayItem: { padding: 12, alignItems: "center" },
    selectedDay: { borderRadius: 5 },
    dayText: { fontSize: 16, color: colors.gray700 },
    selectedDayText: { color: colors.black, fontWeight: "bold" },

    timeItem: { height: 50, justifyContent: "center", alignItems: "center" },
    selectedTimeItem: {  borderRadius: 5 },
    timeText: { fontSize: 16, color: colors.gray700 },
    selectedTimeText: { color: "#333", fontWeight: "bold" },

})
