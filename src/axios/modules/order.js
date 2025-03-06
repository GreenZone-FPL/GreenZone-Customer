import { OrderStatus } from "../../constants";
import axiosInstance from "../axiosInstance";
export const createOrder = async (body) => {
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
    // Lấy tất cả trạng thái đơn hàng
    const statuses = Object.values(OrderStatus).map(status => status.value);

    // Lấy dữ liệu đơn hàng theo từng trạng thái
    const responses = await Promise.all(
      statuses.map(status =>
        axiosInstance
          .get(`/v1/order/my-order`, {params: {status}})
          .then(response => ({status, data: response.data}))
          .catch(error => ({status, data: [], error})),
      ),
    );

    // Lấy danh sách đơn hàng từ các responses
    const orders = responses.flatMap(response => response.data);

    return orders;
  } catch (error) {
    console.error(
      'Lỗi khi lấy lịch sử đơn hàng:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};

export const getOrderDetail = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/v1/order/${orderId}`);
    console.log('Chi tiết đơn hàng >>>>>>>>>>>>>>:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error.response?.data || error.message);
    throw error;
  }
}

