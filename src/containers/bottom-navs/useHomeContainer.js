import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getAllProducts, getProfile } from '../../axios';
import { DeliveryMethod } from '../../constants';
import { useAppContext } from '../../context/appContext';
import {
  AppGraph,
  BottomGraph,
  OrderGraph,
  ShoppingGraph,
  UserGraph,
  VoucherGraph,
} from '../../layouts/graphs';
import { AppAsyncStorage, CartManager, fetchData } from '../../utils';
import { useAppContainer } from '../useAppContainer';

export const useHomeContainer = () => {
  const { authState, cartState, cartDispatch } = useAppContext();
  const { onNavigateLogin } = useAppContainer();
  const navigation = useNavigation();
  const [allProducts, setAllProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [editOption, setEditOption] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [merchantLocal, setMerchantLocal] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Giao hàng'); //[Mang đi, Giao hàng]
  const [positions, setPositions] = useState({});
  const [currentCategory, setCurrentCategory] = useState(null);
  const lastCategoryRef = useRef(currentCategory);


  const onNavigateProductDetailSheet = productId => {
    navigation.navigate(ShoppingGraph.ProductDetailSheet, { productId });
  };

  const onClickAddToCart = async productId => {
    try {
      const isTokenValid = await AppAsyncStorage.readData(
        AppAsyncStorage.STORAGE_KEYS.accessToken,
      );

      if (isTokenValid && authState.lastName) {
        navigation.navigate(ShoppingGraph.ProductDetailShort, { productId });
      } else {
        onNavigateLogin();
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('Màn hình được focus và useFocusEffect chạy');
  
      const fetchProfile = async () => {
        try {
          const response = await getProfile();
          if (response) {
            setUser(response);
          }
        } catch (error) {
          console.log('error', error);
        }
      };
  
      fetchProfile();
  
    }, [])
  );

  useEffect(() => {
    if (allProducts.length === 0) {
      fetchData(getAllProducts, setAllProducts).then(r => { });
    }
  }, [allProducts.length]);

  //hàm gọi vị trí cửa hàng gần nhất và vị trí người dùng hiệnt tại
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

  const handleLogin = () => {
    console.log('press');
    onNavigateLogin();
  };

  const handleEditOption = option => {
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
    setEditOption(option);
    setIsModalVisible(false);
  };

  const handleOptionSelect = async option => {
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
    setSelectedOption(option);
    setIsModalVisible(false);
  };

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

  const handleCloseDialog = () => {
    setIsModalVisible(false);
  };

  const onLayoutCategory = (categoryId, event) => {
    event.target.measureInWindow((x, y) => {
      setPositions(prev => ({ ...prev, [categoryId]: y }));
    });
  };


  const navigateNotification = () => {
    navigation.navigate(AppGraph.NotificationScreen);
  };

  const navigateOrderHistory = () => {
    navigation.navigate(OrderGraph.OrderHistoryScreen);
  };

  const navigateCheckOut = () => {
    navigation.navigate(ShoppingGraph.CheckoutScreen);
  };

  const navigateAdvertising = () => {
    navigation.navigate(AppGraph.AdvertisingScreen);
  };
  const navigateSeedScreen = () => {
    navigation.navigate(VoucherGraph.SeedScreen);
  };

  return {
    navigation,
    isModalVisible,
    setIsModalVisible,
    selectedOption,
    setSelectedOption,
    editOption,
    positions,
    setPositions,
    currentCategory,
    setCurrentCategory,
    lastCategoryRef,
    handleScroll,
    user,
    setUser,
    allProducts,
    setAllProducts,
    handleEditOption,
    handleOptionSelect,
    handleCloseDialog,
    onLayoutCategory,
    handleLogin,
    onNavigateProductDetailSheet,
    onClickAddToCart,
    navigateNotification,
    navigateCheckOut,
    navigateOrderHistory,
    navigateAdvertising,
    navigateSeedScreen,
  };
};
