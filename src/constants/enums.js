export const DeliveryMethod = Object.freeze({
    PICK_UP: "pickup",
    DELIVERY: "delivery"
})


export const PaymentMethod = Object.freeze({
    ONLINE: "online",
    COD: "cod"
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




