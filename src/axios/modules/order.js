import axiosInstance from "../axiosInstance";
export const createPickUpOrder = async (body) => {
    try {
        const response = await axiosInstance.post("/v1/order/create", body);

        return response;

    } catch (error) {
        console.log("error:", error);
        throw error
    }
};

export const getOrderHistoryByStatus = async () => {
  try {
    const statuses = [
      'awaitingPayment', // Chờ thanh toán
      'pendingConfirmation', // Chờ xác nhận đơn
      'processing', // Thực hiện đơn
      'readyForPickup',// Đã làm xong đơn, sẵn sàng giao
      'shippingOrder', // Giao đơn hàng
      'completed', // Hoàn tất
      'cancelled',// Đã hủy
      'failedDelivery', // Giao hàng thất bại
    ];
    const requests = statuses.map(status =>
      axiosInstance.get(`v1/order/my-order`, {params: {status}}),
    );

    const responses = await Promise.all(requests);
    return responses.flatMap(response => response.data);
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};
