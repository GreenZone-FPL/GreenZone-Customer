import axiosInstance from "../axiosInstance";

export const getAllToppingsAPI = async () => {
    try {
       
        const response = await axiosInstance().get("/v1/topping/all");

        // Tách dữ liệu từ response
        const { statusCode, success, data } = response;

        if (success && statusCode === 200) {
            // console.log("all toppings = ", data);
            return data; // Trả về dữ liệu OTP để xử lý tiếp
        } else {
            console.log("Failed to get all toppings, path /v1/topping/all");
            return null;
        }
    } catch (error) {
        console.error("getAllToppingsAPI Error path path /v1/topping/all:", error);
        throw error; // Để nơi gọi có thể xử lý lỗi tiếp
    }
}