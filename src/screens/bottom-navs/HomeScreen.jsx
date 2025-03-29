import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  BagHappy,
  Coin1,
  Heart,
  MessageFavorite,
  Rank,
  SearchNormal1,
  TaskSquare,
  TicketDiscount,
  TruckFast,
} from 'iconsax-react-native';
import {getAllCategories, getAllProducts} from '../../axios';
import {
  BarcodeUser,
  CategoryMenu,
  DeliveryButton,
  DialogShippingMethod,
  HeaderWithBadge,
  LightStatusBar,
  NormalText,
  NotificationList,
  PrimaryButton,
  ProductsGrid,
  ProductsListHorizontal,
  TitleText,
  NormalLoading,
} from '../../components';
import {colors, DeliveryMethod, GLOBAL_KEYS} from '../../constants';
import {useAppContext} from '../../context/appContext';
import {
  AppGraph,
  BottomGraph,
  ShoppingGraph,
  UserGraph,
  AuthGraph,
  OrderGraph,
  VoucherGraph,
} from '../../layouts/graphs';
import {AppAsyncStorage, CartManager, fetchData} from '../../utils';
import {useAppContainer, useHomeContainer} from '../../containers';
import CallSaveLocation from '../../utils/CallSaveLocation';
import {AuthActionTypes} from '../../reducers';
import {Icon} from 'react-native-paper';
const HomeScreen = props => {
  const {navigation} = props;
  const [categories, setCategories] = useState([]);

  const [merchantLocal, setMerchantLocal] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Giao hàng'); //[Mang đi, Giao hàng]
  const [editOption, setEditOption] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [positions, setPositions] = useState({});
  const [currentCategory, setCurrentCategory] = useState(null);
  const [user, setUser] = useState(null);
  const lastCategoryRef = useRef(currentCategory);
  const {cartState, cartDispatch, authState, authDispatch} =
    useAppContext() || {};
  console.log('authState', JSON.stringify(authState, null, 2));
  const {onNavigateProductDetailSheet, onClickAddToCart} = useHomeContainer();
  const {onNavigateLogin, onNavigateRegister} = useAppContainer();

  useEffect(() => {
    const getUserLastName = async () => {
      const user = await AppAsyncStorage.readData(
        AppAsyncStorage.STORAGE_KEYS.user,
      );
      if (user) {
        setUser(user);
      }
    };

    getUserLastName();
  }, [authState]);

  console.log(user);

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
  // console.log('error cartd', cartState);

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

      {/* // hàm gọi và save location cửa hàng gần nhất - user */}
      <CallSaveLocation />
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.containerContent}>
        {authState.isLoggedIn ? (
          <>
            {!authState.lastName && (
              <Pressable
                style={{
                  marginHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}
                onPress={onNavigateRegister}>
                <NormalText
                  text="Đăng ký"
                  style={{
                    color: colors.primary,
                    fontWeight: '600',
                    textAlign: 'right',
                  }}
                />
                <Icon source={'lead-pencil'} color={colors.primary} size={18} />
              </Pressable>
            )}
            {authState.lastName && <BarcodeUser />}
          </>
        ) : (
          <Pressable
            style={{
              marginHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginBottom: 10,
            }}
            onPress={onNavigateLogin}>
            <NormalText
              text="Đăng nhập"
              style={{
                color: colors.primary,
                fontWeight: '600',
                textAlign: 'right',
              }}
            />
            <Icon source={'lead-pencil'} color={colors.primary} size={18} />
          </Pressable>
        )}

        <CardCategory />

        <NotificationList
          onSeeMorePress={() => navigation.navigate(AppGraph.AdvertisingScreen)}
        />
        <ProductsListHorizontal
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
        {/* <Item
          IconComponent={() => (
            <TruckFast size="50" color={colors.primary} variant="Bulk" />
          )}
          title="Giao hàng"
        />

        <Item
          IconComponent={() => (
            <BagHappy size="50" color={colors.green500} variant="Bulk" />
          )}
          title="Mang đi"
        /> */}

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

const Searchbar = props => {
  const [query, setQuery] = useState('');
  const {navigation} = props;

  const handleSearch = () => {
    if (query.trim()) {
      navigation.navigate('', {searchQuery: query});
    } else {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
    }
  };

  return (
    <View
      style={{
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.gray200,
        padding: 4,
        borderRadius: 4,
        gap: 10,
      }}>
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <TouchableOpacity style={styles.searchBar} onPress={handleSearch}>
          <SearchNormal1 size="20" color={colors.primary} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập từ khóa tìm kiếm..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch} // Cho phép nhấn Enter để tìm kiếm
            returnKeyType="search"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderRadius: 8,
            backgroundColor: colors.green200,
            padding: 10,
            height: 55,
          }}>
          <Heart size="32" color={colors.primary} />
        </TouchableOpacity>
      </View>
      <CategoryMenu />
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
    marginTop: 10,
    width: 70,
    fontSize: 14,
    height: 37,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray200,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: 8,
    width: '84%',
  },
  icon: {
    marginRight: 10, // Khoảng cách giữa icon và TextInput
  },
  input: {
    flex: 1, // Đảm bảo TextInput chiếm hết phần còn lại
    fontSize: 16, // Kích thước chữ trong TextInput
  },
});

const dataBanner = [
  {
    id: 1,
    image:
      'https://bizweb.dktcdn.net/100/260/688/articles/banner-khoa-tong-hop.jpg?v=1701944781280',
  },
  {
    id: 2,
    image:
      'https://printgo.vn/uploads/media/792227/banner-quang-cao-tra-sua-19_1623309814.jpg',
  },
  {
    id: 3,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb7i1iQzn1uIYQ9UTr9OLxZT56U6zImYwslHbRwyfFkKqcP3KJBU8Qkw1msnSWr-tmGyk&usqp=CAU',
  },
];
