import axiosInstance from '../axiosInstance';

export const getAllVoucher = async () => {
  try {
    const response = await axiosInstance.get('/v1/voucher/all', {
      params: {
        status: 'active',
      },
    });
    return response.data;
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};
