import axiosInstance from '../axiosInstance';

export const getAllMerchants = async () => {
  try {
    const response = await axiosInstance.get('/v1/store/all');
    return response.data;
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};
