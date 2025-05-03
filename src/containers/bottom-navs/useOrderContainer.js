import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getAllCategories, getProductDetail } from '../../axios';
import { DeliveryMethod } from '../../constants';

import {
  AppGraph,
  BottomGraph,
  ShoppingGraph,
  UserGraph
} from '../../layouts/graphs';

import { AppAsyncStorage, CartManager } from '../../utils';
import { useAuthActions } from '../auth/useAuthActions';
import { useAuthContext, useCartContext, useProductContext } from '../../context';

export const useOrderContainer = () => {
  const { authState } = useAuthContext();
  const { cartState, cartDispatch } = useCartContext();
  const { allProducts, setAllProducts } = useProductContext();
  const { onNavigateLogin } = useAuthActions();
  const navigation = useNavigation();
  const lastCategoryRef = useRef(currentCategory);
  const [refreshing, setRefreshing] = useState(false);


  const [editOption, setEditOption] = useState('');
  const [dialogShippingVisible, setDialogShippingVisible] = useState(false);
  const [merchantLocal, setMerchantLocal] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Giao hàng'); //[Mang đi, Giao hàng]

  const [categories, setCategories] = useState([]);

  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);

  const [positions, setPositions] = useState({});
  const [currentCategory, setCurrentCategory] = useState('Danh mục');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const onClickAddToCart = async productId => {
      if (authState.lastName) {
        try {
          setLoadingDetail(true);
          const detail = await getProductDetail(productId);
          if (detail) {
            console.log('detail', JSON.stringify(detail, null, 3))
            if (detail.variant.length > 1 || detail.topping.length > 0) {
              navigation.navigate(ShoppingGraph.ProductDetailShort, { product: detail });
            } else {
              console.log('addTocart')
              await CartManager.addToCart(
                detail, // product
                detail.variant[0], // variant
                [], // toppings
                detail.sellingPrice, // totalPrice
                1, // quantity
                cartDispatch // dispatch
              )
            }
          }
  
        } catch (error) {
          console.log('Error fetchProductDetail:', error);
        } finally {
          setLoadingDetail(false)
        }
  
      } else {
        onNavigateLogin();
      }
  
    };
  


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


  const handleEditOption = option => {
    setEditOption(option);
    setDialogShippingVisible(false);
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

  };
   const onRefresh = async() => {
      
      // Giả lập delay để mô phỏng loading
      try {
  
        setRefreshing(true);
        const response = await getAllProducts()
        console.log('refreshing')
        if (response) {
          setAllProducts(response)
        }
  
      } catch (error) {
        Toaster.show('Error', error)
      } finally {
        setRefreshing(false)
      }
    };

  const handleOptionSelect = async option => {
    setSelectedOption(option);
    setDialogShippingVisible(false);
    try {
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
    } catch (error) {
      console.log('Error', error)
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

  const handleCloseDialog = () => {
    setDialogShippingVisible(false);
  };

  const handleScroll = useCallback((event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
  
    let closestCategory = 'Danh mục';
    let minDistance = Number.MAX_VALUE;
  
    let minPos = Number.MAX_VALUE;
    let firstCategoryId = null;
  
    Object.entries(positions).forEach(([categoryId, posY]) => {
      const distance = Math.abs(scrollY - posY);
      if (distance < minDistance) {
        minDistance = distance;
        closestCategory = allProducts.find(cat => cat._id === categoryId)?.name || 'Danh mục';
      }
  
      if (posY < minPos) {
        minPos = posY;
        firstCategoryId = categoryId;
      }
    });
  
    // Nếu cuộn lên trên danh mục đầu tiên
    if (scrollY < minPos) {
      if (lastCategoryRef.current !== 'Xin chào') {
        lastCategoryRef.current = 'Xin Chào';
        setCurrentCategory('Xin chào');
      }
      return;
    }
  
    if (closestCategory !== lastCategoryRef.current) {
      lastCategoryRef.current = closestCategory;
      setCurrentCategory(closestCategory);
    }
  }, [positions, allProducts]);

  const onLayoutCategory = (categoryId, event) => {
    event.target.measureInWindow((x, y) => {
      setPositions(prev => ({ ...prev, [categoryId]: y }));
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const data = await getAllCategories();
        setCategories(data.docs);
      } catch (error) {
        console.log(`Error`, error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();

  }, []);

  const navigateCheckOut = () => {
    navigation.navigate(ShoppingGraph.CheckoutScreen);
  };

  const navigateFavorite = () => {
    navigation.navigate(AppGraph.FavoriteScreen);
  };

  const navigateSearchProduct = () => {
    navigation.navigate(ShoppingGraph.SearchProductScreen);
  };

  const onNavigateProductDetailSheet = productId => {
    navigation.navigate(ShoppingGraph.ProductDetailSheet, { productId });
  };


  return {
    dialogShippingVisible,
    selectedOption,
    currentCategory,
    loading,
    categories,
    dialogVisible,
    scrollViewRef,
    loadingProducts,
    loadingCategories,
    loadingDetail,
    refreshing,
    onRefresh,
    setDialogShippingVisible,
    setDialogVisible,
    handleEditOption,
    handleOptionSelect,
    handleCloseDialog,
    onLayoutCategory,
    onNavigateProductDetailSheet,
    onClickAddToCart,
    navigateCheckOut,
    scrollToCategory,
    handleScroll,
    navigateFavorite,
    navigateSearchProduct
  };
};
