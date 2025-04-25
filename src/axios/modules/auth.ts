import axiosInstance from '../axiosInstance';
import {AppAsyncStorage} from '../../utils';
import {RegisterRequest} from '../../type-interface/register';

export const getProfile = async (): Promise<void> => {
  try {
    const response = await axiosInstance.get('/auth/profile');

    return response.data;
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

export const register = async (request: RegisterRequest) => {
  try {
    const response = await axiosInstance.post('/auth/otp/register', request);

    const {data} = response;


    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.accessToken,
      data.token.accessToken.token,
    );
    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.refreshToken,
      data.token.refreshToken.token,
    );

    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.user,
      data.user,
    );

    return data;
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

export const sendOTP = async (phoneNumber: string): Promise<void> => {
  try {
    const response = await axiosInstance.post('/auth/otp/send', {phoneNumber});
    return response.data;
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

export const verifyOTP = async ({phoneNumber, code}) => {
  try {
    const response = await axiosInstance.post('/auth/otp/login', {
      phoneNumber,
      code,
    });
    const {data} = response;


    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.accessToken,
      data.token.accessToken.token,
    );
    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.refreshToken,
      data.token.refreshToken.token,
    );

    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.user,
      data.user,
    );

    return data;
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};
