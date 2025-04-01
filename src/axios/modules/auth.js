import axiosInstance from '../axiosInstance';
import {AppAsyncStorage} from '../../utils';

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/auth/profile');

    return response.data;
  } catch (error) {
    console.log('error:', error); // debug
    throw error;
  }
};

export const register = async ({
  firstName,
  lastName,
  email,
  dateOfBirth,
  gender,
  avatar = null,
}) => {
  try {
    const body = {firstName, lastName, email, dateOfBirth, gender, avatar};

    const response = await axiosInstance.post('/auth/otp/register', body);

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
      AppAsyncStorage.STORAGE_KEYS.userId,
      data.user._id,
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

export const sendOTP = async phoneNumber => {
  try {
    const response = await axiosInstance.post('/auth/otp/send', {phoneNumber});
    console.log('response OTP', JSON.stringify(response, null, 2));
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
      AppAsyncStorage.STORAGE_KEYS.userId,
      data.user._id,
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
