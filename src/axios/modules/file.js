import axiosInstance from "../axiosInstance";

// export const uploadFileAPI = async (file) => {
//     try {
//         if (!file) {
//             console.error("uploadFile: No file provided");
//             return null;
//         }

//         const formData = new FormData();
//         formData.append("file", file);

//         // Vì axiosInstance mặc định gửi JSON, nên cần tạo instance mới cho multipart/form-data
//         const response = await axiosInstance("multipart/form-data")
//             .post("/file/image/upload", formData);

//         const { statusCode, success, message, data } = response;

//         if (success && statusCode === 201) {
//             // console.log("uploadFile successfully, image url = ", data.url);
//             return data;
//         } else {
//             console.log("Failed to send OTP:", response);
//             return null;
//         }
//     } catch (error) {
//         console.error("uploadFile API Error path /file/image/upload :", error);
//         throw error;
//     }
// };