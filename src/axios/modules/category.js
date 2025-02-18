import axiosInstance from "../axiosInstance";

export const getAllCategoriesAPI = async () => {
    try {
       
        const response = await axiosInstance.get("/v1/category/all");

        // Tách dữ liệu từ response
        const { statusCode, success, data } = response;

        if (success && statusCode === 200) {
            // console.log("all categories = ", data);
            return data; // Trả về dữ liệu OTP để xử lý tiếp
        } else {
            console.log("Failed to get all category, path /v1/category/all");
            return null;
        }
    } catch (error) {
        console.error("getAllCategoriesAPI error path /v1/category/all:", error);
        throw error; // Để nơi gọi có thể xử lý lỗi tiếp
    }
};