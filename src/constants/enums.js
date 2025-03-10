export const DeliveryMethod = Object.freeze({
    PICK_UP: { label: "Nhận tại cửa hàng", value: "pickup" },
    DELIVERY: { label: "Giao hàng tận nơi", value: "delivery" }
});



export const PaymentMethod = Object.freeze({
    ONLINE: { label: "online", value: "online" },
    COD: { label: "cod", value: "cod" }
})

export const OrderStatus = Object.freeze({
    AWAITING_PAYMENT: { label: "Chờ thanh toán", value: "awaitingPayment" },
    PENDING_CONFIRMATION: { label: "Chờ xác nhận", value: "pendingConfirmation" },
    PROCESSING: { label: "Đang xử lý", value: "processing" },
    READY_FOR_PICKUP: { label: "Chờ lấy hàng", value: "readyForPickup" },  
    SHIPPING_ORDER: { label: "Đang giao hàng", value: "shippingOrder" },
    COMPLETED: { label: "Hoàn thành", value: "completed" },
    CANCELLED: { label: "Đã hủy", value: "cancelled" },
    FAILED_DELIVERY: { label: "Giao hàng thất bại", value: "failedDelivery" },

    getLabels() {
        return Object.values(this).map(status => status.label);
    },

    getValues() {
        return Object.values(this).map(status => status.value);
    },

    getMessageByOrder(order) {
        if (!order || !order.status) {
            return "Thông tin đơn hàng không hợp lệ.";
        }
    
        const orderId = order.data._id;
        switch (order.data.status) {
            case this.AWAITING_PAYMENT.value:
                return `Đơn hàng ${orderId} đang chờ thanh toán${order.paymentMethod === "online" ? ". Vui lòng thanh toán trực tuyến." : ""}`;
            case this.PENDING_CONFIRMATION.value:
                return `Đơn hàng ${orderId} của bạn đang chờ xác nhận từ cửa hàng.`;
            case this.PROCESSING.value:
                return `Đơn hàng ${orderId} đang được xử lý.`;
            case this.READY_FOR_PICKUP.value:
                return `Đơn hàng ${orderId} đã sẵn sàng. Vui lòng đến lấy hàng trước ${new Date(order.fulfillmentDateTime).toLocaleString()}.`;
            case this.SHIPPING_ORDER.value:
                return `Đơn hàng ${orderId} đang trên đường giao. Hãy theo dõi tình trạng vận chuyển.`;
            case this.COMPLETED.value:
                return `Đơn hàng ${orderId} đã giao thành công. Cảm ơn bạn đã mua sắm!`;
            case this.CANCELLED.value:
                return `Đơn hàng ${orderId} đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ hỗ trợ.`;
            case this.FAILED_DELIVERY.value:
                return `Đơn hàng ${orderId} giao hàng không thành công. Vui lòng kiểm tra lại thông tin giao hàng.`;
            default:
                return `Đơn hàng ${orderId} có trạng thái không xác định.`;
        }
    }
    
});


// Cách sử dụng:
// console.log(OrderStatus.getLabels()); // Lấy toàn bộ label
// console.log(OrderStatus.getValues()); // Lấy toàn bộ value







