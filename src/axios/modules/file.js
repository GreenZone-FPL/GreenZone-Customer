import axiosInstanceUpload from "../axiosInstanceUpload";

export const uploadFile = async (fileUri) => {
    try {
        if (!fileUri) {
            console.error("uploadFile: No file provided");
            return null;
        }

        const fileName = fileUri.split('/').pop();
        const fileType = fileName.split('.').pop();

        const formData = new FormData();
        formData.append("file", {
            uri: fileUri,
            type: `image/${fileType}`,  // Định dạng ảnh (image/png, image/jpeg, ...)
            name: fileName,
        });

        const response = await axiosInstanceUpload.post("/file/image/upload", formData);
        return `https://greenzone.motcaiweb.io.vn${response.data.url}`; // Trả về đường dẫn ảnh từ API

    
    } catch (error) {
        console.error("Error uploading file:", error.response?.data || error);
        throw error;
    }
};