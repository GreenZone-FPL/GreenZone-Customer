export const DeliveryMethod = Object.freeze({
    PICK_UP: { label: "Nhận tại cửa hàng", value: "pickup" },
    DELIVERY: { label: "Giao hàng tận nơi", value: "delivery" }
});



export const PaymentMethod = Object.freeze({
    ONLINE: { label: "online", value: "online" },
    COD: { label: "cod", value: "cod" }
})

export const OrderStatus = Object.freeze({
    AWAITING_PAYMENT: 'awaitingPayment',
    PENDING_CONFIRMATION: 'pendingConfirmation',
    PROCESSING: 'processing',
    READY_FOR_PICKUP: 'readyForPickup',
    SHIPPING_ORDER: 'shippingOrder',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled', // Giao hàng thất bại
});




