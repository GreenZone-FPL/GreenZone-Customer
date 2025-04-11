import axiosInstance from "../axiosInstance";

export const getNotifications = async () => {
    try {

        const response = await axiosInstance.get("/v1/notification/my-notification");

        return response.data;
    } catch (error) {
        console.log("error:", error);
        throw error
    }
}