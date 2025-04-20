import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { getAllCategories, getAllProducts } from '../../axios';
import { DeliveryMethod } from '../../constants';
import { useAppContext } from '../../context/appContext';
import {
  AppGraph,
  BottomGraph,
  ShoppingGraph,
  UserGraph
} from '../../layouts/graphs';

import { AppAsyncStorage, CartManager, fetchData } from '../../utils';
import { useAppContainer } from '../useAppContainer';
import { useAuthActions } from '../auth/useAuthActions';

export const useOrderContainer = () => {
  const { authState, cartState, cartDispatch } = useAppContext();
  const { onNavigateLogin } = useAuthActions();
  const navigation = useNavigation();

  const [allProducts, setAllProducts] = useState([]);

  const [editOption, setEditOption] = useState('');
  const [dialogShippingVisible, setDialogShippingVisible] = useState(false);
  const [merchantLocal, setMerchantLocal] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Giao hàng'); //[Mang đi, Giao hàng]

  const [categories, setCategories] = useState([]);

  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const [dialogVisible, setDialogVisible] = useState(false);

  const [positions, setPositions] = useState({});
  const [currentCategory, setCurrentCategory] = useState('Danh mục');

  const onClickAddToCart = productId => {

    if (authState.lastName) {
      navigation.navigate(ShoppingGraph.ProductDetailShort, { productId });
    } else {
      onNavigateLogin();
    }

  };

  useEffect(() => {
    if (allProducts.length === 0) {
      fetchData(getAllProducts, setAllProducts).then(r => { });
    }
  }, [allProducts.length]);


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

  const onLayoutCategory = (categoryId, event) => {
    event.target.measureInWindow((x, y) => {
      setPositions(prev => ({ ...prev, [categoryId]: y }));
    });
  };

  useEffect(() => {
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

    fetchData(getAllProducts, setAllProducts, setLoading);
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
    allProducts,
    loading,
    categories,
    dialogVisible,
    scrollViewRef,
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
