import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    DeliveryMethod,
    OnlineMethod,
    OrderStatus,
    PaymentMethod
} from '../../constants';
import { useAppContext } from '../../context/appContext';
import { CartActionTypes } from '../../reducers';
import { paymentMethods } from '../../screens/checkout/checkout-components';
import socketService from '../../services/socketService';
import {
    AppAsyncStorage,
    CartManager,
    Toaster,
    fetchUserLocation
} from '../../utils';
import { MainGraph, OrderGraph, ShoppingGraph } from '../../layouts/graphs';
import { createOrder } from '../../axios';

export const useCheckoutContainer = () => {
    const navigation = useNavigation()
    const [dialogCreateOrderVisible, setDialogCreateOrderVisible] =
        useState(false);

    const [dialogRecipientInforVisible, setDialogRecipientInfoVisible] =
        useState(false);
    const [dialogShippingMethodVisible, setDialogShippingMethodVisible] =
        useState(false);
    const [dialogPaymentMethodVisible, setDialogPaymentMethodVisible] =
        useState(false);

    const [dialogSelecTimeVisible, setDialogSelectTimeVisible] = useState(false);
    const [actionDialogVisible, setActionDialogVisible] = useState(false);

    const [loading, setLoading] = useState(false);
    const [currentLocation, setCurrentLocation] = useState('');
    const { cartState, cartDispatch, setUpdateOrderMessage, awaitingPayments, setAwaitingPayments } = useAppContext();

    const [timeInfo, setTimeInfo] = React.useState({
        selectedDay: 'Hôm nay',
        selectedTime: 'Sớm nhất có thể',
    });

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);

    const handleSelectMethod = (method, disabled) => {
        if (!disabled) {
            setPaymentMethod(method);
            if (cartState.paymentMethod !== method.paymentMethod || cartState.onlineMethod !== method.value) {
                cartDispatch({
                    type: CartActionTypes.UPDATE_ORDER_INFO,
                    payload: {
                        paymentMethod: method.paymentMethod,
                        onlineMethod: method.value,
                    },
                });

            }
            setDialogPaymentMethodVisible(false);
        } else {
            Toaster.show(
                "Phương thức thanh toán không khả dụng với đơn Tự đến lấy tại cửa hàng"
            );
        }
    };
    useEffect(() => {
        const setUpPaymentMethod = () => {
            let selectedPayment

            if (cartState.deliveryMethod === DeliveryMethod.PICK_UP.value) {
                selectedPayment = paymentMethods.find(
                    (m) => m.value === OnlineMethod.PAYOS.value
                );
            } else {
                selectedPayment = paymentMethods.find(
                    (m) => m.paymentMethod === PaymentMethod.COD.value
                );
            }

            if (selectedPayment) {
                setPaymentMethod(selectedPayment);

                cartDispatch({
                    type: CartActionTypes.UPDATE_ORDER_INFO,
                    payload: {
                        paymentMethod: selectedPayment.paymentMethod,
                        onlineMethod: selectedPayment.value
                    },
                });
            } else {
                console.log("Không tìm thấy phương thức thanh toán phù hợp.");
            }
        };

        setUpPaymentMethod();
    }, [cartState.deliveryMethod]);

    useEffect(() => {
        const initSocket = async () => {
            await socketService.initialize();
        };
        initSocket();

        return () => { };
    }, []);


    useEffect(() => {
        if (timeInfo?.fulfillmentDateTime) {
            const fulfillmentTimeISO = new Date(
                timeInfo.fulfillmentDateTime,
            ).toISOString();
            const nowISO = new Date().toISOString();

            if (fulfillmentTimeISO < nowISO) {
                setTimeInfo({ selectedDay: 'Hôm nay', selectedTime: 'Sớm nhất có thể' });
            }
        }
    }, [timeInfo?.fulfillmentDateTime]);


    // Xóa sản phẩm sau khi xác nhận
    const deleteProduct = async id => {
        await CartManager.removeFromCart(id, cartDispatch);
        setActionDialogVisible(false);
    };

    useEffect(() => {
        fetchUserLocation(setCurrentLocation, setLoading);
    }, []);


    const onApproveCreateOrder = async () => {
        try {
            setLoading(true)
            let response = null;
            if (cartState.deliveryMethod === DeliveryMethod.PICK_UP.value) {
                const pickupOrder = CartManager.setUpPickupOrder(cartState);
                console.log(
                    'pickupOrder =',
                    JSON.stringify(pickupOrder, null, 2),
                );
                response = await createOrder(pickupOrder);
            } else if (
                cartState.deliveryMethod === DeliveryMethod.DELIVERY.value
            ) {
                const deliveryOrder = CartManager.setupDeliveryOrder(cartState);
                console.log(
                    'deliveryOrder =',
                    JSON.stringify(deliveryOrder, null, 2),
                );

                response = await createOrder(deliveryOrder);
            }
            const newActiveOrder = {
                visible: response?.data.status !== 'awaitingPayment',
                orderId: response?.data?._id,
                message: 'Đặt hàng thành công',
                status: response?.data?.status,
            };
            await AppAsyncStorage.addToActiveOrders(newActiveOrder);
            setUpdateOrderMessage(newActiveOrder);

            await socketService.joinOrder2(
                response?.data?._id,
                response?.data?.status,
                data => {
                    setUpdateOrderMessage({
                        visible: data.status !== 'awaitingPayment',
                        orderId: data.orderId,
                        message: data.message,
                        status: data.status,
                    });
                },
            );

            console.log('order data =', JSON.stringify(response, null, 2));
            if (response?.data.status !== OrderStatus.AWAITING_PAYMENT.value) {
                await CartManager.clearOrderItems(cartDispatch);
            }


            if (response?.data?.status === 'awaitingPayment') {
                const paymentParams = {
                    orderId: response.data._id,
                    totalPrice: response.data.totalPrice,
                    paymentMethod: cartState.onlineMethod
                };
                console.log('paymentParams', paymentParams)
                await AppAsyncStorage.storeData(
                    AppAsyncStorage.STORAGE_KEYS.awaitingPayments, paymentParams);

                setAwaitingPayments(paymentParams)

                if (cartState.onlineMethod === OnlineMethod.PAYOS.value) {
                    navigation.navigate(ShoppingGraph.PayOsScreen, paymentParams);
                }
                else if (cartState.onlineMethod === OnlineMethod.CARD.value) {
                    navigation.navigate(ShoppingGraph.Zalopayscreen, paymentParams);
                }
            } else {
                navigation.reset({
                    index: 1,
                    routes: [
                        { name: MainGraph.graphName },
                        {
                            name: OrderGraph.OrderDetailScreen,
                            params: { orderId: response?.data?._id },
                        },
                    ],
                });
            }
        } catch (error) {
            console.log('error', error);
            Toaster.show('Đã xảy ra lỗi, vui lòng thử lại');
        } finally {
            setLoading(false)
            setDialogCreateOrderVisible(false);
        }
    }

    return {
        navigation,
        dialogCreateOrderVisible,
        setDialogCreateOrderVisible,
        dialogRecipientInforVisible,
        setDialogRecipientInfoVisible,
        dialogShippingMethodVisible,
        setDialogShippingMethodVisible,
        dialogPaymentMethodVisible,
        setDialogPaymentMethodVisible,
        dialogSelecTimeVisible,
        setDialogSelectTimeVisible,
        actionDialogVisible,
        setActionDialogVisible,
        loading,
        setLoading,
        currentLocation,
        setCurrentLocation,
        timeInfo,
        setTimeInfo,
        selectedProduct,
        setSelectedProduct,
        paymentMethod,
        setPaymentMethod,
        deleteProduct,
        handleSelectMethod,
        onApproveCreateOrder
    }
}