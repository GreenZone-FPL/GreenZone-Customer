import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { BagHappy, Coin1, Heart, MessageFavorite, Rank, SearchNormal1, TaskSquare, TicketDiscount, TruckFast } from 'iconsax-react-native';
import {
  BarcodeUser,
  CategoryMenu,
  DeliveryButton,
  DialogShippingMethod,
  HeaderWithBadge,
  ImageCarousel,
  LightStatusBar,
  NotificationList,
  ProductsListHorizontal,
  ProductsListVertical,
  TitleText,
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { getAllToppingsApi } from '../../axios/modules/topping';
import { AppGraph, ShoppingGraph } from '../../layouts/graphs';

const HomeScreen = props => {
  const { navigation } = props;
  const [currentLocation, setCurrenLocation] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [toppings, setToppings] = useState([]);
  // Hàm xử lý khi đóng dialog
  const handleCloseDialog = () => {
    setIsModalVisible(false);
  };

  // Hàm xử lý khi chọn phương thức giao hàng
  const handleOptionSelect = option => {
    setSelectedOption(option);
    setIsModalVisible(false); // Đóng dialog sau khi chọn
  };
  // useEffect(() => {
  //   Geolocation.getCurrentPosition(position => {
  //     console.log(position);
  //     if (position.coords) {
  //       reverseGeocode({
  //         lat: position.coords.latitude,
  //         long: position.coords.longitude,
  //       });
  //     }
  //   });
  // }, []);

  // const reverseGeocode = async ({ lat, long }) => {
  //   const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VI&apikey=Q9zv9fPQ8xwTBc2UqcUkP32bXAR1_ZA-8wLk7tjgRWo`;

  //   try {
  //     const res = await axios(api);
  //     if (res && res.status === 200 && res.data) {
  //       const items = res.data.items;
  //       setCurrenLocation(items[0]);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const data = await getAllToppingsApi();
        if (data) {
          setToppings(data); // Lưu danh mục vào state
        }
      } catch (error) {
        console.error("Error fetching toppings:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchToppings();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <ScrollView style={styles.containerContent}>
        <HeaderWithBadge title="Home" onBadgePress={() => { }} isHome={true} />
        <BarcodeUser nameUser="User name" codeId="M1678263323" />
        <CardCategory />
        <ImageCarousel data={dataBanner} time={2000} />

        <ProductsListHorizontal
          products={productsCombo}
          toppings={toppings}
          onItemClick={(product) => {
            setSelectedProduct(product)
            navigation.navigate(ShoppingGraph.ProductDetailSheet, { product })
          }

          }
        />
        <ProductsListVertical
          onItemClick={() =>
            navigation.navigate(ShoppingGraph.ProductDetailSheet)
          }
        />
        <NotificationList onSeeMorePress={() =>
          navigation.navigate(AppGraph.AdvertisingScreen)
        } />
        {/* <Searchbar /> */}
      </ScrollView>

      {/* <DeliveryButton
        title="Đi giao đến"
        address={currentLocation && currentLocation.address.label}
        onPress={() => setIsModalVisible(true)}
        style={styles.deliverybutton}
        // onPressCart={() => navigation.navigate(OrderGraph.OrderCartScreen)}
        onPressCart={() => navigation.navigate(ShoppingGraph.CheckoutScreen)}
      /> */}
      <DialogShippingMethod
        isVisible={isModalVisible}
        selectedOption={selectedOption}
        onHide={handleCloseDialog}
        onOptionSelect={handleOptionSelect}
      />
    </SafeAreaView>
  );
};

const productsCombo = [
  {
    id: '1',
    name: 'Combo 2 Trà Sữa Trân Châu Hoàng Kim',
    image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
    price: 69000,
  },
  {
    id: '2',
    name: 'Combo 3 Olong Tea',
    image: require('../../assets/images/imgae_product_combo/image_combo_3_milk_tea.png'),
    price: 79000,
  },
  {
    id: '3',
    name: 'Combo 3 Olong Tea',
    image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
    price: 79000,
  },
  {
    id: '4',
    name: 'Combo 3 Olong Tea',
    image: require('../../assets/images/imgae_product_combo/image_combo_3_milk_tea.png'),
    price: 79000,
  },
];

const Item = ({ IconComponent, title, onPress }) => (
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
        contentContainerStyle={{ gap: 22 }}>

        <Item
          IconComponent={() => <TruckFast size="50" color={colors.primary} variant="Bulk" />}
          title="Giao hàng"

        />

        <Item
          IconComponent={() => <BagHappy size="50" color={colors.primary} variant="Bulk" />}
          title="Mang đi"
        />

        <Item
          IconComponent={() => <TicketDiscount size="50" color={colors.primary} variant="Bulk" />}
          title="Voucher"
        />

        <Item
          IconComponent={() => <Coin1 size="50" color={colors.primary} variant="Bulk" />}
          title="Đổi xu"
        />

        <Item
          IconComponent={() => <TaskSquare size="50" color={colors.primary} variant="Bulk" />}
          title="Đơn Hàng"
        />

        <Item
          IconComponent={() => <MessageFavorite size="50" color={colors.primary} variant="Bulk" />}
          title="Góp ý"
        />

        <Item
          IconComponent={() => <Rank size="50" color={colors.primary} variant="Bulk" />}
          title="Hạng thành viên"
        />

      </ScrollView>
    </View>
  );
};

const Searchbar = (props) => {
  const [query, setQuery] = useState('');
  const { navigation } = props;

  const handleSearch = () => {
    if (query.trim()) {
      navigation.navigate('', { searchQuery: query });
    } else {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
    }
  };

  return (
    <View style={{ marginHorizontal: 16, borderWidth: 1, borderColor: colors.gray200, padding: 4, borderRadius: 4, gap: 10 }}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
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
        <TouchableOpacity style={{ borderRadius: 8, backgroundColor: colors.green200, padding: 10, height: 55 }}>
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
  },
  containerContent: {
    flexDirection: 'column',
    flex: 1,
    // marginBottom: 90,
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
    height: 37
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
    flexDirection: 'row',           // Đặt icon và TextInput trên cùng một hàng
    alignItems: 'center',           // Căn giữa theo chiều dọc
    backgroundColor: colors.gray200,     // Màu nền của thanh tìm kiếm
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,               // Bo góc thanh tìm kiếm
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,          // Khoảng cách hai bên
    paddingVertical: 8,             // Độ cao của thanh tìm kiếm  
    width: "84%"               // Khoảng cách xung quanh thanh tìm kiếm
  },
  icon: {
    marginRight: 10,                // Khoảng cách giữa icon và TextInput
  },
  input: {
    flex: 1,                        // Đảm bảo TextInput chiếm hết phần còn lại
    fontSize: 16,                   // Kích thước chữ trong TextInput
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
