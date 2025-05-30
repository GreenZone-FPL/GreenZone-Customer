import axiosInstance from '../axiosInstance';

export const chatAssistant = async (input: string = 'Tôi muốn uống ăn bánh') => {
  try {
    const encodedInput = encodeURIComponent(input);
    const response = await axiosInstance.get(`/ai/chat?input=${encodedInput}`);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};
