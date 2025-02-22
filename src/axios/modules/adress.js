import axiosInstance from "../axiosInstance";

export const getProvinces = async () => {
    try {
        const response = await axiosInstance.get("/v1/location/province/all");
        return response.data;
    } catch (error) {
        console.log("error:", error);
        throw error;
    }
};

export const getDistricts = async (provinceId) => {
    try {
        const response = await axiosInstance.get(`/v1/location/province/${provinceId}/district`);
        return response.data.districts;
    } catch (error) {
        console.log("error:", error);
        throw error;
    }
};

export const getWards = async (districtId) => {
    try {
        const response = await axiosInstance.get(`/v1/location/district/${districtId}/ward`);
        return response.data.wards;
    } catch (error) {
        console.log("error:", error);
        throw error;
    }
};
