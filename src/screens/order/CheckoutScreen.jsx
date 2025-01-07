import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import GLOBAL_KEYS from '../../constants/globalKeys';
import colors from '../../constants/color';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import NormalHeader from '../../components/headers/NormalHeader';
import CheckoutFooter from '../../components/footer/CheckoutFooter';


const CheckoutScreen = (props) => {

    const { navigation } = props;
    const [quantity, setQuantity] = useState(1);

    const totalPrice = 68000
    return (

        <View style={styles.container}>
            <LightStatusBar />
            <NormalHeader title='Xác nhận đơn hàng' />

            <View style={styles.containerContent}>
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
            </View>





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
        justifyContent: 'space-between'
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
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
    },
    circleWrapper: {
        width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: GLOBAL_KEYS.PADDING_SMALL
    },
});

export default CheckoutScreen;

