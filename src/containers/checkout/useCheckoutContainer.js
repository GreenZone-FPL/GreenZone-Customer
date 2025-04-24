import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { createOrder } from '../../axios';
import {
    DeliveryMethod,
    OnlineMethod,
    PaymentMethod
} from '../../constants';
import { useAppContext, useCartContext } from '../../context';
import { BottomGraph, OrderGraph, ShoppingGraph } from '../../layouts/graphs';
import { CartActionTypes } from '../../reducers';
import { paymentMethods } from '../../screens/checkout/checkout-components';
import socketService from '../../services/socketService';
import {
    CartManager,
    Toaster
} from '../../utils';
import { useLocation } from '../../utils';

export const useCheckoutContainer = () => {
    const { setUpdateOrderMessage } = useAppContext();
    const { cartState, cartDispatch } = useCartContext();
    
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


    const [timeInfo, setTimeInfo] = useState({
        selectedDay: 'Hôm nay',
        selectedTime: 'Sớm nhất có thể',
    });

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);

    
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
        const orderData = prepareOrderData();
        if (!validateOrderData(orderData)) return;
        try {
            setLoading(true);

            const order = await submitOrder(orderData);

            const newActiveOrder = {
                visible: order.status !== 'awaitingPayment',
                orderId: order._id,
                message: 'Đặt hàng thành công',
                status: order.status,
            };

            setUpdateOrderMessage(newActiveOrder);

            await handleOrderResponse(order);

            await CartManager.clearOrderItems(cartDispatch);
        } catch (error) {
            console.log('error', error);
            Toaster.show('Đã xảy ra lỗi, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };


    const prepareOrderData = () => {
        const newCart = {
            ...cartState,
            fulfillmentDateTime: timeInfo?.fulfillmentDateTime || new Date().toISOString(),
            totalPrice: CartManager.getPaymentDetails(cartState).paymentTotal,
        };

        return newCart.deliveryMethod === DeliveryMethod.PICK_UP.value
            ? CartManager.setUpPickupOrder(newCart)
            : CartManager.setupDeliveryOrder(newCart);
    };

    const validateOrderData = (orderData) => {
        const missingFields = CartManager.checkValid(orderData, orderData.deliveryMethod);
        if (missingFields) {
            Alert.alert('Thiếu thông tin', `${missingFields.join(', ')}`);
            setDialogCreateOrderVisible(false);
            return false;
        }
        return true;
    };

    const submitOrder = async (orderData) => {
        setDialogCreateOrderVisible(false);
        const response = await createOrder(orderData);
        return response?.data
    };


    const handleOrderResponse = async (order) => {
        console.log('order', JSON.stringify(order, null, 3))
        if (order.status === 'awaitingPayment') {
            const paymentParams = {
                orderId: order._id,
                totalPrice: order.totalPrice,
                paymentMethod: cartState.onlineMethod,
            };

            if (cartState.onlineMethod === OnlineMethod.PAYOS.value) {
                navigation.navigate(ShoppingGraph.PayOsScreen, paymentParams);
            } else if (cartState.onlineMethod === OnlineMethod.CARD.value) {
                navigation.navigate(ShoppingGraph.Zalopayscreen, paymentParams);
            }

        } else {
            navigation.reset({
                index: 1,
                routes: [
                    { name: BottomGraph.graphName },
                    {
                        name: OrderGraph.OrderDetailScreen,
                        params: { orderId: order._id },
                    },
                ],
            });
        }

        try {
            await socketService.joinOrder2(order._id, order.status, (data) => {
                setUpdateOrderMessage({
                    visible: data.status !== 'awaitingPayment',
                    orderId: data.orderId,
                    message: data.message,
                    status: data.status,
                });
            });
        } catch (error) {
            console.log('Error', error)
        }
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