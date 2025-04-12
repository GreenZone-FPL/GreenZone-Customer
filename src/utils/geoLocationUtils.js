import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
const API_KEY = 'Q9zv9fPQ8xwTBc2UqcUkP32bXAR1_ZA-8wLk7tjgRWo';
const REVERSE_GEOCODE_URL =
  'https://revgeocode.search.hereapi.com/v1/revgeocode';

/**
 * Hàm lấy địa chỉ từ tọa độ (lat, long)
 * @param {number} lat - Vĩ độ
 * @param {number} long - Kinh độ
 * @returns {Promise<object|null>} - Địa chỉ hoặc null nếu thất bại
 */
const reverseGeocode = async (lat, long) => {
  try {
    const {data} = await axios.get(
      `${REVERSE_GEOCODE_URL}?at=${lat},${long}&lang=vi-VI&apikey=${API_KEY}`,
    );
    return data?.items?.[0] || null; // Trả về địa chỉ đầu tiên hoặc null nếu không có
  } catch (error) {
    console.log('Lỗi khi lấy địa chỉ:', error);
    return null;
  }
};

/**
 * Hàm lấy vị trí hiện tại và trả về địa chỉ
 * @returns {Promise<object|null>} - Địa chỉ hoặc null nếu thất bại
 */
const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async ({coords}) =>
        coords
          ? resolve(await reverseGeocode(coords.latitude, coords.longitude))
          : reject('Không thể lấy tọa độ.'),
      reject,
      {timeout: 5000},
    );
  });

/**
 * Lấy vị trí hiện tại, gọi API reverse geocode, và cập nhật state
 * @param {Function} setCurrentLocation - Hàm cập nhật state vị trí
 * @param {Function} setLoading - Hàm cập nhật state loading
 */
const fetchUserLocation = async (setCurrentLocation, setLoading) => {
  setLoading(true);

  try {
    // await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1s

    const location = await getCurrentLocation();

    if (location) setCurrentLocation(location);

    return location;
  } catch (error) {
    console.log('Lỗi khi lấy vị trí:', error);
  } finally {
    setLoading(false);
  }
};

export {fetchUserLocation, getCurrentLocation, reverseGeocode};
