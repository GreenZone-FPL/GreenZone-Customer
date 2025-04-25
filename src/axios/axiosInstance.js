import axios from 'axios';

import { globalAuthDispatch } from '../context';
import { AuthActionTypes } from '../reducers';
import { AppAsyncStorage } from '../utils';

export const baseURL = 'https://greenzone.motcaiweb.io.vn/';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  async config => {
    // Lấy token từ AsyncStorage
    const token = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.accessToken);


    // Nếu token hợp lệ, thêm vào headers
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';

    return config;
  },
  err => Promise.reject(err),
);


axiosInstance.interceptors.response.use(
  res => res.data,
  async err => {
    if (err.response.data.statusCode === 401) {
      console.log('401 log out');

      const token = await AppAsyncStorage.readData('accessToken');
      console.log('token', token);
      if (token) {
        // chưa logout nhưng hết hạn token
        // Xóa token khỏi AsyncStorage
        await AppAsyncStorage.removeData(
          AppAsyncStorage.STORAGE_KEYS.accessToken,
        );
        await AppAsyncStorage.removeData(
          AppAsyncStorage.STORAGE_KEYS.refreshToken,
        );

        if (globalAuthDispatch) {
          globalAuthDispatch({
            type: AuthActionTypes.LOGIN_SESSION_EXPIRED,
            payload: { message: 'Phiên đăng nhập hết hạn', needLogin: true,  needAuthen: true, },
          });
        }
      } else {
        // đã logout và hết hạn token
        if (globalAuthDispatch) {
          globalAuthDispatch({
            type: AuthActionTypes.LOGIN_SESSION_EXPIRED,
            payload: { needLogin: true,  needAuthen: true, },
          });
        }
      }

      return Promise.reject(err.response.data);
    }

    return Promise.reject(err);
  },
);

export default axiosInstance;
