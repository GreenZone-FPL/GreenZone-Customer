import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Coin1,
  MessageFavorite,
  Rank,
  TaskSquare,
  TicketDiscount,
} from 'iconsax-react-native';
import {getAllCategories, getAllProducts} from '../../axios';
import {
  AuthButton,
  BarcodeUser,
  DeliveryButton,
  DialogShippingMethod,
  HeaderWithBadge,
  LightStatusBar,
  NotificationList,
  PrimaryButton,
  ProductsGrid,
  ProductsListHorizontal,
  TitleText,
} from '../../components';
import {colors, DeliveryMethod, GLOBAL_KEYS} from '../../constants';
import {useAppContainer, useHomeContainer} from '../../containers';
import {useAppContext} from '../../context/appContext';
import {
  AppGraph,
  BottomGraph,
  OrderGraph,
  ShoppingGraph,
  UserGraph,
  VoucherGraph,
} from '../../layouts/graphs';
import {AppAsyncStorage, CartManager, fetchData} from '../../utils';
import useSaveLocation from '../../utils/useSaveLocation';
const HomeScreen = props => {
  const {navigation} = props;
  const [categories, setCategories] = useState([]);

  const [merchantLocal, setMerchantLocal] = useState(null);
  const [orderPaymentLocal, setOrderPaymentLocal] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Giao hàng'); //[Mang đi, Giao hàng]
  const [editOption, setEditOption] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [positions, setPositions] = useState({});
  const [currentCategory, setCurrentCategory] = useState(null);

  const lastCategoryRef = useRef(currentCategory);
  const {cartState, cartDispatch, authState, authDispatch} =
    useAppContext() || {};

  const {onNavigateProductDetailSheet, onClickAddToCart, handleLogin} =
    useHomeContainer();
  // const { onNavigateLogin, onNavigateRegister } = useAppContainer();

  console.log('authState', authState);

  //hàm gọi vị trí cửa hàng gần nhất và vị trí người dùng hiệnt tại
  useEffect(() => {
    const getMerchantLocation = async () => {
      try {
        setMerchantLocal(
          await AppAsyncStorage.readData(
            AppAsyncStorage.STORAGE_KEYS.merchantLocation,
          ),
        );
      } catch (error) {
        console.log('error', error);
      }
    };

    getMerchantLocation();
  }, []);
  console.log('error cartd', authState.lastName);

  useSaveLocation();

  //hàm gọi đơn hàng chờ thanh toán
  useEffect(() => {
    const getOrderPayment = async () => {
      try {
        setOrderPaymentLocal(
          await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.awaitingPayment)
        );
      } catch (error) {
        console.log('error', error);
      }
    };

    getOrderPayment();
  }, []);
  // console.log('error cartd', cartState);
  console.log('paymentOrder: ', orderPaymentLocal)
  // Hàm xử lý khi đóng dialog
  const handleCloseDialog = () => {
    setIsModalVisible(false);
  };

  // Hàm xử lý khi chọn phương thức giao hàng
  const handleOptionSelect = async option => {
    if (option === 'Mang đi') {
      await CartManager.updateOrderInfo(cartDispatch, {
        deliveryMethod: DeliveryMethod.PICK_UP.value,
        store: cartState?.storeSelect,
        storeInfo: {
          storeName: cartState?.storeInfoSelect?.storeName,
          storeAddress: cartState?.storeInfoSelect?.storeAddress,
        },
      });
    } else if (option === 'Giao hàng') {
      await CartManager.updateOrderInfo(cartDispatch, {
        deliveryMethod: DeliveryMethod.DELIVERY.value,
        store: merchantLocal?._id,
        storeInfo: {
          storeName: merchantLocal?.name,
          storeAddress: merchantLocal?.storeAddress,
        },
      });
    }
    setSelectedOption(option);
    setIsModalVisible(false);
  };

  const handleEditOption = option => {
    if (option === 'Giao hàng') {
      navigation.navigate(UserGraph.SelectAddressScreen, {
        isUpdateOrderInfo: true,
      });
    } else if (option === 'Mang đi') {
      navigation.navigate(BottomGraph.MerchantScreen, {
        isUpdateOrderInfo: true,
        fromHome: true,
      });
    }
    setEditOption(option);
    setIsModalVisible(false);
  };

  const onLayoutCategory = (categoryId, event) => {
    event.target.measureInWindow((x, y) => {
      setPositions(prev => ({...prev, [categoryId]: y}));
    });
  };

  const handleScroll = useCallback(
    event => {
      const scrollY = event.nativeEvent.contentOffset.y;
      let closestCategory = 'Danh mục';
      let minDistance = Number.MAX_VALUE;

      Object.entries(positions).forEach(([categoryId, posY]) => {
        const distance = Math.abs(scrollY - posY);
        if (distance < minDistance) {
          minDistance = distance;
          closestCategory =
            allProducts.find(cat => cat._id === categoryId)?.name || 'Danh mục';
        }
      });

      if (closestCategory !== lastCategoryRef.current) {
        lastCategoryRef.current = closestCategory;
        setCurrentCategory(closestCategory);
      }
    },
    [positions, allProducts],
  );

  useEffect(() => {
    if (categories.length === 0) fetchData(getAllCategories, setCategories);
    if (allProducts.length === 0) fetchData(getAllProducts, setAllProducts);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />

      <HeaderWithBadge
        title={
          authState.isLoggedIn
            ? currentCategory
              ? currentCategory
              : 'Xin chào'
            : 'Chào bạn mới'
        }
        onBadgePress={() => {}}
        isHome={false}
      />

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.containerContent}>
        {authState.lastName ? (
          <BarcodeUser />
        ) : (
          <AuthButton title="Đăng nhập" onPress={handleLogin} />
        )}

        <CardCategory />
        {orderPaymentLocal ? (
        <PrimaryButton title={'Thanh toán đơn hàng'} onPress={() => navigation.navigate(ShoppingGraph.PayOsScreen, {
                            orderId: orderPaymentLocal.orderId,
                            totalPrice: orderPaymentLocal.totalPrice,
                          })}/>
        ) : null}


        {
          allProducts.length > 0 &&
          <ProductsListHorizontal
            title='Sản phẩm mới'
            products={allProducts
              .flatMap(category => category.products)
              .slice(0, 10)}
            onItemClick={productId => {
              onNavigateProductDetailSheet(productId);
            }}
            onIconClick={productId => {
              onClickAddToCart(productId);
            }}
          />
        }
        <NotificationList
          onSeeMorePress={() => navigation.navigate(AppGraph.AdvertisingScreen)}
        />

        <FlatList
          data={allProducts}
          keyExtractor={item => item._id}
          scrollEnabled={false}
          maxToRenderPerBatch={10}
          windowSize={5}
          nestedScrollEnabled
          initialNumToRender={10} // Chỉ render 10 item đầu tiên
          removeClippedSubviews={true} // Tắt item khi ra khỏi màn hình
          renderItem={({item}) => (
            <View onLayout={event => onLayoutCategory(item._id, event)}>
              <ProductsGrid
                title={item.name}
                products={item.products}
                onItemClick={productId => {
                  onNavigateProductDetailSheet(productId);
                }}
                onIconClick={productId => {
                  onClickAddToCart(productId);
                }}
              />
            </View>
          )}
        />

        {/* <Searchbar /> */}
      </ScrollView>
      <DeliveryButton
        deliveryMethod={selectedOption}
        title={selectedOption === 'Mang đi' ? 'Đến lấy tại' : 'Giao đến'}
        address={
          selectedOption === 'Mang đi'
            ? cartState?.storeInfoSelect?.storeAddress
            : cartState?.shippingAddressInfo?.location
            ? cartState?.shippingAddressInfo?.location
            : cartState
            ? cartState?.address?.label
            : 'Đang xác định vị trí...'
        }
        onPress={() => setIsModalVisible(true)}
        style={styles.deliverybutton}
        cartState={cartState}
        onPressCart={async () => {
          await navigation.navigate(ShoppingGraph.CheckoutScreen);
        }}
      />
      <DialogShippingMethod
        isVisible={isModalVisible}
        selectedOption={selectedOption}
        onHide={handleCloseDialog}
        onOptionSelect={handleOptionSelect}
        onEditOption={handleEditOption}
      />
    </SafeAreaView>
  );
};

