import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getAllProducts, getOrdersByStatus } from '../../axios';
import { DeliveryMethod, OrderStatus } from '../../constants';
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
import { useAuthActions } from '../auth/useAuthActions';

export const useHomeContainer = () => {
  const { authState, cartState, cartDispatch } = useAppContext();

  const navigation = useNavigation();
  const [allProducts, setAllProducts] = useState([]);

  const [editOption, setEditOption] = useState('');
  const [dialogShippingVisible, setDialogShippingVisible] = useState(false);
  const [merchantLocal, setMerchantLocal] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Giao hàng'); //[Mang đi, Giao hàng]
  const [positions, setPositions] = useState({});
  const [currentCategory, setCurrentCategory] = useState(null);
  const lastCategoryRef = useRef(currentCategory);

  const [needToPay, setNeedToPay] = useState(false)

  const { onNavigateLogin } = useAuthActions()
  
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

  const fetchOrderHistory = async () => {
    try {
      const isTokenValid = await AppAsyncStorage.isTokenValid()
      if (isTokenValid) {
        const response = await getOrdersByStatus();
        const awaitingPayments = response.filter(o => o.status === OrderStatus.AWAITING_PAYMENT.value)

        if (awaitingPayments.length > 0) {
          setNeedToPay(true);
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchOrderHistory();
    }, [])
  );




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
    setDialogShippingVisible(false);
  };

  const onLayoutCategory = (categoryId, event) => {
    event.target.measureInWindow((x, y) => {
      setPositions(prev => ({ ...prev, [categoryId]: y }));
    });
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
    dialogShippingVisible,
    selectedOption,
    currentCategory,
    needToPay,
    allProducts,
    handleEditOption,
    setDialogShippingVisible,
    handleScroll,
    handleOptionSelect,
    handleCloseDialog,
    onLayoutCategory,
    onNavigateProductDetailSheet,
    onClickAddToCart,
    navigateCheckOut,
    navigateOrderHistory,
    navigateAdvertising,
    navigateSeedScreen
  };
};
