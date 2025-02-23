import axios from 'axios';
import { globalAuthDispatch } from '../context/appContext';
import { AuthActionTypes } from '../reducers';
import { AppAsyncStorage } from '../utils';
export const baseURL = "https://greenzone.motcaiweb.io.vn/"

const axiosInstance = axios.create({
    baseURL: baseURL
});

axiosInstance.interceptors.request.use(
    async (config) => {
        // Lấy token từ AsyncStorage 
        const token = await AppAsyncStorage.readData('accessToken');
        // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlVG9rZW4iOiJhY2Nlc3NUb2tlbiIsInBob25lTnVtYmVyIjoiMDg2ODQ0MTI3MyIsImlhdCI6MTczOTk0NTgxMiwiZXhwIjoxNzM5OTQ1ODcyfQ.dJLwZHrHc-swD0ZwBiJWmUq0CIACK8tdLjwnbhL0j2A'

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Thêm token vào header
        }

        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    err => Promise.reject(err)
);


axiosInstance.interceptors.response.use(
    res => res.data,
    async (err) => {
        if (err.response.data.statusCode === 401) {
            console.log('401 log out');

            // Xóa token khỏi AsyncStorage
            await AppAsyncStorage.removeData(AppAsyncStorage.STORAGE_KEYS.accessToken);
            await AppAsyncStorage.removeData(AppAsyncStorage.STORAGE_KEYS.refreshToken);

            if (globalAuthDispatch) {
                globalAuthDispatch({ type: AuthActionTypes.LOGIN_SESSION_EXPIRED });
            }
            return Promise.reject(err.response.data);
        }

        return Promise.reject(err);
    }
);




export default axiosInstance;
