import { AppAsyncStorage } from '../../utils';
import axiosInstance from '../axiosInstance';

// Gửi sản phẩm yêu thích
export const postFavoriteProduct = async ({ productId }) => {
  try {
    const response = await axiosInstance.post(`/v1/user/favorite/${productId}`);
    return response.data;
  } catch (error) {
    console.error(
      'Error posting favorite product:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteFavoriteProduct = async ({ productId }) => {
  try {
    const response = await axiosInstance.delete(
      `/v1/user/favorite/${productId}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error deleting favorite product:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Lấy danh sách sản phẩm yêu thích
export const getFavoriteProducts = async () => {
  try {
    const response = await axiosInstance.get(`/v1/user/favorite/all`);
    return response.data ?? []; // Đảm bảo luôn trả về mảng
  } catch (error) {
    console.error('Error fetching favorite products:', error);
    return []; // Tránh lỗi khi gọi some()
  }
};


export const updateUserProfile = async profileData => {
  try {
    const response = await axiosInstance.put(`/v1/user/profile`, profileData);
    await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.lastName, response.data.lastName)
    return response.data;
  } catch (error) {
    console.log('Error', error);
    throw error
  }
};

// doi bean
export const changeBeans = async voucherId => {
  try {
    const response = await axiosInstance.post(`/v1/user/exchange/${voucherId}`);
    if (response.statusCode === 201) {
      return true;
    }
    return false;
  } catch (error) {
    console.log('Đổi bean thất bại:', error);
    
    throw error
  }
};

// my voucher
export const getMyVouchers = async () => {
  try {
    const response = await axiosInstance.get(`v1/user/my-voucher`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.log('error', error);
    return false;
  }
};
