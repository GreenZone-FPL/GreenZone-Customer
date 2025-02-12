import axiosInstance from "../index";

export const sendOTPApi = async (request) => {
    try {
        const { phoneNumber } = request
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
        if (error.response) {
            console.log("Server Error:", error.response.data);
        } else if (error.request) {
            console.log("No response received:", error.request);
        } else {
            console.log("Request setup error:", error.message);
        }
        throw error; // Để nơi gọi có thể xử lý lỗi tiếp
    }
};

export const verifyOTPApi = async (request) => {
    try {

        const { phoneNumber, code } = request
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
        console.error("Error verifying OTP:", error);
        throw error;
    }
};



