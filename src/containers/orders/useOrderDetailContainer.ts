import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { cancelOrder, getOrderDetail } from '../../axios';
import { OnlineMethod, OrderStatus } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { onlineMethods } from '../../screens/checkout/checkout-components';
import { PaymentMethodItem } from "../../type/checkout";
import { Toaster } from '../../utils';

// ✅ Type cho navigation
type ShoppingGraphParamList = {
    PayOsScreen: { orderId: string; totalPrice: number };
    Zalopayscreen: { orderId: string; totalPrice: number };
    OrderHistoryScreen: undefined;
};

interface OrderDetail {
    _id: string;
    totalPrice: number;
    [key: string]: any;
}

export const useOrderDetailContainer = (orderId: string) => {
    console.log('orderId', orderId)
    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodItem>(onlineMethods[0]);
    const [dialogPaymentMethodVisible, setDialogPaymentMethodVisible] = useState(false);
    const [dialogCancelOrderVisible, setDialogCancelOrderVisible] = useState(false);
    const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
    const navigation = useNavigation<NavigationProp<ShoppingGraphParamList>>();
    const { updateOrderMessage, setUpdateOrderMessage } = useAppContext();

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId, updateOrderMessage]);

    const fetchOrderDetail = async () => {
        try {
            const response = await getOrderDetail(orderId);
            console.log('response', response)
            setOrderDetail(response);
        } catch (error) {
            console.error('Error fetching order detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectMethod = (method: PaymentMethodItem) => {
        setPaymentMethod(method);
        if (!orderDetail) return;

        const { _id, totalPrice } = orderDetail;

        if (method.value === OnlineMethod.PAYOS.value) {
            navigation.navigate('PayOsScreen', { orderId: _id, totalPrice });
        } else if (method.value === OnlineMethod.CARD.value) {
            navigation.navigate('Zalopayscreen', { orderId: _id, totalPrice });
        }

        setDialogPaymentMethodVisible(false);
    };

    const backAction = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.reset({
                index: 0,
                routes: [{ name: 'OrderHistoryScreen' }],
            });
        }
        return true;
    }, [navigation]);


    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
            return () => backHandler.remove();
        }, [navigation])
    );

    const onCancelOrder = async () => {
        try {
            if (!orderDetail) return;

            const response = await cancelOrder(orderDetail._id, 'Đổi ý không muốn mua nữa');
            if (response) {
                Toaster.show('Hủy đơn hàng thành công');
                await fetchOrderDetail();
            }
        } catch (error) {
            console.error('Cancel order error:', error);
        } finally {
            setDialogCancelOrderVisible(false);
        }
    };

    const callBackAfterCancel = async () => {
        await fetchOrderDetail()
        setUpdateOrderMessage({
            visible: true,
            orderId: orderId,
            message: 'Hủy đơn hàng thành công',
            status: OrderStatus.CANCELLED.value,
        })
    }

    return {
        cancelDialogVisible,
        setCancelDialogVisible,
        navigation,
        orderDetail,
        setOrderDetail,
        loading,
        setLoading,
        paymentMethod,
        setPaymentMethod,
        dialogPaymentMethodVisible,
        setDialogPaymentMethodVisible,
        dialogCancelOrderVisible,
        setDialogCancelOrderVisible,
        fetchOrderDetail,
        handleSelectMethod,
        onCancelOrder,
        backAction,
        callBackAfterCancel,
    };
};
