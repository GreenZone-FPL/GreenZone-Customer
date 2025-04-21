import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { createOrder } from '../../axios';
import {
    DeliveryMethod,
    OnlineMethod,
    OrderStatus,
    PaymentMethod
} from '../../constants';
import { useAppContext } from '../../context/appContext';
import { MainGraph, OrderGraph, ShoppingGraph } from '../../layouts/graphs';
import { CartActionTypes } from '../../reducers';
import { paymentMethods } from '../../screens/checkout/checkout-components';
import socketService from '../../services/socketService';
import {
    AppAsyncStorage,
    CartManager,
    Toaster
} from '../../utils';
import useSaveLocation from '../../utils/useSaveLocation';

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

    const { cartState, cartDispatch, setUpdateOrderMessage } = useAppContext();

    const [timeInfo, setTimeInfo] = useState({
        selectedDay: 'Hôm nay',
        selectedTime: 'Sớm nhất có thể',
    });

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);

    useSaveLocation()
    const handleSelectMethod = (method, disabled) => {
        if (!disabled) {
            setPaymentMethod(method); // 1. Cập nhật UI ngay, phản hồi nhanh

            setTimeout(() => {
                cartDispatch({
                    type: CartActionTypes.UPDATE_PAYMENT_METHOD,
                    payload: method.paymentMethod
                });
                cartDispatch({
                    type: CartActionTypes.UPDATE_ONLINE_METHOD,
                    payload: method.value
                });
            }, 0); // 2. Cập nhật state toàn cục sau một tick event loop

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
        setActionDialogVisible(false);
        try {
            await CartManager.removeFromCart(id, cartDispatch);
        } catch (error) {
            Toaster.show('Có lỗi xảy ra khi xóa sản phẩm này')
            console.log('Error', error || error.message)
        }
    };

    const onApproveCreateOrder = async () => {
        try {
            setLoading(true)
            let response;
            if (cartState.deliveryMethod === DeliveryMethod.PICK_UP.value) {
                response = await createPickupOrder();
            } else {
                response = await createDeliveryOrder();
            }

            setDialogCreateOrderVisible(false);
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

            if (response?.data?.status === 'awaitingPayment') {
                const paymentParams = {
                    orderId: response.data._id,
                    totalPrice: response.data.totalPrice,
                    paymentMethod: cartState.onlineMethod
                };


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
            await CartManager.clearOrderItems(cartDispatch);
        } catch (error) {
            console.log('error', error);
            Toaster.show('Đã xảy ra lỗi, vui lòng thử lại');
        } finally {
            setLoading(false)

        }
    }

    const createPickupOrder = async () => {
        const pickupOrder = CartManager.setUpPickupOrder(cartState);
        return await createOrder(pickupOrder);
    };

    const createDeliveryOrder = async () => {
        const deliveryOrder = CartManager.setupDeliveryOrder(cartState);
        return await createOrder(deliveryOrder);
    };


    return {
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
        timeInfo,
        setTimeInfo,
        selectedProduct,
        setSelectedProduct,
        paymentMethod,
        deleteProduct,
        handleSelectMethod,
        onApproveCreateOrder,
    }
}