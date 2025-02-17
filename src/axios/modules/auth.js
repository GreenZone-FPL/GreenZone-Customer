import axiosInstance from "../axiosInstance";
import { AppAsyncStorage } from "../../utils";



export const refreshTokenAPI = async () => {
    try {
        const storedRefreshToken = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.refreshToken);
        if (!storedRefreshToken) {
            console.log("Không tìm thấy refreshToken!");
            return null;
        }


        const body = { refreshToken: storedRefreshToken };

        const response = await axiosInstance().post("/auth/refresh", body);

        // Tách dữ liệu từ response
        const { statusCode, success, data } = response;

        if (success && statusCode === 201) {
            console.log("Refresh Successfully new accesstoken = ", data.accessToken.token);
            return data;
        } else {
            console.log("Failed to refresh token:");
            return null;
        }
    } catch (error) {
        console.error("refreshTokenAPI Error path /auth/refresh:", error);
        throw error;
    }
};


export const getProfileAPI = async () => {
    try {

        const response = await axiosInstance().get("/auth/profile");

        // Tách dữ liệu từ response
        const { statusCode, success, data } = response;

        if (success && statusCode === 200) {
            // console.log("getProfileAPI data = ", data);
            return data;
        } else {
            console.log("Failed to get profile, path /auth/profile");
            return null;
        }
    } catch (error) {
        console.error("getProfileAPI error path /auth/profile:", error);
        throw error; // Để nơi gọi có thể xử lý lỗi tiếp
    }
};


export const registerAPI = async ({ firstName, lastName, email, dateOfBirth, gender, avatar = null }) => {
    try {
        const body = { firstName, lastName, email, dateOfBirth, gender, avatar };

        const response = await axiosInstance().post("/auth/otp/register", body);

        const { statusCode, success, data } = response;

        if (success && statusCode === 201) {
            console.log("Register successfully, userId = ", data.user._id);

            const { accessToken, refreshToken } = data.token;

            await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.accessToken, accessToken.token);
            await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.refreshToken, refreshToken.token);

            return data;
        } else {
            console.log("Failed to register:", response);
            return null;
        }
    } catch (error) {
        console.error("RegisterAPI Error path /auth/otp/register :", error);
        throw error;
    }
};




export const sendOTPAPI = async ({ phoneNumber }) => {
    try {

        const body = { phoneNumber }
        const response = await axiosInstance().post("/auth/otp/send", body);

        // Tách dữ liệu từ response
        const { statusCode, success, message, data } = response;

        if (success && statusCode === 201) {
            console.log("OTP Sent Successfully:", message);
            return data; // Trả về dữ liệu OTP để xử lý tiếp
        } else {
            console.log("Failed to send OTP:", message);
            return null;
        }
    } catch (error) {
        console.error("sendOTPAPI Error path /auth/otp/send:", error);
        throw error; // Để nơi gọi có thể xử lý lỗi tiếp
    }
};

export const verifyOTPAPI = async ({ phoneNumber, code }) => {
    try {
        const body = { phoneNumber, code };
        const response = await axiosInstance().post("/auth/otp/login", body);

        const { success, data } = response;
        if (success) {
            console.log("✅ OTP Verified, token = ", data.token);

            // Lưu token vào AsyncStorage
            const accessToken = data.token.accessToken.token;
            const refreshToken = data.token.refreshToken.token;

            await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.accessToken, accessToken);
            await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.refreshToken, refreshToken);

            return response;
        } else {
            console.log("❌ OTP Verification Failed:");
            return null;
        }
    } catch (error) {
        console.error("Error verifying OTP path /auth/otp/login:", error);
        throw error;
    }
};




