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
    PENDING_CONFIRMATION: { label: "Chờ xác nhận đơn", value: "pendingConfirmation" },
    PROCESSING: { label: "Thực hiện đơn", value: "processing" },
    READY_FOR_PICKUP: { label: "Đã làm xong đơn, sẵn sàng giao", value: "readyForPickup" },
    SHIPPING_ORDER: { label: "Giao đơn hàng", value: "shippingOrder" },
    COMPLETED: { label: "Hoàn tất", value: "completed" },
    CANCELLED: { label: "Đã hủy", value: "cancelled" },
    FAILED_DELIVERY: { label: "Giao hàng thất bại", value: "failedDelivery" }
});






