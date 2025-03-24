import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Button,
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
  NotificationList,
  ProductsListHorizontal,
  ProductsListVertical,
  TitleText,
} from '../../components';
import {colors, DeliveryMethod, GLOBAL_KEYS} from '../../constants';
import {useAppContext} from '../../context/appContext';
import {
  AppGraph,
  BottomGraph,
  ShoppingGraph,
  UserGraph,
} from '../../layouts/graphs';
import {
  fetchData,
  fetchUserLocation,
  CartManager,
  AppAsyncStorage,
  LocationManager2,
} from '../../utils';
import {getAllMerchants} from '../../axios/modules/merchant';

import {CartActionTypes, cartInitialState} from '../../reducers';

const HomeScreen = props => {
  const {navigation} = props;
  const [categories, setCategories] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('Giao hàng'); //[Mang đi, Giao hàng]
  const [editOption, setEditOption] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [positions, setPositions] = useState({});
  const [currentCategory, setCurrentCategory] = useState('Chào bạn mới');
  const lastCategoryRef = useRef(currentCategory);
  const {cartState, cartDispatch, merchantLocation, setMerchantLocation} =
    useAppContext();
  const [merchants, setMerchants] = useState([]);

  // Hàm xử lý khi đóng dialog
  const handleCloseDialog = () => {
    setIsModalVisible(false);
  };

  // Hàm xử lý khi chọn phương thức giao hàng
  const handleOptionSelect = async option => {
    let deliveryMethod =
      option === 'Mang đi'
        ? DeliveryMethod.PICK_UP.value
        : DeliveryMethod.DELIVERY.value;

    await CartManager.updateOrderInfo(cartDispatch, {deliveryMethod});

    setSelectedOption(option);
    setIsModalVisible(false); // Đóng dialog sau khi chọn
  };

  // // Hàm xử lý khi chọn phương thức giao hàng
  // const handleOptionSelect = async option => {
  //   let deliveryMethod =
  //     option === 'Mang đi'
  //       ? DeliveryMethod.PICK_UP.value
  //       : DeliveryMethod.DELIVERY.value;
  //   if (option === 'Mang đi') {
  //     const nearestMerchant = await fetchLocation();
  //     await CartManager.updateOrderInfo(cartDispatch, {
  //       storeInfo: {
  //         lat: nearestMerchant.lat,
  //         lng: nearestMerchant.lng,
  //       },
  //       deliveryMethod,
  //     });
  //   } else {
  //   }
  //   await CartManager.updateOrderInfo(cartDispatch, {deliveryMethod});

  //   setSelectedOption(option);
  //   setIsModalVisible(false); // Đóng dialog sau khi chọn
  // };

  const handleEditOption = option => {
    if (option === 'Giao hàng') {
      navigation.navigate(UserGraph.SelectAddressScreen, {
        isUpdateOrderInfo: true,
      });
    } else if (option === 'Mang đi') {
      navigation.navigate(BottomGraph.MerchantScreen, {
        isUpdateOrderInfo: true,
      });
    }
    setEditOption(option);
    setIsModalVisible(false);
  };

  useEffect(() => {
    const load2 = async () => {
      try {
        const userLocation = await fetchUserLocation(
          setCurrentLocation,
          setLoading,
        );
        console.log('userLocation', JSON.stringify(userLocation, null, 2));
        // if (selectedOption !== 'Mang đi') return;
        const newCart = await CartManager.updateOrderInfo(cartDispatch, {
          shippingAddressInfo: {
            location: userLocation.address.label,
            latitude: userLocation.position.lat,
            longitude: userLocation.position.lng,
          },
        });
        console.log('newCart', newCart);
      } catch (error) {
        console.log(error);
      }
    };
    load2();
  }, []);

  const load = async () => {
    if (selectedOption !== 'Mang đi') return;
    try {
      await CartManager.updateOrderInfo(cartDispatch, {
        shippingAddressInfo: {
          location: currentLocation.address.label,
          latitude: currentLocation.position.lat,
          longitude: currentLocation.position.lng,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onLayoutCategory = (categoryId, event) => {
    event.target.measureInWindow((x, y) => {
      setPositions(prev => ({...prev, [categoryId]: y}));
    });
  };

  // useEffect(() => {
  //   console.log('Header title updated:', currentCategory);
  // }, [currentCategory]);

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

  // hàm gọi api merchants
  const fetchMerchants = async () => {
    try {
      const data = await getAllMerchants();
      setMerchants(data.docs);
    } catch (error) {
      console.log('Error fetching merchants:', error);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  // useEffect(() => {
  //   const getNearestStore = async () => {
  //     try {
  //       const userLocation = await fetchUserLocation(
  //         setCurrentLocation,
  //         setLoading,
  //       );
  //       const nearest = LocationManager2.getNearestMerchant(
  //         merchants,
  //         userLocation,
  //       );

  //       if (nearest) {
  //         console.log('Cửa hàng gần nhất:', nearest);

  //         nearest;
  //       } else {
  //         console.log('Không tìm thấy cửa hàng phù hợp.');
  //       }
  //     } catch (error) {
  //       console.log('Lỗi khi lấy vị trí:', error);
  //     }
  //   };

  //   getNearestStore();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <HeaderWithBadge
        title={currentCategory}
        onBadgePress={() => {}}
        isHome={false}
      />

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.containerContent}>
        {/* <Button
          title="Tao cart"
          onPress={async () => {
            await AppAsyncStorage.storeData('CART', cartInitialState);
          }}
        /> */}
        <BarcodeUser nameUser="User name" codeId="M1678263323" />
        <CardCategory />
        {/* <ImageCarousel data={dataBanner} time={2000} /> */}

        <NotificationList
          onSeeMorePress={() => navigation.navigate(AppGraph.AdvertisingScreen)}
        />
        <ProductsListHorizontal
          products={allProducts
            .flatMap(category => category.products)
            .slice(0, 10)}
          onItemClick={productId => {
            navigation.navigate(ShoppingGraph.ProductDetailSheet, {productId});
          }}
          onIconClick={productId => {
            navigation.navigate(ShoppingGraph.ProductDetailShort, {productId});
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
              <ProductsListVertical
                title={item.name}
                products={item.products}
                onItemClick={productId => {
                  navigation.navigate(ShoppingGraph.ProductDetailSheet, {
                    productId,
                  });
                }}
                onIconClick={productId => {
                  navigation.navigate(ShoppingGraph.ProductDetailShort, {
                    productId,
                  });
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
            ? cartState?.storeInfo?.storeAddress
            : cartState?.shippingAddressInfo?.location
            ? cartState?.shippingAddressInfo?.location
            : currentLocation
            ? currentLocation.address.label
            : 'Đang xác định vị trí...'
        }
        onPress={() => setIsModalVisible(true)}
        style={styles.deliverybutton}
        cartState={cartState}
        onPressCart={() => {
          // await load();
          navigation.navigate(ShoppingGraph.CheckoutScreen);
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

const CardCategory = () => {
  return (
    <View style={styles.card}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 22}}>
        <Item
          IconComponent={() => (
            <TruckFast size="50" color={colors.primary} variant="Bulk" />
          )}
          title="Giao hàng"
        />

        <Item
          IconComponent={() => (
            <BagHappy size="50" color={colors.primary} variant="Bulk" />
          )}
          title="Mang đi"
        />

        <Item
          IconComponent={() => (
            <TicketDiscount size="50" color={colors.primary} variant="Bulk" />
          )}
          title="Voucher"
        />

        <Item
          IconComponent={() => (
            <Coin1 size="50" color={colors.primary} variant="Bulk" />
          )}
          title="Đổi xu"
        />

        <Item
          IconComponent={() => (
            <TaskSquare size="50" color={colors.primary} variant="Bulk" />
          )}
          title="Đơn Hàng"
        />

        <Item
          IconComponent={() => (
            <MessageFavorite size="50" color={colors.primary} variant="Bulk" />
          )}
          title="Góp ý"
        />

        <Item
          IconComponent={() => (
            <Rank size="50" color={colors.primary} variant="Bulk" />
          )}
          title="Hạng thành viên"
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
    fontWeight: '400',
    marginTop: 10,
    width: 70,
    fontSize: 12,
    height: 37,
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
