import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon, IconButton} from 'react-native-paper';
import {
  deleteFavoriteProduct,
  getFavoriteProducts,
  getProductDetail,
  postFavoriteProduct,
} from '../../axios';
import {
  CheckoutFooter,
  Column,
  NormalText,
  OverlayStatusBar,
  RadioGroup,
  Row,
  SelectableGroup,
} from '../../components';
import ToastDialog from '../../components/dialogs/ToastDialog';
import {colors, GLOBAL_KEYS} from '../../constants';
import {useAppContext} from '../../context/appContext';
import {CartManager, TextFormatter} from '../../utils';

const ProductDetailSheet = ({route, navigation}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const {productId} = route.params;
  // const productId = '67ad9e9b145c78765a8f89c1'

  const {cartDispatch, authState} = useAppContext();

  // console.log(productId)
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
    <View style={styles.modalContainer}>
      <OverlayStatusBar />
      {product && (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.modalContent}>
            <ProductImage
              hideModal={() => navigation.goBack()}
              product={product}
            />

            <ProductInfo
              authState={authState}
              product={product}
              showFullDescription={showFullDescription}
              toggleDescription={() => {
                setShowFullDescription(!showFullDescription);
              }}
            />

            {product.variant.length > 1 && selectedVariant && (
              <View style={styles.infoContainer}>
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
              </View>
            )}

            {product.topping.length > 0 && (
              <View style={styles.infoContainer}>
                <SelectableGroup
                  items={product.topping}
                  title="Chọn topping"
                  selectedGroup={selectedToppings}
                  setSelectedGroup={setSelectedToppings}
                  note="Tối đa 3 toppings"
                  activeIconColor={colors.primary}
                  activeTextColor={colors.primary}
                />
              </View>
            )}
          </ScrollView>

          <CheckoutFooter
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
              // console.log('selectedToppings', selectedToppings)
              const updatedToppings = selectedToppings?.map(topping => ({
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
                cartDispatch,
              );

              navigation.goBack();
            }}
            buttonTitle="Thêm vào giỏ hàng"
          />
        </>
      )}
    </View>
  );
};

const ProductImage = ({hideModal, product}) => {
  return (
    <View style={styles.imageContainer}>
      <Pressable>
        <Image source={{uri: product.image}} style={styles.productImage} />
      </Pressable>

      <IconButton
        icon="close"
        size={GLOBAL_KEYS.ICON_SIZE_SMALL}
        iconColor={colors.primary}
        style={styles.closeButton}
        onPress={hideModal}
      />
    </View>
  );
};

const ProductInfo = ({
  product,
  showFullDescription,
  toggleDescription,
  authState,
}) => {
  return (
    <View style={styles.infoContainer}>
      <Row style={styles.horizontalView}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {product.name}
        </Text>

        {/* <FavoriteButton productId={product._id} authState={authState} /> */}
      </Row>
      <Text
        style={{
          fontSize: 22,
          color: colors.orange700,
          fontWeight: 'bold',
          paddingHorizontal: 16,
        }}>
        {TextFormatter.formatCurrency(product.sellingPrice)}
      </Text>

      <Column style={{paddingHorizontal: 16, gap: 8}}>
        <Text
          style={styles.descriptionText}
          numberOfLines={showFullDescription ? undefined : 2}
          ellipsizeMode="tail">
          {product.description}
        </Text>

        <Pressable onPress={toggleDescription}>
          <NormalText
            style={{color: colors.teal900}}
            text={showFullDescription ? 'Thu gọn' : 'Xem thêm'}
          />
        </Pressable>
      </Column>
    </View>
  );
};

const FavoriteButton = ({productId, authState}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState('heart-outline');
  const [toastIconColor, setToastIconColor] = useState(colors.gray300);
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await getFavoriteProducts();
        setIsFavorite(favorites.some(item => item.product._id === productId));
      } catch (error) {
        console.error('Error fetching favorite status:', error);
      }
    };

    if (!authState.needLogin) {
      fetchFavorites();
    }
  }, [productId]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await deleteFavoriteProduct({productId});
        setToastMessage('Đã xóa khỏi danh sách yêu thích');
        setToastIcon('heart-outline');
        setToastIconColor(colors.gray300);
      } else {
        await postFavoriteProduct({productId});
        setToastMessage('Đã thêm vào danh sách yêu thích');
        setToastIcon('heart');
        setToastIconColor(colors.red800);
      }
      setIsFavorite(!isFavorite);
      setIsToastVisible(true);
    } catch (error) {
      setToastMessage('Có lỗi xảy ra!');
      setToastIcon('alert-circle');
      setToastIconColor(colors.red800);
      setIsToastVisible(true);
      console.error('Error updating favorite status:', error);
    }
  };

  return (
    <>
      <Pressable onPress={toggleFavorite}>
        <Icon
          source={isFavorite ? 'heart' : 'heart-outline'}
          color={isFavorite ? colors.red800 : colors.gray400}
          size={28}
        />
      </Pressable>

      <ToastDialog
        isVisible={isToastVisible}
        onHide={() => setIsToastVisible(false)}
        icon={toastIcon}
        iconColor={toastIconColor}
        title={toastMessage}
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
    backgroundColor: colors.fbBg,
    flexDirection: 'column',
    gap: GLOBAL_KEYS.GAP_SMALL,
    marginTop: StatusBar.currentHeight,
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 460,
    // marginBottom: 10
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: GLOBAL_KEYS.PADDING_DEFAULT,
    right: GLOBAL_KEYS.PADDING_DEFAULT,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    flex: 1,
    marginRight: 8,
  },

  descriptionText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    textAlign: 'justify',
    lineHeight: 25,
  },

  infoContainer: {
    flexDirection: 'column',
    marginBottom: 10,
    backgroundColor: colors.white,
    paddingVertical: 8,
    gap: 8,
  },
});

export default ProductDetailSheet;
