import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { IconButton } from 'react-native-paper';
import {
  deleteFavoriteProduct,
  getFavoriteProducts,
  getProductDetail,
  postFavoriteProduct,
} from '../../axios';
import {
  CheckoutFooter,
  OverlayStatusBar,
  RadioGroup,
  SelectableGroup
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAuthContext, useCartContext } from '../../context';
import { ProductDetailSkeleton } from '../../skeletons';
import { CartManager, Toaster } from '../../utils';

const EditCartItemScreen = ({ route, navigation }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const { updateItem } = route.params;
  const { authState } = useAuthContext();
  const { cartDispatch } = useCartContext();

  useEffect(() => {
    if (product) {
      const newTotalAmount = calculateTotal(
        product,
        selectedVariant,
        selectedToppings,
        quantity,
      );

      setTotalAmount(newTotalAmount);
    }
  }, [product, selectedVariant, selectedToppings, quantity]);

  const calculateTotal = (product, variant, toppings, quantity) => {
    if (!product) return 0; // Nếu không có sản phẩm, trả về 0

    const basePrice = variant ? variant.sellingPrice : product.originalPrice; // Nếu không có variant, lấy giá sản phẩm
    const toppingsAmount =
      toppings?.reduce(
        (acc, item) => acc + item.extraPrice * item.quantity,
        0,
      ) || 0; // Nếu không có toppings, giá là 0

    return quantity * (basePrice + toppingsAmount);
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const detail = await getProductDetail(updateItem.productId);

        if (detail && updateItem) {
          setProduct(detail);
          if (detail.variant.length > 0) {
            const firstVariant = detail.variant[0];
            setSelectedVariant(() => {
              return detail.variant.find(
                item => item._id === updateItem.variant,
              );
            });
            setTotalAmount(calculateTotal(firstVariant, selectedToppings));
          }

          if (detail.topping.length > 0) {
            setSelectedToppings(updateItem.toppingItems);
          }
          setQuantity(updateItem.quantity);

        }
      } catch (error) {
        console.error('Error fetchProductDetail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, []);
  return (
    <View style={styles.modalContainer}>
      <OverlayStatusBar />
      <IconButton
        icon="close"
        size={GLOBAL_KEYS.ICON_SIZE_SMALL}
        iconColor={colors.primary}
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      />



      {
        loading &&
        <ProductDetailSkeleton />
      }

      {product && (
        <>
          <ScrollView style={styles.modalContent}>
            <ProductImage product={product} />

            <ProductInfo
              authState={authState}
              product={product}
              showFullDescription={showFullDescription}
              toggleDescription={() => {
                setShowFullDescription(!showFullDescription);
              }}
            />

            {product.variant.length > 1 && selectedVariant && (
              <RadioGroup
                items={product.variant}
                selectedValue={selectedVariant}
                onValueChange={item => {
                  setSelectedVariant(item);
                }}
                title="Size"
                required={true}
                note="Bắt buộc"
              />
            )}

            {product.topping.length > 0 && (
              <SelectableGroup
                items={product.topping}
                title="Chọn topping"
                selectedGroup={selectedToppings}
                setSelectedGroup={setSelectedToppings}
                note="Tối đa 3 toppings"
                activeIconColor={colors.primary}
                activeTextColor={colors.primary}
              />
            )}
          </ScrollView>

          <CheckoutFooter
            setQuantity={setQuantity}
            backgroundColor={colors.white}
            quantity={quantity}
            handlePlus={() => {
              if (quantity < 10) {
                setQuantity(quantity + 1);
              }
            }}
            handleMinus={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
            totalPrice={totalAmount}
            onButtonPress={async () => {
              if (!quantity && quantity !== 0) {
                setQuantity(1)
                Toaster.show('Vui lòng nhập số lượng hợp lệ')
                return
              }
              if (quantity > 99) {
                setQuantity(99)
                Toaster.show('Số lượng không vượt quá 99')
                return
              }
              // if (quantity < 1) {
              //   // Hiển thị cảnh báo khi số lượng sản phẩm nhỏ hơn 1
              //   Alert.alert(
              //     'Xóa sản phẩm',
              //     'Bạn có chắc chắn muốn xóa sản phẩm này?',
              //     [
              //       {
              //         text: 'Đóng',
              //         onPress: () => {
              //           setQuantity(1);
              //         },
              //         style: 'cancel',
              //       },
              //       {
              //         text: 'Xóa',
              //         onPress: async () => {
              //           await CartManager.removeFromCart(
              //             product._id,
              //             cartDispatch,
              //           );
              //           Toaster.show('Xóa thành công');
              //         },
              //       },
              //     ],
              //     { cancelable: false },
              //   );
              //   return;
              // }
              if (quantity >= 1 && !quantity) {
                setQuantity(1);
                Toaster.show('Vui lòng nhập số lượng hợp lệ');
                return;
              }

              const sortedToppings = selectedToppings?.length
                ? [...selectedToppings].sort((a, b) =>
                  a._id.localeCompare(b._id),
                )
                : [];

              await CartManager.updateCartItem(
                updateItem.itemId,
                {
                  variant: selectedVariant?._id,
                  quantity,
                  price: totalAmount / quantity,
                  productId: updateItem.productId,
                  toppingItems: sortedToppings,

                  variantName: selectedVariant?.size,
                },
                cartDispatch,
              );

              navigation.goBack();
            }}
            buttonTitle="Lưu -"
          />
        </>
      )}
    </View>
  );
};

const ProductImage = ({ product }) => {
  return (
    <Pressable style={styles.imageContainer}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
    </Pressable>
  );
};

const ProductInfo = ({ authState, product, showFullDescription, toggleDescription }) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.horizontalView}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {product.name}
        </Text>
        {authState?.isLoggedIn && <FavoriteButton productId={product._id} />}
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
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        setLoading(true)
        const favorites = await getFavoriteProducts();
        const found = favorites.some(item => item.product._id === productId);
        setIsFavorite(found);
      } catch (err) {
        Toaster.show('Lỗi khi lấy danh sách yêu thích')
      } finally {
        setLoading(false)
      }
    };
    fetchFavoriteStatus();
  }, [productId]);

  const toggleFavorite = async () => {
    try {
      setLoading(true);
      if (isFavorite) {
        await deleteFavoriteProduct({ productId });
        Toaster.show('Đã xóa khỏi danh sách yêu thích')
      } else {
        await postFavoriteProduct({ productId });
        Toaster.show('Đã thêm vào danh sách yêu thích')
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      Toaster.show('Lỗi khi cập nhật yêu thích')
    } finally {
      setIsToastVisible(true);
      setLoading(false);
    }
  };

  const handlePress = async () => {
    console.log('Loading:', loading);

    await toggleFavorite();
  };

  return (
    <>
      <IconButton
        icon={isFavorite ? 'heart' : 'heart-outline'}
        iconColor={isFavorite ? colors.red800 : colors.gray300}
        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        onPress={handlePress}
      />
    </>
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
    resizeMode: 'stretch',
  },
  closeButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + 40 + 16,
    right: GLOBAL_KEYS.PADDING_DEFAULT,
    zIndex: 1,
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
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    flex: 1,
    marginRight: 8,
  },
  descriptionContainer: {
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  descriptionText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    textAlign: 'justify',
  },
  title: {
    fontWeight: 'bold',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  textButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  redText: {
    color: colors.red800,
  },
  textButtonLabel: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.teal900,
  },

  radioGroup: {
    paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL,
  },
  toppingList: {
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
    flexDirection: 'column',
  },
  toppingItem: {
    marginBottom: GLOBAL_KEYS.PADDING_SMALL,
  },
  footer: {
    padding: 16,
    elevation: 5,
    backgroundColor: colors.white,
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
    backgroundColor: '#000',
  },
  imageZoomContainer: {
    height: 800,
  },
});

export default EditCartItemScreen;
