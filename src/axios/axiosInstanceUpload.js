import axios from 'axios';
import { globalAuthDispatch } from '../context/appContext';
import { AuthActionTypes } from '../reducers';
import { AppAsyncStorage } from '../utils';

export const baseURL = 'https://greenzone.motcaiweb.io.vn/';

const axiosInstanceUpload = axios.create({
  baseURL: baseURL,
});

axiosInstanceUpload.interceptors.request.use(
  async config => {
    const token = await AppAsyncStorage.readData('accessToken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'multipart/form-data';
    return config;
  },
  err => Promise.reject(err),
);

axiosInstanceUpload.interceptors.response.use(
  res => res.data,
  async err => {
    if (err.response?.data?.statusCode === 401) {
      console.log('401 log out');

      const token = await AppAsyncStorage.readData('accessToken');
      
      if (token) { // chưa logout nhưng hết hạn token
        await AppAsyncStorage.removeData(AppAsyncStorage.STORAGE_KEYS.accessToken);
        await AppAsyncStorage.removeData(AppAsyncStorage.STORAGE_KEYS.refreshToken);

        if (globalAuthDispatch) {
          globalAuthDispatch({
            type: AuthActionTypes.LOGIN_SESSION_EXPIRED,
            payload: 'Phiên đăng nhập hết hạn',
          });
        }
      } else { // đã logout và hết hạn token
        if (globalAuthDispatch) {
          globalAuthDispatch({
            type: AuthActionTypes.LOGIN_SESSION_EXPIRED
          });
        }
      }

      return Promise.reject(err.response.data);
    }

    return Promise.reject(err);
  },
);

export default axiosInstanceUpload;
