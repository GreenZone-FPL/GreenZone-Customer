import axiosInstance from "../axiosInstance";

// Gửi sản phẩm yêu thích
export const postFavoriteProduct = async ({ productId }) => {
    try {
        const response = await axiosInstance.post(`/v1/user/favorite/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error posting favorite product:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteFavoriteProduct = async ({ productId }) => {
    try {
        const response = await axiosInstance.delete(`/v1/user/favorite/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting favorite product:", error.response?.data || error.message);
        throw error;
    }
};


// Lấy danh sách sản phẩm yêu thích
export const getFavoriteProducts = async () => {
    try {
        const response = await axiosInstance.get(`/v1/user/favorite/all`);
        return response.data ?? []; // Đảm bảo luôn trả về mảng
    } catch (error) {
        console.error("Error fetching favorite products:", error);
        return []; // Tránh lỗi khi gọi some()
    }
};




