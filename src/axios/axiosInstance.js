import axios from 'axios';
import { AppAsyncStorage } from '../utils';

const axiosInstance = (contentType = 'application/json') => {
    const appAxios = axios.create({
        baseURL: "https://greenzone.motcaiweb.io.vn/"
    });

    appAxios.interceptors.request.use(
        async (config) => {
            // Lấy token từ AsyncStorage 
            const token = await AppAsyncStorage.readData('accessToken');
            
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`; // Thêm token vào header
            }

            config.headers['Accept'] = 'application/json';
            config.headers['Content-Type'] = contentType;
            return config;
        },
        err => Promise.reject(err)
    );

    appAxios.interceptors.response.use(
        res => res.data,
        err => {
          
            if (err.response) {
                // Lỗi từ server
                console.log("Server Error:", err.response.data);
                return Promise.reject(err.response.data);
            } else if (err.request) {
                // Không nhận được phản hồi từ server
                console.log("No response received:", err.request);
                return Promise.reject("No response received");
            } else {
                // Lỗi trong cấu hình request
                console.log("Request setup error:", err.message);
                return Promise.reject(err.message);
            }
        }
    );

    return appAxios;
};

export default axiosInstance;
