import axiosInstance from "../axiosInstance";
import { AppAsyncStorage } from "../../utils";

export const registerAPI = async ({ firstName, lastName, email, dateOfBirth, gender, avatar = null }) => {
    try {
        const body = { firstName, lastName, email, dateOfBirth, gender, avatar };

        // Gửi request
        const response = await axiosInstance().post("/auth/otp/register", body);

        // Tách dữ liệu từ response
        const { statusCode, success, data } = response;

        if (success && statusCode === 201) {
            console.log("Register successfully, userId = ", data.user._id);

            // Trích xuất accessToken và refreshToken từ response
            const { accessToken, refreshToken } = data.token;

            // Lưu token vào AsyncStorage
            await AppAsyncStorage.storeData('accessToken', accessToken.token);
            await AppAsyncStorage.storeData('refreshToken', refreshToken.token);

            return data; // Trả về dữ liệu OTP để xử lý tiếp
        } else {
            console.log("Failed to send OTP:", response);
            return null;
        }
    } catch (error) {
        console.error("RegisterAPI Error path /auth/otp/register :", error);
        throw error; // Để nơi gọi có thể xử lý lỗi tiếp
    }
};




export const sendOTPAPI = async ({phoneNumber}) => {
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
        const body = { phoneNumber, code }
        const response = await axiosInstance().post("/auth/otp/login", body);

        const { success, data } = response;
        if (success) {
            console.log("✅ OTP Verified, token = ", data.token);
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



