import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import {
  CategoryMenu,
  DeliveryButton,
  DialogBasic,
  DialogShippingMethod,
  HeaderOrder,
  LightStatusBar,
  ProductsListHorizontal,
  ProductsListVertical,
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { AppGraph, ShoppingGraph } from '../../layouts/graphs';

import { getAllCategoriesAPI, getAllToppingsAPI, getAllProductsAPI } from '../../axios';


const OrderScreen = props => {
  const { navigation } = props;
  const [categories, setCategories] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrenLocation] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isDialogVisible, setDialogVisible] = useState(false);

  // Hàm xử lý khi đóng dialog
  const handleCloseDialog = () => {
    setIsModalVisible(false);
  };


  // Hàm xử lý khi chọn phương thức giao hàng
  const handleOptionSelect = option => {
    setSelectedOption(option);
    setIsModalVisible(false); // Đóng dialog sau khi chọn
  };



  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      // console.log(position);
      if (position.coords) {
        reverseGeocode({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      }
    });
  }, []);

  // Hàm gọi API chung
  const fetchData = async (api, setter, callback) => {
    try {
      const data = await api();
      setter(data); // Cập nhật state
      if (callback) {
        callback(data); // Truyền dữ liệu vào callback thay vì sử dụng state
      }
    } catch (error) {
      console.error(`Error fetching data from ${api.toString()}:`, error);
    } finally {
      setLoading(false); // Dừng loading khi lấy dữ liệu xong
    }
  };

  useEffect(() => {
    // Fetch categories
    fetchData(getAllCategoriesAPI, setCategories);

    // Fetch toppings
    fetchData(getAllToppingsAPI, setToppings);

    // Fetch all products
    fetchData(getAllProductsAPI, setAllProducts, (data) => {
      if (data.length > 0) {
        // Lọc sản phẩm từ tất cả các danh mục và lấy 10 sản phẩm đầu tiên
        setAllProducts(data.flatMap(category => category.products).slice(0, 10));
      }
    });
  }, []); // Chỉ gọi một lần khi component mount


  const onItemClick = (productId) => {
    console.log("Product clicked:", productId);
    navigation.navigate(ShoppingGraph.ProductDetailSheet, { productId });
  };

  const reverseGeocode = async ({ lat, long }) => {
    const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VI&apikey=Q9zv9fPQ8xwTBc2UqcUkP32bXAR1_ZA-8wLk7tjgRWo`;

    try {
      const res = await axios(api);
      if (res && res.status === 200 && res.data) {
        const items = res.data.items;
        setCurrenLocation(items[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const openDialogCategoryPress = () => {
    setDialogVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />


      <ScrollView style={styles.containerContent}>
        <HeaderOrder
          title="Danh mục"
          onCategoryPress={openDialogCategoryPress}
          onFavoritePress={() =>
            navigation.navigate(AppGraph.MyFavoriteProducts)
          }
          onSearchProduct={() =>
            navigation.navigate(ShoppingGraph.SearchProductScreen)
          }
        />

        <CategoryMenu categories={categories} loading={loading} />


        <ProductsListHorizontal
          products={allProducts}
          toppings={toppings}
          onItemClick={onItemClick}


        />
        <ProductsListVertical
          products={allProducts}
          onItemClick={onItemClick}
        />
      </ScrollView>

      <DeliveryButton
        title="Đi giao đến"
        address={currentLocation && currentLocation.address.label}
        onPress={() => setIsModalVisible(true)}
        style={styles.deliverybutton}
        onPressCart={() => navigation.navigate(ShoppingGraph.CheckoutScreen)}
      />
      <DialogShippingMethod
        isVisible={isModalVisible}
        selectedOption={selectedOption}
        onHide={handleCloseDialog}
        onOptionSelect={handleOptionSelect}
      />
      <DialogBasic
        isVisible={isDialogVisible}
        onHide={() => setDialogVisible(false)}
        title="Danh mục">
        <CategoryMenu />
      </DialogBasic>
    </SafeAreaView>
  );
};

const productsCombo = [
  {
    id: '1',
    name: 'Combo 2 Trà Sữa Trân Châu Hoàng Kim',
    image: 'https://greenzone.motcaiweb.io.vn/uploads/81bd11bb-c0b9-4a0d-a9ee-d8afc8ef879a.jpg',
    price: 69000,
  },
  {
    id: '2',
    name: 'Combo 3 Olong Tea',
    image: 'https://greenzone.motcaiweb.io.vn/uploads/4d785911-f2e6-4dbf-a861-04c62c4cb804.jpg',
    price: 79000,
  },
  {
    id: '3',
    name: 'Combo 3 Olong Tea',
    image: "https://greenzone.motcaiweb.io.vn/uploads/99e39749-6bcb-4a9d-b387-7684a14cacf8.jpg",
    price: 79000,
  },
  {
    id: '4',
    name: 'Combo 3 Olong Tea',
    image: 'https://greenzone.motcaiweb.io.vn/uploads/c9773a10-706e-44e5-8199-dd07a9faa94d.jpg',
    price: 79000,
  },
];

export default OrderScreen;

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
    marginBottom: 90,
  },
  deliverybutton: {
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
});
