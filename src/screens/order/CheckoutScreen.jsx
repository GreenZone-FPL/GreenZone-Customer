import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, Pressable, StatusBar, FlatList, Dimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GLOBAL_KEYS from '../../constants/globalKeys';
import colors from '../../constants/color';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import NormalHeader from '../../components/headers/NormalHeader';
import CheckoutFooter from '../../components/footer/CheckoutFooter';
import { Icon } from 'react-native-paper';

const width = Dimensions.get('window').width;
const CheckoutScreen = (props) => {

    const { navigation } = props;
    const [quantity, setQuantity] = useState(1);

    const totalPrice = 68000
    return (

        <View style={styles.container}>
            <LightStatusBar />
            <NormalHeader title='Xác nhận đơn hàng' />

            <ScrollView style={styles.containerContent}>
                <CustomRow
                    leftText={'GIAO HÀNG'}
                    rightText={'Thay đổi'}
                    leftColor={colors.primary}
                    rightColor={colors.primary}
                    leftTextFontWeight='700'
                />

                <CustomRow
                    leftText={'Địa chỉ nhận hàng'}
                    rightText={'Thay đổi'}
                    leftColor={colors.black}
                    rightColor={colors.primary}
                    leftTextFontWeight='700'
                />

                <Text style={styles.normalText}>
                    FPT Polytechnic TP. HCM - Tòa F,
                    Công Viên Phần Mềm Quang Trung, Tòa nhà GenPacific
                    Lô 3 đường 16, Trung Mỹ Tây, Quận 12, Hồ Chí Minh
                </Text>

                <CustomRow
                    leftText={'Thông tin người nhận'}
                    rightText={'Thay đổi'}
                    leftColor={colors.black}
                    rightColor={colors.primary}
                    leftTextFontWeight='700'
                />

                <Text style={styles.normalText}>
                    Ngọc Đại | 012345678
                </Text>
                <FlatList
                    data={products}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <ItemProduct item={item} onItemClick={() => { }} />
                    )}
                    contentContainerStyle={styles.flatListContentContainer}
                    scrollEnabled={false}
                />


                <CustomRow
                    leftText={'CHI TIẾT THANH TOÁN'}
                    leftColor={colors.primary}
                    rightColor={colors.primary}
                    leftTextFontWeight='700'
                />

                <CustomRow
                    leftText={'Tạm tính (2 sản phẩm)'}
                    rightText={'69.000đ'}
                    leftColor={colors.black}
                    rightColor={colors.black}

                />

                <CustomRow
                    leftText={'Phí giao hàng'}
                    rightText={'18.000đ'}
                    leftColor={colors.black}
                    rightColor={colors.black}

                />

                <CustomRow
                    leftText={'Giảm 14K'}
                    rightText={'-14.000đ'}
                    leftColor={colors.black}
                    rightColor={colors.primary}

                />

                <CustomRow
                    leftText={'Giảm 5K'}
                    rightText={'-5.000đ'}
                    leftColor={colors.black}
                    rightColor={colors.primary}
                    leftTextFontWeight='400'
                />

                <CustomRow
                    leftText={'Tổng số tiền'}
                    rightText={'68.000đ'}
                    leftColor={colors.black}
                    rightColor={colors.black}
                    leftTextFontWeight='700'
                    rightTextFontWeight='700'
                />
                <VoucherRow />
                <PaymentMethodRow />
            </ScrollView>

            <CheckoutFooter
                quantity={quantity}
                handlePlus={() => {
                    if (quantity < 10) {
                        setQuantity(quantity + 1)
                    }
                }}
                handleMinus={() => {
                    if (quantity > 1) {
                        setQuantity(quantity - 1)
                    }
                }}
                totalPrice={68000}
                buttonTitle='Thêm vào giỏ hàng'
                onButtonPress={() => { }}
            />
        </View>


    );
};


const ItemProduct = ({ item, onItemClick }) => {
    return (
        <View style={styles.itemProduct}>

            <View style={styles.imageWrapper}>
                <Image style={styles.itemImage} source={item.image} />
                <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>x5</Text>
                </View>
            </View>


            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>

                <Text style={styles.gray700Text}>Lớn</Text>
                <Text style={styles.gray700Text}>Kem Phô Mai Macchiato</Text>
            </View>
            <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>{item.price}đ</Text>
                <Text style={styles.lineThroughText}>70.000đ</Text>
                <Pressable onPress={() => { }} >
                    <Icon
                        source="square-edit-outline"
                        size={GLOBAL_KEYS.ICON_SIZE_SMALL}
                        color={colors.primary}
                    />
                </Pressable>
            </View>



        </View>
    );
};


