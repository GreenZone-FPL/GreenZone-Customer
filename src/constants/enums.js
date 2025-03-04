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
    }
});

// Cách sử dụng:
// console.log(OrderStatus.getLabels()); // Lấy toàn bộ label
// console.log(OrderStatus.getValues()); // Lấy toàn bộ value







