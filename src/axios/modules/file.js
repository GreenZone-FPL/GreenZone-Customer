import axiosInstanceUpload from "../axiosInstanceUpload";

export const uploadFile = async (file) => {
    try {
        if (!file) {
            console.error("uploadFile: No file provided");
            return null;
        }

        const formData = new FormData();
        formData.append("file", file);

        // Vì axiosInstance mặc định gửi JSON, nên cần tạo instance mới cho multipart/form-data
        const response = await axiosInstanceUpload
            .post("/file/image/upload", formData);

        return response.data
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
};