const Item = ({IconComponent, title, onPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.item}>
    {IconComponent && <IconComponent />}
    <TitleText text={title} style={styles.textTitle} numberOfLines={1} />
  </TouchableOpacity>
);

const CardCategory = ({navigation}) => {
  return (
    <View style={styles.card}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 22}}>
        <Item
          IconComponent={() => (
            <TicketDiscount size="50" color={colors.primary} variant="Bulk" />
          )}
          title="Voucher"
          onPress={() => navigation.navigate(VoucherGraph.MyVouchersScreen)}
        />

        <Item
          IconComponent={() => (
            <Rank size="50" color={colors.pink500} variant="Bulk" />
          )}
          title="Hạng thành viên"
          onPress={() => {
            navigation.navigate(AppGraph.MembershipScreen);
          }}
        />

        <Item
          IconComponent={() => (
            <TaskSquare size="50" color={colors.orange700} variant="Bulk" />
          )}
          title="Đơn Hàng"
          onPress={() => navigation.navigate(OrderGraph.OrderHistoryScreen)}
        />

        <Item
          IconComponent={() => (
            <Coin1 size="50" color={colors.yellow600} variant="Bulk" />
          )}
          title="Đổi xu"
        />

        <Item
          IconComponent={() => (
            <MessageFavorite size="50" color={colors.primary} variant="Bulk" />
          )}
          title="Góp ý"
          onPress={() => {
            navigation.navigate(UserGraph.ContactScreen);
          }}
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
    position: 'relative',
    height: Dimensions.get('window').height,
  },
  containerContent: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 90,
  },
  deliverybutton: {
    position: 'absolute',
    bottom: 0,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  itemImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  textTitle: {
    flexWrap: 'wrap',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginHorizontal: 16,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    justifyContent: 'space-around',
  },
});