const products = [
    {
        id: '1',
        name: 'Trà Xanh Sữa Hạnh Nhân (Latte)',
        image: require('../../assets/images/product1.png'),
        price: 69000,
    },
    {
        id: '2',
        name: 'Combo 3 Olong Tea',
        image: require('../../assets/images/product1.png'),
        price: 79000,
    },
    {
        id: '3',
        name: 'Combo 2 Trà Sữa Trân Châu Hoàng Kim',
        image: require('../../assets/images/product1.png'),
        price: 69000,
    },
    {
        id: '4',
        name: 'Trà Xanh Sữa Hạnh Nhân (Latte)',
        image: require('../../assets/images/product1.png'),
        price: 79000,
    },
];

const CustomRow = ({
    leftText,
    rightText,
    leftColor = colors.black,
    leftTextFontWeight = '400',
    rightTextFontWeight = '400',
    rightColor = colors.black,
    onRightPress
}) => {
    return (
        <View style={styles.row}>
            <Text style={[styles.leftText, { color: leftColor, fontWeight: leftTextFontWeight }]}>{leftText}</Text>
            <Pressable onPress={onRightPress}>
                <Text style={[styles.rightText, { color: rightColor, fontWeight: rightTextFontWeight }]}>{rightText}</Text>
            </Pressable>

        </View>
    );
};


const VoucherRow = ({
    textColor = colors.primary,
    badgeTextColor = colors.white,
    badgeBgColor = colors.primary,
    quantityOfVoucher = 3,
    onChange,
    money = 19000
}) => {
    return (
        <View style={styles.row}>
            <Pressable style={styles.row} onPress={onChange}>
                <View style={[styles.circleWrapper, { backgroundColor: badgeBgColor }]}>
                    <Text style={[styles.normalText, { color: badgeTextColor }]}>{quantityOfVoucher}</Text>
                </View>

                <Text style={[styles.greenText, { color: textColor, marginRight: 8 }]}>Ưu đãi</Text>
                <AntDesign name="down" color={colors.primary} size={14} />

            </Pressable>


            <Text style={[styles.greenText, { color: textColor }]}>Tiết kiệm {money}đ</Text>


        </View>
    );
};


const PaymentMethodRow = ({
    onChange,
    money = 19000
}) => {
    return (
        <View style={styles.row}>
            <Text style={styles.normalText}>Phương thức thanh toán</Text>
            <Pressable style={styles.row} onPress={onChange}>
                <Image
                    source={require('../../assets/images/logo_momo.png')}
                    style={{
                        width: 30,
                        height: 30,
                        resizeMode: 'contain',
                    }} />
                < Text style={[styles.normalText, { marginRight: 8 }]}>Momo</Text>
                <AntDesign name="down" color={colors.primary} size={14} />

            </Pressable>

        </View >
    );
};



const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1
    },
    containerContent: {
        backgroundColor: colors.white,
        flex: 1,
        gap: 12,
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 6
    },
    column: {
        flexDirection: 'column',
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    title: {
        fontWeight: 'bold',
        color: colors.primary
    },
    greenText: {
        color: colors.primary
    },
    normalText: {
        textAlign: 'justify',
        lineHeight: 20,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black
    },
    gray700Text: {
        textAlign: 'justify',
        lineHeight: 20,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray700
    },
    circleWrapper: {
        width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: GLOBAL_KEYS.PADDING_SMALL
    },

    flatListContentContainer: {
        marginVertical: GLOBAL_KEYS.PADDING_DEFAULT
    },
    itemProduct: {
        flexDirection: 'row',
        borderBottomColor: colors.gray200,
        borderBottomWidth: 2,
        paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
        gap: GLOBAL_KEYS.GAP_SMALL
    },
    itemImage: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    },
    productInfo: {
        flexDirection: 'column',
        flex: 1,
        gap: 5,
    },
    productName: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: '500',

    },
    productPrice: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
        fontWeight: '500'
    },
  
    imageWrapper: {
        position: 'relative',
    },
    quantityBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.green100,
        borderColor: colors.white,
        borderWidth: 1,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        color: colors.black,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        fontWeight: 'bold',
    },
    priceContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    lineThroughText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray700,
        textDecorationLine: 'line-through',
    },
});

export default CheckoutScreen;

