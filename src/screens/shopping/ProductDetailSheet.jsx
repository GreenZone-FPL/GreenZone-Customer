import React, { useContext, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View , ActivityIndicator} from 'react-native';
import { Icon, IconButton } from 'react-native-paper';

import { getProductDetail, postFavoriteProduct, deleteFavoriteProduct, getFavoriteProducts } from '../../axios';
import { CheckoutFooter, NotesList, OverlayStatusBar, RadioGroup, SelectableGroup } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { CartManager, Toaster } from '../../utils';
import { useAppContext } from '../../context/appContext';

import { ToastAndroid } from "react-native";

const ProductDetailSheet = ({ route, navigation }) => {

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
            console.log("Số lượng hiện tại:", quantity);

            const newTotalAmount = calculateTotal(product, selectedVariant, selectedToppings, quantity);
            console.log("Giá tổng mới:", newTotalAmount);

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
        <View style={styles.modalContainer}>
            <OverlayStatusBar />
            {
                product &&

                <>
                    <ScrollView style={styles.modalContent}>
                        <ProductImage hideModal={() => navigation.goBack()} product={product} />

                        <ProductInfo
                            product={product}
                            showFullDescription={showFullDescription}
                            toggleDescription={() => { setShowFullDescription(!showFullDescription); }}
                        />

                        {
                            product.variant.length > 1 && selectedVariant &&
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
                        }


                        {
                            product.topping.length > 0 &&
                            <>
                                <SelectableGroup
                                    items={product.topping}
                                    title='Chọn topping'
                                    selectedGroup={selectedToppings}
                                    setSelectedGroup={setSelectedToppings}
                                    note="Tối đa 3 toppings"
                                    activeIconColor={colors.primary}
                                    activeTextColor={colors.primary}
                                />

                                <NotesList
                                    onToggleNote={(item) => {
                                        if (selectedNotes.includes(item)) {
                                            setSelectedNotes(selectedNotes.filter(note => note !== item));
                                        } else {
                                            setSelectedNotes([...selectedNotes, item]);
                                            if (!customNote.includes(item)) {
                                                setCustomNote(prev => prev ? `${prev}, ${item}` : item);
                                            }
                                        }
                                    }}

                                    customNote={customNote}
                                    setCustomNote={setCustomNote}
                                    selectedNotes={selectedNotes}
                                    items={notes}
                                    style={{ margin: GLOBAL_KEYS.PADDING_DEFAULT }}
                                />
                            </>

                        }



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
                        totalPrice={totalAmount}
                        onButtonPress={async () => {

                            // console.log('selectedToppings', selectedToppings)
                            const updatedToppings = selectedToppings.map(topping => ({
                                ...topping,
                                topping: topping._id,
                                price: topping.extraPrice
                            }));

                            console.log('updatedToppings = ', updatedToppings);
                            const productPrice = totalAmount/ quantity
                            await CartManager
                                .addToCart(product, selectedVariant, updatedToppings, productPrice, quantity, cartDispatch)


                            navigation.goBack()

                        }}
                        buttonTitle='Thêm vào giỏ hàng'
                    />


                </>
            }

        </View>
    );
};

const notes = ['Ít cafe', 'Đậm trà', 'Không kem', 'Nhiều cafe', 'Ít sữa', 'Nhiều sữa', 'Nhiều kem', 'Đá để riêng']


const ProductImage = ({ hideModal, product }) => {
    // const [isDialogVisible, setIsDialogVisible] = useState(false);
    // const images = [
    //     {
    //       url: '', 
    //       props: {
    //         source: require('../../assets/images/product1.png'),
    //       },
    //     },
    //   ];
    return (
        <View style={styles.imageContainer}>
            <Pressable
            // onPress={() => setIsDialogVisible(true)}
            >
                <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}

                />




            </Pressable>
            <IconButton
                icon="close"
                size={GLOBAL_KEYS.ICON_SIZE_SMALL}
                iconColor={colors.primary}
                style={styles.closeButton}
                onPress={hideModal}
            />
            {/* <DialogBasic
          isVisible={isDialogVisible}
          onHide={() => setIsDialogVisible(false)}
          style={styles.height}
        >
          <View style={styles.imageZoomContainer}>
            <ImageViewer imageUrls={images} renderIndicator={() => null}/>
          </View>
        </DialogBasic> */}
        </View>
    );
};

