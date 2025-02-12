import axios from 'axios';

const axiosInstance = (token = '', contentType = 'application/json') => {
    const myAxios = axios.create({
        baseURL: "https://greenzone.motcaiweb.io.vn/"
    });
  
    myAxios.interceptors.request.use(
        async (config) => {
           
            config.headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': contentType
            }
            return config;
        },
        err => Promise.reject(err)
    );

    myAxios.interceptors.response.use(
        res => res.data,
        err => Promise.reject(err)
    );
    return myAxios;
};

export default axiosInstance;