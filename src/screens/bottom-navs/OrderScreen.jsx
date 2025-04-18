import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { getAllCategories, getAllProducts, getAllToppings } from '../../axios';
import {
  AuthContainer,
  CategoryMenu,
  DeliveryButton,
  DialogBasic,
  DialogShippingMethod,
  HeaderOrder,
  LightStatusBar,
  ProductsListHorizontal,
  ProductsListVertical
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContainer, useHomeContainer } from '../../containers';
import { useAppContext } from '../../context/appContext';
import { AppGraph, ShoppingGraph, UserGraph } from '../../layouts/graphs';
import { fetchData, fetchUserLocation } from '../../utils';

const OrderScreen = props => {
  const { navigation } = props;
  const [categories, setCategories] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [editOption, setEditOption] = useState('');
  const [isDialogVisible, setDialogVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [currentCategory, setCurrentCategory] = useState('Danh mục');
  const { cartState, cartDispatch, authState, authDispatch } =
    useAppContext() || {};

  const { onNavigateProductDetailSheet, onClickAddToCart } = useHomeContainer();
  const { onNavigateLogin, onNavigateRegister } = useAppContainer();
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
    fetchUserLocation(setCurrentLocation, setLoading);
  }, []);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.docs);
      } catch (error) {
        console.log(`Error`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    // Fetch toppings
    fetchData(getAllToppings, setToppings);

    // Fetch all products
    fetchData(getAllProducts, setAllProducts);
  }, []); // Chỉ gọi một lần khi component mount

  const onLayoutCategory = (categoryId, event) => {
    event.target.measureInWindow((x, y) => {
      setPositions(prev => ({ ...prev, [categoryId]: y }));
    });
  };

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
        {!authState.lastName && (
          <AuthContainer onPress={onNavigateLogin} />
        )}
        <CategoryMenu
          categories={categories}
          loading={loading}
          onCategorySelect={category => scrollToCategory(category._id)}
        />

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

        <FlatList
          data={allProducts}
          keyExtractor={item => item._id}
          scrollEnabled={false} // Đảm bảo danh sách không bị ảnh hưởng bởi cuộn
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View onLayout={event => onLayoutCategory(item._id, event)}>
              <ProductsListVertical
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
        onPressCart={() => {
          navigation.navigate(ShoppingGraph.CheckoutScreen);
        }}
      />
      {
        isModalVisible &&
        <DialogShippingMethod
          isVisible={isModalVisible}
          selectedOption={selectedOption}
          onHide={handleCloseDialog}
          onOptionSelect={handleOptionSelect}
          onEditOption={handleEditOption}
        />
      }


      {
        isDialogVisible &&
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
      }

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
