// Hàm gọi API chung
export const fetchData = async (api, setter, callback) => {
    try {
        const data = await api();
        setter(data); // Cập nhật state
        if (callback) {
            callback(data); // Truyền dữ liệu vào callback thay vì sử dụng state
        }
    } catch (error) {
        console.log(`Error`, error);
    } finally {
        setLoading(false); // Dừng loading khi lấy dữ liệu xong
    }
};