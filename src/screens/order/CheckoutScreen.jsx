import React, { useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View, } from 'react-native';
import { Icon } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CheckoutFooter, DialogShippingMethod, DualTextRow, HorizontalProductItem, LightStatusBar, NormalHeader, PaymentMethodRow } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';

const CheckoutScreen = (props) => {

    const { navigation } = props;
    const [quantity, setQuantity] = useState(1);

    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Giao hàng');

    return (

        <View style={styles.container}>
            <LightStatusBar />
            <NormalHeader title='Xác nhận đơn hàng' onLeftPress={() => navigation.goBack()} />

            <ScrollView style={styles.containerContent}>
                <DualTextRow
                    leftText={'GIAO HÀNG'}
                    rightText={'Thay đổi'}
                    leftTextStyle={{ color: colors.primary, fontWeight: '700' }}
                    rightTextStyle={{ color: colors.primary }}
                    onRightPress={() => setIsVisibleModal(true)}
                />

                <AddressSection />

                <RecipientInfo />

                <FlatList
                    data={products}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <HorizontalProductItem item={item} enableAction={true} />
                    )}
                    contentContainerStyle={styles.flatListContentContainer}
                    scrollEnabled={false}
                />


                <PaymentDetails />

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

            <DialogShippingMethod
                isVisible={isVisibleModal}
                selectedOption={selectedOption}
                onHide={() => { setIsVisibleModal(false) }}
                onEditOption={(option) => console.log(`Editing ${option}`)}
                onOptionSelect={(option) => setSelectedOption(option)}
            />
        </View>


    );
};

const RecipientInfo = () => (
    <>
        <DualTextRow
            leftText="Thông tin người nhận"
            rightText="Thay đổi"
            leftTextStyle={{ color: colors.black, fontWeight: '600' }}
            rightTextStyle={{ color: colors.primary }}
        />
        <Text style={styles.normalText}>Ngọc Đại | 012345678</Text>
    </>
);

const AddressSection = () => (
    <>
        <DualTextRow
            leftText="Địa chỉ nhận hàng"
            leftTextStyle={{ fontWeight: '600' }}
            onRightPress={() => setIsVisibleModal(true)}
            rightText=""
        />
        <Text style={styles.normalText}>
            FPT Polytechnic TP. HCM - Tòa F, Công Viên Phần Mềm Quang Trung, Tòa nhà GenPacific Lô 3 đường 16, Trung Mỹ Tây, Quận 12, Hồ Chí Minh
        </Text>
    </>
);


const PaymentDetails = () => (
    <>
        <DualTextRow
            leftText="CHI TIẾT THANH TOÁN"
            leftTextStyle={{ color: colors.primary, fontWeight: '700' }}
        />
        {[
            { leftText: 'Tạm tính (2 sản phẩm)', rightText: '69.000đ' },
            { leftText: 'Phí giao hàng', rightText: '18.000đ' },
            { leftText: 'Giảm 14K', rightText: '-14.000đ', rightColor: colors.primary },
            { leftText: 'Giảm 5K', rightText: '-5.000đ', rightColor: colors.primary },
            { leftText: 'Tổng số tiền', rightText: '68.000đ', leftTextFontWeight: '700', rightTextFontWeight: '700' },
        ].map((item, index) => (
            <DualTextRow key={index} {...item} />
        ))}
        <VoucherRow />
        <PaymentMethodRow />
    </>
);

const ItemProduct = ({ item }) => (
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
            <Pressable onPress={() => { }}>
                <Icon
                    source="square-edit-outline"
                    size={GLOBAL_KEYS.ICON_SIZE_SMALL}
                    color={colors.primary}
                />
            </Pressable>
        </View>
    </View>
);


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
        color: colors.primary,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
    },
    normalText: {
        textAlign: 'justify',
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
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
    }
});

export default CheckoutScreen

