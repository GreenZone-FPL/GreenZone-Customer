import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getAllProducts, getNotifications, getOrdersByStatus, getProfile } from '../../axios';
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
import { AppAsyncStorage, CartManager, fetchData, Toaster } from '../../utils';
import { useAuthActions } from '../auth/useAuthActions';
import { onUserLoginZego } from '../../zego/common';

export const useHomeContainer = () => {
  const { authState, cartState, cartDispatch, updateOrderMessage, setUser, setNotifications } = useAppContext();

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
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingMerchant, setLoadingMerchant] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingNoti, setLoadingNoti] = useState(false);

  const { onNavigateLogin } = useAuthActions()

  const onNavigateProductDetailSheet = productId => {
    navigation.navigate(ShoppingGraph.ProductDetailSheet, { productId });
  };

  const fetchProfile = async (enableLoading) => {
    try {
      if (enableLoading) {
        setLoadingProfile(true)
      }

      if (authState.lastName) {
        const response = await getProfile();
        console.log('ok')
        if (response) {
          setUser(response);
        }
      }

    } catch (error) {
      console.log('error', error);
    } finally {
      if (enableLoading) {
        setLoadingProfile(false)
      }

    }
  };


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (authState.lastName) {
          setLoadingNoti(true)
          const response = await getNotifications()
          if (response) {
            setNotifications(response)
          }
        }

      } catch (error) {
        Toaster.show('Error', error)
      } finally {
        setLoadingNoti(false)
      }
    }

    fetchNotifications()
  }, [])
  useEffect(() => {
    fetchProfile(true)
  }, [])

  useEffect(() => {
    fetchData(getAllProducts, setAllProducts, setLoadingProducts)
  }, []);



  useEffect(() => {
    const getMerchantLocation = async () => {
      setLoadingMerchant(true)
      try {
        setMerchantLocal(
          await AppAsyncStorage.readData(
            AppAsyncStorage.STORAGE_KEYS.merchantLocation,
          ),
        );
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoadingMerchant(false)
      }
    };

    getMerchantLocation();
  }, []);


  useFocusEffect(
    useCallback(() => {
      fetchOrderHistory();
    }, [])
  );


  useEffect(() => {
    // Sau khi hoàn thành đơn hàng, nhận socket và cập nhật lại UI
    // load lần sau, không cần loading
    if (updateOrderMessage.status === OrderStatus.COMPLETED.value) {
      fetchProfile(false)
    }
  }, [updateOrderMessage.status])



  const onClickAddToCart = productId => {
    if (authState.lastName) {
      navigation.navigate(ShoppingGraph.ProductDetailShort, { productId });
    } else {
      onNavigateLogin();
    }

  };

  const fetchOrderHistory = async () => {
    try {

      if (authState.lastName) {
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

  const initZego = async () => {
    const user = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.user);
    if (user.lastName) {
      await onUserLoginZego(user.phoneNumber, user.lastName, navigation);
    }
  }

  useEffect(() => {
    if (authState.lastName) {
      initZego()
    } else {
      console.log('Khong the init Zego')
    }
  }, [authState.lastName])


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
    loadingMerchant,
    loadingProducts,
    loadingProfile,
    loadingNoti,
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
    navigateSeedScreen,
  };
};
