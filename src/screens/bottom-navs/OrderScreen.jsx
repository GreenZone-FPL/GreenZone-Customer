import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, FlatList, View } from 'react-native';

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
  const scrollViewRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [currentCategory, setCurrentCategory] = useState("Danh mục");

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
    fetchData(getAllProductsAPI, setAllProducts);
  }, []); // Chỉ gọi một lần khi component mount

  const onLayoutCategory = (event, categoryId) => {
    const { y } = event.nativeEvent.layout;
    setPositions(prev => ({ ...prev, [categoryId]: y }));
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    let closestCategory = "Danh mục";
    let minDistance = Number.MAX_VALUE;

    Object.entries(positions).forEach(([categoryId, positionY]) => {
      const distance = Math.abs(scrollY - positionY);
      if (distance < minDistance) {
        minDistance = distance;
        closestCategory = categories.find(cat => cat._id === categoryId)?.name || "Danh mục";
      }
    });

    setCurrentCategory(closestCategory);
  };


  const scrollToCategory = (categoryId) => {
    if (!scrollViewRef.current) {
      console.log("scrollViewRef.current is null");
      return;
    }

    if (positions[categoryId] !== undefined) {
      console.log("Scrolling to:", positions[categoryId]);
      scrollViewRef.current.scrollTo({ y: positions[categoryId], animated: true });
    } else {
      console.log("Category position not found:", categoryId);
    }
  };

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

      <HeaderOrder
        title={currentCategory}
        onCategoryPress={openDialogCategoryPress}
        onFavoritePress={() =>
          navigation.navigate(AppGraph.FavoriteScreen)
        }
        onSearchProduct={() =>
          navigation.navigate(ShoppingGraph.SearchProductScreen)
        }
      />
      <ScrollView
        style={styles.containerContent}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >


        <CategoryMenu categories={categories} loading={loading} onCategorySelect={(category) => scrollToCategory(category._id)} />


        <ProductsListHorizontal
          products={allProducts.flatMap(category => category.products).slice(0, 10)}
          toppings={toppings}
          onItemClick={onItemClick}


        />
        {
          allProducts.length > 0 &&
          allProducts.map((category) => (
            <View key={category._id} onLayout={(event) => onLayoutCategory(event, category._id)}>
              <ProductsListVertical title={category.name} products={category.products} />
            </View>
          ))


        }

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
        <CategoryMenu
          categories={categories}
          loading={loading}
          onCategorySelect={(category) => {
            setDialogVisible(false)
            scrollToCategory(category._id)
          }}
        />
      </DialogBasic>
    </SafeAreaView>
  );
};


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
