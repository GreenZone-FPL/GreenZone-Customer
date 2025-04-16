import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getOrdersByStatus } from '../../axios';
import { OnlineMethod, OrderStatus } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { onlineMethods } from '../../screens/checkout/checkout-components';
import { PaymentMethodItem } from "../../type/checkout";

type ShoppingGraphParamList = {
    PayOsScreen: { orderId: string; totalPrice: number }
    Zalopayscreen: { orderId: string; totalPrice: number }
};

interface OrderDetail {
    _id: string;
    totalPrice: number;
    [key: string]: any;
}

const orderStatuses = ['', 'completed', 'cancelled'];

export const useOrderHistoryContainer = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

    const [orders, setOrders] = useState({}); 
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodItem>(onlineMethods[0]);
   
    const [dialogPaymentMethodVisible, setDialogPaymentMethodVisible] = useState(false);
    const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
    const navigation = useNavigation<NavigationProp<ShoppingGraphParamList>>();
    const { updateOrderMessage } = useAppContext();


    const fetchOrders = async (status: string) => {
        try {
            setLoading(true);
            const data = await getOrdersByStatus(status);
            setOrders(prev => ({ ...prev, [status]: data }));
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        orderStatuses.forEach(status => fetchOrders(status));
    }, [updateOrderMessage]);

    useEffect(() => {
        fetchOrders(orderStatuses[tabIndex]);
    }, [tabIndex]);

    const handleSelectMethod = (method: PaymentMethodItem) => {
        setPaymentMethod(method);
        if (!selectedOrder) return;
        const { _id, totalPrice } = selectedOrder;

        if (method.value === OnlineMethod.PAYOS.value) {
            navigation.navigate('PayOsScreen', { orderId: _id, totalPrice});
        } else if (method.value === OnlineMethod.CARD.value) {
            navigation.navigate('Zalopayscreen', { orderId: _id, totalPrice: totalPrice });
        }
        setDialogPaymentMethodVisible(false);
    };
 
    return {
        navigation,
        tabIndex,
        setTabIndex,
        selectedOrder, 
        setSelectedOrder,
        orders,
        setOrders,
        loading,
        setLoading,
        paymentMethod,
        setPaymentMethod,
        dialogPaymentMethodVisible,
        setDialogPaymentMethodVisible,
        cancelDialogVisible,
        setCancelDialogVisible,
        handleSelectMethod
    };
};
