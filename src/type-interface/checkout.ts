export interface TimeInfo {
    selectedDay: string,
    selectedTime: string,
    fulfillmentDateTime: string
}

export interface PaymentMethodItem {
    label: string;
    image: any;
    value: string;
    paymentMethod: string;
    disabled?: boolean
}

export interface UserInfo {
    name: string;
    phoneNumber: string;
}