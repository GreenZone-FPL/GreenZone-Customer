import axiosInstance from '../axiosInstance';

export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get('/v1/category/all');

    return response.data;
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};
