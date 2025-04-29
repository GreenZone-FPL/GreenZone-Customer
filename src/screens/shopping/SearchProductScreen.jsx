import debounce from 'lodash.debounce';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { getAllProducts } from '../../axios';
import {
  CustomSearchBar,
  LightStatusBar,
  NormalText,
  ProductsListVertical,
  Row,
} from '../../components';
import { GLOBAL_KEYS, colors } from '../../constants';
import { useHomeContainer } from '../../containers';


const { width } = Dimensions.get('window');

const SearchProductScreen = props => {
  const { navigation } = props;
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { onNavigateProductDetailSheet, onClickAddToCart } = useHomeContainer();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        if (data.length > 0) {
          const allProductsRaw = data.flatMap(category => category.products);

          // Dùng Map để loại bỏ sản phẩm trùng id
          const uniqueProductsMap = new Map();
          allProductsRaw.forEach(product => {
            if (!uniqueProductsMap.has(product._id)) {
              uniqueProductsMap.set(product._id, product);
            }
          });

          const uniqueProducts = Array.from(uniqueProductsMap.values());

          setAllProducts(uniqueProducts);
          setFilteredProducts(uniqueProducts); // Khởi tạo danh sách hiển thị ban đầu
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);


  const removeVietnameseTones = str => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D') // Thay đ → d, Đ → D
      .toLowerCase(); // Chuyển về chữ thường
  };

  const realHandleSearch = query => {
    const queryNormalized = removeVietnameseTones(query.trim());

    if (queryNormalized === '') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(item =>
        removeVietnameseTones(item.name).includes(queryNormalized),
      );
      setFilteredProducts(filtered);
    }
  };

  const debouncedHandleSearch = React.useMemo(
    () => debounce(realHandleSearch, 300),
    [allProducts]
  );

  const handleSearchInput = query => {
    setSearchQuery(query); // Gõ input thì cập nhật ngay
    debouncedHandleSearch(query); // Search thì delay
  };




  const onItemClick = productId => {
    onNavigateProductDetailSheet(productId);
  };

  const onIconClick = productId => {
    onClickAddToCart(productId);
  };
  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredProducts(allProducts);
  };
  return (
    <View style={styles.content}>
      <LightStatusBar />
      <Row style={{ padding: GLOBAL_KEYS.PADDING_DEFAULT, gap: 16 }}>
        <CustomSearchBar
          placeholder="Tìm kiếm..."
          searchQuery={searchQuery}
          setSearchQuery={handleSearchInput}
          onClearIconPress={handleClearSearch}
          leftIcon="magnify"
          rightIcon="close"
          style={{ flex: 1, elevation: 3, backgroundColor: colors.fbBg }}
        />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <NormalText
            text="Huỷ"
            style={{ color: colors.orange700, fontWeight: '500' }}
          />
        </TouchableOpacity>
      </Row>

      <ProductsListVertical
        scrollEnabled={true}
        products={filteredProducts}
        onItemClick={onItemClick}
        onIconClick={onIconClick}
      />
    </View>
  );
};

export const useDebounce = (callback, delay) => {
  const latestCallback = useRef(callback);
  const timer = useRef(null);

  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  const debouncedFunction = (...args) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      latestCallback.current(...args);
    }, delay);
  };

  return debouncedFunction;
};

const styles = StyleSheet.create({
  content: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.white,
    flex: 1,
  },
});

export default SearchProductScreen;
