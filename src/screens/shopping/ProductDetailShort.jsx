import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Icon, IconButton } from 'react-native-paper';
import { getProductDetail } from '../../axios';
import { CheckoutFooter, Column, NormalLoading, NotesList, OverlayStatusBar, RadioGroup, Row, SelectableGroup } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { CartManager } from '../../utils';

const { width, height } = Dimensions.get('window')
const ProductDetailShort = ({ route, navigation }) => {

    const [showFullDescription, setShowFullDescription] = useState(false);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0)
    const { productId } = route.params
    const [customNote, setCustomNote] = useState("");

    const { cartDispatch } = useAppContext()


    useEffect(() => {
        if (product) {
            const newTotalAmount = calculateTotal(product, selectedVariant, selectedToppings, quantity);
            setTotalAmount(newTotalAmount);
        }
    }, [product, selectedVariant, selectedToppings, quantity]);

    const calculateTotal = (product, variant, toppings, quantity) => {
        if (!product) return 0; // Nếu không có sản phẩm, trả về 0

        const basePrice = variant ? variant.sellingPrice : product.sellingPrice; // Nếu không có variant, lấy giá sản phẩm
        const toppingsAmount = toppings?.reduce((acc, item) => acc + item.extraPrice * item.quantity, 0) || 0; // Nếu không có toppings, giá là 0

        return quantity * (basePrice + toppingsAmount);
    };

    useEffect(() => {

        const fetchProductDetail = async () => {
            setLoading(true)
            try {
                const detail = await getProductDetail(productId);

                if (detail) {
                    setProduct(detail); // Lưu danh mục vào state
                    if (detail.variant.length > 0) {
                        const firstVariant = detail.variant[0]
                        setSelectedVariant(firstVariant)
                        setTotalAmount(calculateTotal(firstVariant, selectedToppings));
                    }
                }
            } catch (error) {
                console.error("Error fetchProductDetail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, []);


    return (
        <Column style={styles.container}>
            <OverlayStatusBar />
            {

                product &&

                <Column style={styles.contentContainer}>
                    <ProductInfo
                        product={product}
                        showFullDescription={showFullDescription}
                        toggleDescription={() => { setShowFullDescription(!showFullDescription) }}
                        hideModal={() => navigation.goBack()}
                    />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.modalContent}>

                        {
                            product.variant.length > 1 && selectedVariant &&
                            <View style={styles.infoContainer}>
                                <RadioGroup
                                    items={product.variant}
                                    selectedValue={selectedVariant}
                                    onValueChange={(item) => {
                                        setSelectedVariant(item)
                                    }}
                                    title="Size"
                                    required={true}
                                    note="Bắt buộc"
                                />
                            </View>
                        }


                        {
                            product.topping.length > 0 &&
                            <View style={styles.infoContainer}>
                                <SelectableGroup
                                    items={product.topping}
                                    title='Chọn topping'
                                    selectedGroup={selectedToppings}
                                    setSelectedGroup={setSelectedToppings}
                                    note="Tối đa 3 toppings"
                                    activeIconColor={colors.primary}
                                    activeTextColor={colors.primary}
                                />

                            </View>

                        }



                    </ScrollView>

                    <CheckoutFooter
                        backgroundColor={colors.white}
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
                        totalPrice={totalAmount}
                        onButtonPress={async () => {
                            const updatedToppings = selectedToppings.map(topping => ({
                                ...topping,
                                topping: topping._id,
                                price: topping.extraPrice
                            }));


                            const productPrice = totalAmount / quantity
                            await CartManager
                                .addToCart(product, selectedVariant, updatedToppings, productPrice, quantity, cartDispatch)


                            navigation.goBack()

                        }}
                        buttonTitle='Chọn -'
                    />

                </Column>

            }

        </Column>
    );
};



const ProductInfo = ({ product, hideModal }) => {
    return (
        <Row style={{ backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 8 }}>
            <Text
                style={styles.productName}
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {product.name}
            </Text>

            <Pressable
                onPress={hideModal}
                style={{ padding: 8, backgroundColor: colors.green100, borderRadius: 15 }}
            >
                <Icon
                    source="close"
                    color={colors.primary}
                    size={GLOBAL_KEYS.ICON_SIZE_SMALL}
                />
            </Pressable>

        </Row>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.overlay,
        flexDirection: 'column-reverse',
        width: '100%',
        flex: 1
    },
    contentContainer: {
        gap: 0,
        backgroundColor: colors.fbBg,
    },
    modalContent: {
        backgroundColor: colors.fbBg,
        flexDirection: 'column',
        minHeight: 150,
        maxHeight: height * 0.6
    },

    closeButton: {
        position: 'absolute',
        top: GLOBAL_KEYS.PADDING_DEFAULT,
        right: GLOBAL_KEYS.PADDING_DEFAULT,
        backgroundColor: colors.green100,
    },
    productName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black,
        flex: 1,
        paddingVertical: 8
    },
    infoContainer: {
        flexDirection: 'column',
        marginBottom: 10,
        backgroundColor: colors.white,
        paddingVertical: 8,
        gap: 8
    },
});

export default ProductDetailShort