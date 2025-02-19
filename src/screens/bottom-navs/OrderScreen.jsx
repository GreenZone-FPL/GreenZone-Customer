import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

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
import { AppGraph, ShoppingGraph, UserGraph } from '../../layouts/graphs';

import { getAllCategories, getAllProducts, getAllToppings } from '../../axios';

import {
  getAllCategoriesAPI,
  getAllProductsAPI,
  getAllToppingsAPI,
} from '../../axios';

const OrderScreen = props => {
  const {navigation} = props;
  const [categories, setCategories] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrenLocation] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [editOption, setEditOption] = useState('');
  const [isDialogVisible, setDialogVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [currentCategory, setCurrentCategory] = useState('Danh mục');

  // Hàm xử lý khi đóng dialog
  const handleCloseDialog = () => {
    setIsModalVisible(false);
  };

  // Hàm xử lý khi chọn phương thức giao hàng
  const handleOptionSelect = option => {
    setSelectedOption(option);
    setIsModalVisible(false); // Đóng dialog sau khi chọn
  };

  const handleEditOption = option => {
    setEditOption(option);

    if (option === 'Giao hàng') {
      setIsModalVisible(false);
    } else if (option === 'Mang đi') {
      navigation.navigate(UserGraph.AddressMerchantScreen);
    }
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
    fetchData(getAllCategories, setCategories);

    // Fetch toppings
    fetchData(getAllToppings, setToppings);

    // Fetch all products
    fetchData(getAllProducts, setAllProducts);
  }, []); // Chỉ gọi một lần khi component mount

  const onLayoutCategory = (categoryId, event) => {
    event.target.measureInWindow((x, y) => {
      setPositions(prev => ({...prev, [categoryId]: y}));
    });
  };

  useEffect(() => {
    console.log('Header title updated:', currentCategory);
  }, [currentCategory]);

  const handleScroll = event => {
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

    if (closestCategory !== currentCategory) {
      setCurrentCategory(closestCategory);
    }
  };

  const scrollToCategory = categoryId => {
    if (!scrollViewRef.current) {
      console.log('scrollViewRef.current is null');
      return;
    }

    if (positions[categoryId] !== undefined) {
      console.log('Scrolling to:', positions[categoryId]);
      scrollViewRef.current.scrollTo({
        y: positions[categoryId],
        animated: true,
      });
    } else {
      console.log('Category position not found:', categoryId);
    }
    setDialogVisible(false);
  };

  const onItemClick = productId => {
    console.log('Product clicked:', productId);
    navigation.navigate(ShoppingGraph.ProductDetailSheet, {productId});
  };

  const reverseGeocode = async ({lat, long}) => {
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
        onFavoritePress={() => navigation.navigate(AppGraph.FavoriteScreen)}
        onSearchProduct={() =>
          navigation.navigate(ShoppingGraph.SearchProductScreen)
        }
      />
      <ScrollView
        style={styles.containerContent}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <CategoryMenu
          categories={categories}
          loading={loading}
          onCategorySelect={category => scrollToCategory(category._id)}
        />

        <ProductsListHorizontal
          products={allProducts
            .flatMap(category => category.products)
            .slice(0, 10)}
          onItemClick={onItemClick}
        />

        <FlatList
          data={allProducts}
          keyExtractor={item => item._id}
          scrollEnabled={false} // Đảm bảo danh sách không bị ảnh hưởng bởi cuộn
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <View onLayout={event => onLayoutCategory(item._id, event)}>
              <ProductsListVertical
                title={item.name}
                products={item.products}
                onItemClick={onItemClick}
              />
            </View>
          )}
        />
      </ScrollView>

      <DeliveryButton
        title="Đi giao đến"
        address={
          currentLocation
            ? currentLocation.address.label
            : 'Đang xác định vị trí...'
        }
        onPress={() => setIsModalVisible(true)}
        style={styles.deliverybutton}
        onPressCart={() => navigation.navigate(ShoppingGraph.CheckoutScreen)}
      />

      <DialogShippingMethod
        isVisible={isModalVisible}
        selectedOption={selectedOption}
        onHide={handleCloseDialog}
        onOptionSelect={handleOptionSelect}
        onEditOption={handleEditOption}
      />
      <DialogBasic
        isVisible={isDialogVisible}
        onHide={() => setDialogVisible(false)}
        title="Danh mục">
        <CategoryMenu
          categories={categories}
          loading={loading}
          onCategorySelect={category => {
            scrollToCategory(category._id);
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
