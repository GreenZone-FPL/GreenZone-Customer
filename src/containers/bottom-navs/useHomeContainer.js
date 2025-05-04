import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  getAllProducts,
  getNewProducts,
  getNotifications,
  getOrdersByStatus,
  getProductDetail,
  getProfile,
} from '../../axios';
import {DeliveryMethod, OrderStatus} from '../../constants';

import {
  useAppContext,
  useAuthContext,
  useCartContext,
  useProductContext,
} from '../../context';
import {
  AppGraph,
  BottomGraph,
  MainGraph,
  OrderGraph,
  ShoppingGraph,
  UserGraph,
  VoucherGraph,
} from '../../layouts/graphs';
import {CartActionTypes} from '../../reducers';
import {AppAsyncStorage, CartManager, fetchData, Toaster} from '../../utils';
import {onUserLoginZego} from '../../zego/common';
import {useAuthActions} from '../auth/useAuthActions';

export const useHomeContainer = () => {
  const {updateOrderMessage, setUser, setNotifications} = useAppContext();
  const {authState} = useAuthContext();
  const {cartState, cartDispatch} = useCartContext();
  const {allProducts, setAllProducts, newProducts, setNewProducts} =
    useProductContext();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const [editOption, setEditOption] = useState('');
  const [dialogShippingVisible, setDialogShippingVisible] = useState(false);
  const [merchantLocal, setMerchantLocal] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Giao hàng'); //[Mang đi, Giao hàng]
  const [needToPay, setNeedToPay] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingMerchant, setLoadingMerchant] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingNoti, setLoadingNoti] = useState(false);
  const [loadingNewProducts, setLoadingNewProducts] = useState(false);

  const {onNavigateLogin} = useAuthActions();

  const onNavigateProductDetailSheet = productId => {
    navigation.navigate(ShoppingGraph.ProductDetailSheet, {productId});
  };

  const fetchProfile = async enableLoading => {
    try {
      if (enableLoading) {
        setLoadingProfile(true);
      }

      if (authState.lastName) {
        const response = await getProfile();

        if (response) {
          setUser(response);
        }
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      if (enableLoading) {
        setLoadingProfile(false);
      }
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (authState.lastName) {
          setLoadingNoti(true);
          const response = await getNotifications();
          if (response) {
            setNotifications(response);
          }
        }
      } catch (error) {
        Toaster.show('Error', error);
      } finally {
        setLoadingNoti(false);
      }
    };

    fetchNotifications();
  }, []);
  useEffect(() => {
    fetchProfile(true);
  }, []);

  const onRefresh = async () => {
    // Giả lập delay để mô phỏng loading
    try {
      setRefreshing(true);
      const response = await getAllProducts();
      console.log('refreshing');
      if (response) {
        setAllProducts(response);
      }
    } catch (error) {
      Toaster.show('Error', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await getAllProducts();

        if (response) {
          setAllProducts(response);
        }
      } catch (error) {
        Toaster.show('Error', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setLoadingNewProducts(true);
        const response = await getNewProducts();
        console.log('newProducts:', JSON.stringify(response,null,3));
        if (response) {
          setNewProducts(response.docs);
        }
      } catch (error) {
        Toaster.show('Error', error);
      } finally {
        setLoadingNewProducts(false);
      }
    };
    fetchNewProducts();
  }, []);

  useEffect(() => {
    const getMerchantLocation = async () => {
      setLoadingMerchant(true);
      try {
        setMerchantLocal(
          await AppAsyncStorage.readData(
            AppAsyncStorage.STORAGE_KEYS.merchantLocation,
          ),
        );
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoadingMerchant(false);
      }
    };

    getMerchantLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrderHistory();
    }, []),
  );

  useEffect(() => {
    // Sau khi hoàn thành đơn hàng, nhận socket và cập nhật lại UI
    // load lần sau, không cần loading
    if (updateOrderMessage.status === OrderStatus.COMPLETED.value) {
      fetchProfile(false);
    }
  }, [updateOrderMessage.status]);

  const onClickAddToCart = async productId => {
    if (authState.lastName) {
      try {
        setLoadingDetail(true);
        const detail = await getProductDetail(productId);
        if (detail) {
          if (detail.variant.length > 1 || detail.topping.length > 0) {
            navigation.navigate(ShoppingGraph.ProductDetailShort, {
              product: detail,
            });
          } else {
            console.log('addTocart');
            await CartManager.addToCart(
              detail, // product
              detail.variant[0], // variant
              [], // toppings
              detail.sellingPrice, // totalPrice
              1, // quantity
              cartDispatch, // dispatch
            );
          }
        }
      } catch (error) {
        console.log('Error fetchProductDetail:', error);
      } finally {
        setLoadingDetail(false);
      }
    } else {
      onNavigateLogin();
    }
  };

  const fetchOrderHistory = async () => {
    try {
      if (authState.lastName) {
        const response = await getOrdersByStatus();
        console.log('focus');
        const awaitingPayments = response.filter(
          o => o.status === OrderStatus.AWAITING_PAYMENT.value,
        );

        if (awaitingPayments.length > 0) {
          setNeedToPay(true);
        } else {
          setNeedToPay(false);
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleEditOption = option => {
    setDialogShippingVisible(false);
    setEditOption(option);

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

  const handleOptionSelect = option => {
    setDialogShippingVisible(false);
    setSelectedOption(option);

    if (option === 'Mang đi') {
      cartDispatch({
        type: CartActionTypes.UPDATE_ORDER_INFO,
        payload: {
          deliveryMethod: DeliveryMethod.PICK_UP.value,
          store: cartState?.storeSelect,
          storeInfo: {
            storeName: cartState?.storeInfoSelect?.storeName,
            storeAddress: cartState?.storeInfoSelect?.storeAddress,
          },
        },
      });
    } else if (option === 'Giao hàng') {
      cartDispatch({
        type: CartActionTypes.UPDATE_ORDER_INFO,
        payload: {
          deliveryMethod: DeliveryMethod.DELIVERY.value,
          store: merchantLocal?._id,
          storeInfo: {
            storeName: merchantLocal?.name,
            storeAddress: merchantLocal?.storeAddress,
          },
        },
      });
    }
  };

  const handleCloseDialog = () => {
    setDialogShippingVisible(false);
  };

  const initZego = async () => {
    // const user = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.user);
    if (authState.lastName && authState.phoneNumber) {
      await onUserLoginZego(
        authState.phoneNumber,
        authState.lastName,
        navigation,
      );
    }
  };

  useEffect(() => {
    if (authState.lastName) {
      initZego();
    } else {
      console.log('Khong the init Zego');
    }
  }, [authState.lastName]);

  const navigateOrderHistory = () => {
    navigation.navigate(OrderGraph.OrderHistoryScreen);
  };

  const navigateCheckOut = () => {
    navigation.navigate(ShoppingGraph.CheckoutScreen);
  };

  const navigateAdvertising = () => {
    navigation.navigate(AppGraph.HtmlScreen);
  };
  const navigateSeedScreen = () => {
    navigation.navigate(VoucherGraph.SeedScreen);
  };
  const navigateOrderScreen = () => {
    navigation.navigate(MainGraph.OrderStackScreen);
  };

  return {
    dialogShippingVisible,
    selectedOption,
    needToPay,
    loadingMerchant,
    loadingProducts,
    loadingProfile,
    loadingNoti,
    loadingDetail,
    refreshing,
    loadingNewProducts,
    newProducts,
    onRefresh,
    handleEditOption,
    setDialogShippingVisible,
    handleOptionSelect,
    handleCloseDialog,
    onNavigateProductDetailSheet,
    onClickAddToCart,
    navigateCheckOut,
    navigateOrderHistory,
    navigateAdvertising,
    navigateSeedScreen,
  };
};
