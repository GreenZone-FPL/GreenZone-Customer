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
//lấy danh sách địa chỉ người dùng
export const getUserAddresses = async () => {
    try {
        const response = await axiosInstance.get("/v1/address/my-address");
        return response.data; 
    } catch (error) {
        throw error;
    }
};

//lấy danh sách địa chỉ người dùng theo id
export const getAddressById = async (addressId) => {
    try {
        const { data } = await axiosInstance.get(`/v1/address/${addressId}`);
        return data;
    } catch (error) {
        console.error("Error fetching address by ID:", error.response?.data || error.message);
        throw error;
    }
};

// gửi lên địa chỉ
export const postAddress = async ({ specificAddress, ward, district , province, consigneePhone, consigneeName}) => {
    try {
        const body = {specificAddress, ward, district , province, consigneePhone, consigneeName};
        const response = await axiosInstance.post("/v1/address/create", body);
        const { data } = response;
        return data;

    } catch (error) {
        console.log("error:", error);
        throw error
    }
};

// xóa địa chỉ
export const deleteAddress = async (addressId) => {
    try {
        const { data } = await axiosInstance.delete(`/v1/address/${addressId}`);
        return data;
    } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error.response?.data || error.message);
        throw error;
    }
};

// chỉnh sửa địa chỉ
export const updateAddress = async (addressId, updateData) => {
    try {
        const { data } = await axiosInstance.put(`/v1/address/${addressId}`, updateData);
        return data;
    } catch (error) {
        console.error("Lỗi khi cập nhật địa chỉ:", error.response?.data || error.message);
        throw error;
    }
};

// đặt địa chỉ mặc định
export const setDefaultAddress = async (addressId) => {
    try {
        const { data } = await axiosInstance.patch(
            `/v1/address/${addressId}/set-default`, 
            { isDefault: true }
        );
        return data;
    } catch (error) {
        console.error("Lỗi khi đặt địa chỉ mặc định:", error.response?.data || error.message);
        throw error;
    }
};

