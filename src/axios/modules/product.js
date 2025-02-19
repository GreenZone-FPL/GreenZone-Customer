import axiosInstance from "../axiosInstance";

export const getAllProducts = async () => {
    try {

        const response = await axiosInstance.get("/v1/product/all");

        return response.data;
    } catch (error) {
        console.log("error:", error);
    }
}

export const getProductDetailAPI = async (productId) => {
    try {

        const response = await axiosInstance.get(`/v1/product/${productId}`);

        return response.data;
    } catch (error) {
        console.log("error:", error);
    }
}