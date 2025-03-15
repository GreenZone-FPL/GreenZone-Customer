import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { getAllProducts } from '../../axios';
import { CustomSearchBar, LightStatusBar, NormalText, ProductsListVertical, Row } from '../../components';
import { GLOBAL_KEYS, colors } from '../../constants';
import { ShoppingGraph } from '../../layouts/graphs';

const { width } = Dimensions.get('window');

const SearchProductScreen = props => {
  const { navigation } = props;
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        if (data.length > 0) {
          setAllProducts(data.flatMap(category => category.products));
          setFilteredProducts(data.flatMap(category => category.products)); // Khởi tạo danh sách hiển thị
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
      .replace(/đ/g, "d").replace(/Đ/g, "D") // Thay đ → d, Đ → D
      .toLowerCase(); // Chuyển về chữ thường
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    const queryNormalized = removeVietnameseTones(query.trim());
  
    if (queryNormalized === '') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(item =>
        removeVietnameseTones(item.name).includes(queryNormalized)
      );
      setFilteredProducts(filtered);
    }
  };
  

  const onItemClick = productId => {
    navigation.navigate(ShoppingGraph.ProductDetailSheet, { productId });
  };

  return (
    <View style={styles.content}>
      <LightStatusBar />
      <Row style={{ padding: GLOBAL_KEYS.PADDING_DEFAULT, gap: 16 }}>
        <CustomSearchBar
          placeholder="Tìm kiếm..."
          searchQuery={searchQuery}
          setSearchQuery={handleSearch}
          onClearIconPress={() => setSearchQuery('')}
          leftIcon="magnify"
          rightIcon="close"
          style={{ flex: 1, elevation: 3, backgroundColor: colors.fbBg }}
        />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <NormalText text="Huỷ" style={{ color: colors.orange700, fontWeight: '500' }} />
        </TouchableOpacity>
      </Row>

      <ProductsListVertical
        scrollEnabled={true}
        products={filteredProducts}
        onItemClick={onItemClick}
      />

    </View>
  );
};



const styles = StyleSheet.create({
  content: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.white,
    flex: 1,
  }
});

export default SearchProductScreen