const ProductInfo = ({ product, showFullDescription, toggleDescription}) => {

    return (
        <View style={styles.infoContainer}>

            <View style={styles.horizontalView}>
                <Text
                    style={styles.productName}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {product.name}
                </Text>
                <FavoriteButton productId={product._id} />
            </View>

            {/* Product Description */}
            <View style={styles.descriptionContainer}>
                <Text
                    style={styles.descriptionText}
                    numberOfLines={showFullDescription ? undefined : 2}
                    ellipsizeMode="tail">
                    {product.description}
                </Text>
                <Pressable style={styles.textButton} onPress={toggleDescription}>
                    <Text style={styles.textButtonLabel}>
                        {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const FavoriteButton = ({ productId }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const favorites = await getFavoriteProducts();
                setIsFavorite(favorites.some(item => item.product._id === productId));
            } catch (error) {
                console.error("Error fetching favorite status:", error);
            }
        };

        fetchFavorites();
    }, [productId]);

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await deleteFavoriteProduct({ productId });
                ToastAndroid.show("Đã xóa khỏi danh sách yêu thích", ToastAndroid.SHORT);
            } else {
                await postFavoriteProduct({ productId });
                ToastAndroid.show("Đã thêm vào danh sách yêu thích", ToastAndroid.SHORT);
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            ToastAndroid.show("Có lỗi xảy ra!", ToastAndroid.SHORT);
            console.error("Error updating favorite status:", error);
        }
    };

    return (
        <IconButton
            icon={isFavorite ? "heart" : "heart-outline"}
            iconColor={isFavorite ? colors.red800 : colors.gray300}
            size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
            onPress={() => {}}
        />
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: colors.overlay,
        flex: 1,
        width: '100%',

    },
    modalContent: {
        width: '100%',
        backgroundColor: colors.white,
        flexDirection: 'column',
        gap: GLOBAL_KEYS.GAP_SMALL,
        marginTop: StatusBar.currentHeight + 40,
        flexDirection: 'column',
        flex: 1,

    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 300,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    },
    closeButton: {
        position: 'absolute',
        top: GLOBAL_KEYS.PADDING_DEFAULT,
        right: GLOBAL_KEYS.PADDING_DEFAULT,
        backgroundColor: colors.green100,
    },
    zoomButton: {
        position: 'absolute',
        bottom: GLOBAL_KEYS.PADDING_DEFAULT,
        left: GLOBAL_KEYS.PADDING_DEFAULT,
        backgroundColor: colors.green100,
    },
    horizontalView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        flexDirection: 'column',
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        flex: 1,
        marginRight: 8,
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    },
    descriptionContainer: {
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    descriptionText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray700,
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
        textAlign: 'justify'
    },
    title: {
        fontWeight: 'bold',
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    textButton: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
    },
    redText: {
        color: colors.red800
    },
    textButtonLabel: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.teal900,
    },

    radioGroup: {
        paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL
    },
    toppingList: {
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        gap: GLOBAL_KEYS.GAP_SMALL,
        flexDirection: 'column'
    },
    toppingItem: {
        marginBottom: GLOBAL_KEYS.PADDING_SMALL,
    },
    footer: {
        padding: 16,
        elevation: 5,
        backgroundColor: colors.white
    },
    infoContainer: {
        flexDirection: 'column',
        marginBottom: 8,
    },
    quantityInfoText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
    },
    totalText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
        fontWeight: 'bold',
        color: colors.primary,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    quantityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.black,
        marginHorizontal: 8,
    },
    height: {
        height: '100%',
        backgroundColor: '#000'
    },
    imageZoomContainer: {
        height: 800,
    }
});

export default ProductDetailSheet