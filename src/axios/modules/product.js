import axiosInstance from "../axiosInstance";

export const getAllProducts = async () => {
    try {

        const response = await axiosInstance.get("/v1/product/all");

        return response.data;
    } catch (error) {
        console.log("error:", error);
        throw error
    }
}

export const getProductDetail = async (productId) => {
    try {

       
        const response = await axiosInstance.get(`/v1/product/${productId}`);
        console.log("call API get detail");
        return response.data;
    } catch (error) {
        console.log("error:", error);
        throw error
    }
}