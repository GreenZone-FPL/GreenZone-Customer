import axiosInstance from "../axiosInstance";

export const getAllProductsAPI = async () => {
    try {
       
        const response = await axiosInstance().get("/v1/product/all");

        // Tách dữ liệu từ response
        const { statusCode, success, data } = response;

        if (success && statusCode === 200) {
            // console.log("getAllProducts data = ", data);
            return data; // Trả về dữ liệu OTP để xử lý tiếp
        } else {
            console.log("Failed to get all products, path /v1/product/all");
            return null;
        }
    } catch (error) {
        if (error.response) {
            console.log("Server Error:", error.response.data);
        } else if (error.request) {
            console.log("No response received:", error.request);
        } else {
            console.log("Request setup error:", error.message);
        }
        throw error; // Để nơi gọi có thể xử lý lỗi tiếp
    }
}

export const getProductDetailAPI = async (productId) => {
    try {
       
        const response = await axiosInstance().get(`/v1/product/${productId}`);

        // Tách dữ liệu từ response
        const { statusCode, success, data } = response;

        if (success && statusCode === 200) {
            console.log("getProductDetailAPI data = ", data);
            return data; // Trả về dữ liệu OTP để xử lý tiếp
        } else {
            console.log("Failed to get all products, path /v1/product/${productId}");
            return null;
        }
    } catch (error) {
        if (error.response) {
            console.log("Server Error:", error.response.data);
        } else if (error.request) {
            console.log("No response received:", error.request);
        } else {
            console.log("Request setup error:", error.message);
        }
        throw error; // Để nơi gọi có thể xử lý lỗi tiếp
    }
}