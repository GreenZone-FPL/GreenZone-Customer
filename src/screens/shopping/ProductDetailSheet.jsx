import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
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
  Column,
  OverlayStatusBar,
  RadioGroup,
  SelectableGroup
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useProductDetailContainer } from '../../containers';
import { useAuthContext, useCartContext } from '../../context';
import { ProductDetailSkeleton } from '../../skeletons';
import { CartManager, Toaster } from '../../utils';

const width = Dimensions.get('window').width
const ProductDetailSheet = ({ route, navigation }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const { productId } = route.params;
  const { authState } = useAuthContext();
  const { cartDispatch } = useCartContext();
  const { onClickAddToCart } = useProductDetailContainer();


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

    const basePrice = variant ? variant.sellingPrice : product.sellingPrice; // Nếu không có variant, lấy giá sản phẩm
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
        const detail = await getProductDetail(productId);

        if (detail) {
          setProduct(detail); // Lưu danh mục vào state
          if (detail.variant.length > 0) {
            const firstVariant = detail.variant[0];
            setSelectedVariant(firstVariant);
            setTotalAmount(calculateTotal(firstVariant, selectedToppings));
          }
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

    <Column style={styles.container}>
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
      {
        product &&
        <>
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false} >
            <OverlayStatusBar />


            <Image
              style={styles.imageContainer}
              source={{ uri: product.image }} resizeMode={'cover'} />


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
              if (quantity < 99) {
                setQuantity(quantity + 1);
              }
            }}
            handleMinus={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
            totalPrice={totalAmount}
            onButtonPress={() => {
              onClickAddToCart(async () => {
                if (!quantity || quantity < 1) {
                  setQuantity(1)
                  Toaster.show('Vui lòng nhập số lượng hợp lệ')
                  return
                }

                if (quantity > 99) {
                  setQuantity(99)
                  Toaster.show('Số lượng không vượt quá 99')
                  return
                }

                const updatedToppings = selectedToppings.map(topping => ({
                  ...topping,
                  topping: topping._id,
                  price: topping.extraPrice,
                }));

                const productPrice = totalAmount / quantity;
                await CartManager.addToCart(
                  product,
                  selectedVariant,
                  updatedToppings,
                  productPrice,
                  quantity,
                  cartDispatch
                );

                navigation.goBack();
              })
            }
            }
            buttonTitle="Chọn -"
          />
        </>
      }

    </Column>

  );
};


export const ProductInfo = ({
  product,
  showFullDescription,
  toggleDescription,
  authState,
}) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.horizontalView}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {product.name}
        </Text>

        {authState?.isLoggedIn && <FavoriteButton productId={product._id} />}
      </View>

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

      if (isFavorite) {
        setLoading(true);
        await deleteFavoriteProduct({ productId });
        Toaster.show('Đã xóa khỏi danh sách yêu thích')
      } else {
        setLoading(true);
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

  return (
    <>
      <IconButton
        icon={isFavorite ? 'heart' : 'heart-outline'}
        iconColor={isFavorite ? colors.red800 : colors.gray300}
        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        onPress={toggleFavorite}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    position: 'relative'
  },
  modalContent: {
    backgroundColor: colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: width,
    height: width / 1.2,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
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
    // textAlign: 'justify',
  },

  textButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },

  textButtonLabel: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.teal900,
  },

  infoContainer: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  imageZoomContainer: {
    height: 800,
  },
});

export default ProductDetailSheet;
