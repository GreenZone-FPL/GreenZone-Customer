import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { IconButton } from 'react-native-paper';
import {
  getProductDetail
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
import { ProductInfo } from './ProductDetailSheet';

const width = Dimensions.get('window').width
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
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    width: '100%',
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
  }
});

export default EditCartItemScreen;
