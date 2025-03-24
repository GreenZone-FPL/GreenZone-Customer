import Geolocation from '@react-native-community/geolocation';
import {DeliveryMethod} from '../constants';
import {cartInitialState} from '../reducers';
import {AppAsyncStorage} from './appAsyncStorage';
import {CartManager} from './cartMananger';

export const LocationManager2 = {
  // Hàm tính khoảng cách giữa hai tọa độ bằng công thức Haversine
  haversineDistance: (userLocation, storeLocation) => {
    if (!userLocation || !storeLocation) {
      return null; // Vị trí không hợp lệ
    }

    const [lon1, lat1] = userLocation;
    const [lon2, lat2] = storeLocation;

    const R = 6371; // Bán kính Trái Đất (km)
    const toRad = angle => (angle * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Number((R * c).toFixed(2)); // Trả về khoảng cách (km)
  },

  // Hàm cập nhật cửa hàng vào giỏ hàng
  updateStore: async (cartState, cartDispatch, sortedMerchants, callback) => {
    if (
      cartState?.deliveryMethod === DeliveryMethod.DELIVERY.value &&
      sortedMerchants.length > 0
    ) {
      const merchant = sortedMerchants[0];

      let cart = await AppAsyncStorage.readData('CART', cartInitialState);

      // cập nhật
      cart = {
        ...cart,
        store: merchant._id,
        storeInfo: {
          storeName: merchant.name,
          storeAddress: `${merchant.specificAddress} ${merchant.ward} ${merchant.district} ${merchant.province}`,
        },
      };

      if (callback) callback(cart);
      return cart;
    }
  },

  // Hàm sắp xếp merchants theo khoảng cách
  getNearestMerchant: (merchants, userLocation) => {
    if (!merchants || merchants.length === 0 || !userLocation) return null;

    const sortedList = merchants
      .map(item => ({
        ...item,
        distance: LocationManager2.haversineDistance(userLocation, [
          item.longitude,
          item.latitude,
        ]),
      }))
      .sort((a, b) => a.distance - b.distance);

    return sortedList[0]; // Trả về cửa hàng gần nhất
  },

  // Lấy vị trí người dùng
  getLocationUse: async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          resolve([longitude, latitude]); // Trả về vị trí dưới dạng mảng [longitude, latitude]
        },
        error => reject(error),
        {timeout: 5000, enableHighAccuracy: true},
      );
    });
  },
};

//   LocationManager.updateStore(async (cart) => {
//     if (cartDispatch) {
//       await CartManager.updateOrderInfo(cartDispatch, {
//        cart
//       });
//     }
//   });

//   const myUpdateCart = async (cart) => {
//     if (cartDispatch) {
//       await CartManager.updateOrderInfo(cartDispatch, {
//        cart
//       });
//     }

/// lay  list cua hang va sort, tra ve cua hang gan nhat {}.
