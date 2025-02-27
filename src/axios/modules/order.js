import axiosInstance from "../axiosInstance";
export const createPickUpOrder = async (body) => {
    try {

        // {
        //     "deliveryMethod": "pickup",
        //     "fulfillmentDateTime": "2025-02-26T22:30:00.000Z",
        //     "note": "Hin ne",
        //     "totalPrice": 74000,
        //     "paymentMethod": "cod",
        //     "shippingAddress": "67bf3c98b5ca3926e3df1a92",
        //     "store": "67b68d7698c1fc822e49fabd",
        //     "owner": "67acbea8145c78765a8f88cd",
        //     "voucher": "67be977856cc7b945d83be06",
        //     "orderItems": [
        //       {
        //         "variant": "67ae040d145c78765a8f8aff",
        //         "quantity": 2,
        //         "price": 42000,
        //         "toppingItems": [
        //           {
        //             "topping": "67aca53c145c78765a8f88b3",
        //             "quantity": 1,
        //             "price": 5000
        //           }
        //         ]
        //       }
        //     ]
        //   }
        const filteredBody = {
            deliveryMethod: body.deliveryMethod,
            fulfillmentDateTime: body.fulfillmentDateTime,
            note: body.note,
            totalPrice: body.totalPrice,
            paymentMethod: body.paymentMethod,
            // shippingAddress: '67bf3c98b5ca3926e3df1a92',
            store: body.store,
            owner: body.owner,
            // voucher: '67be977856cc7b945d83be06',
            orderItems: body.orderItems.map(item => ({
                variant: item.variant,
                quantity: item.quantity,
                price: item.price,
                toppingItems: item.toppingItems.map(t => ({
                    topping: t.topping,
                    quantity: t.quantity,
                    price: t.price
                }))
            }))
        };

        console.log("Sending Request:", JSON.stringify(filteredBody, null, 2));

        const response = await axiosInstance.post("/v1/order/create", body);

        return response;

    } catch (error) {
        console.log("error:", error);
        throw error
    }
};