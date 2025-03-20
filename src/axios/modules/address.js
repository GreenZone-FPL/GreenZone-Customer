import axiosInstance from "../axiosInstance";


export const getAddresses = async () => {
    try {
        const response = await axiosInstance.get('v1/address/my-address');
        console.log('API Response:', response.data); // Log phản hồi đầy đủ
        return response.data;
    } catch (error) {
        console.log('error:', error);
        throw error;
    }
};


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
export const postAddress = async ({ specificAddress, ward, district , province, consigneePhone, consigneeName, latitude, longitude}) => {
    try {
        const body = {specificAddress, ward, district , province, consigneePhone, consigneeName, latitude, longitude};
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

// Cập nhật địa chỉ theo ID
export const updateAddress = async (addressId, addressData) => {
    try {
        const response = await axiosInstance.put(`/v1/address/${addressId}`, addressData);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật địa chỉ:", error.response?.data || error.message);
        throw error;
    }
};



// đặt địa chỉ mặc định
export const setDefaultAddress = async (addressId) => {
    try {
        const response = await axiosInstance.patch(`/v1/address/${addressId}/set-default`, {
            isDefault: true, // API yêu cầu tham số này
        });

        const data = response?.data || {}; // Đảm bảo không bị null

        if (data.success) {
            return { success: true, message: data.message || "Đã đặt địa chỉ mặc định thành công." };
        } else {
            return { success: false, message: data.message || "Không thể đặt địa chỉ mặc định." };
        }
    } catch (error) {
        console.error('❌ Lỗi khi đặt địa chỉ mặc định:', error?.response?.data || error.message);
        return { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' };
    }
};




