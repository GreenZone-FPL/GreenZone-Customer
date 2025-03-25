import Geolocation from '@react-native-community/geolocation';
import {DeliveryMethod} from '../constants';
import {cartInitialState} from '../reducers';
import {AppAsyncStorage} from './appAsyncStorage';
import {CartManager} from './cartMananger';

export const LocationManager = {
  // Hàm cập nhật cửa hàng vào giỏ hàng
  updateStore: async (cartState, cartDispatch, sortedMerchants, callback) => {
    if (
      cartState?.deliveryMethod === DeliveryMethod.DELIVERY.value &&
      sortedMerchants.length > 0
    ) {
      const merchant = sortedMerchants[0];
      let cart = await AppAsyncStorage.readData('CART', cartInitialState);

      // Cập nhật thông tin cửa hàng vào giỏ hàng
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
    return null; // Nếu không có cửa hàng phù hợp, trả về null
  },

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

  // Hàm tính khoảng cách giữa hai tọa độ bằng công thức Haversine
  // hàm tính khoảng cách giữa người dùng và cửa hàng

  haversineDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
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

    return (R * c).toFixed(2);
  },

  // Hàm sắp xếp merchants theo khoảng cách
  getNearestMerchant: (merchants, userLocation) => {
    if (!merchants || merchants.length === 0 || !userLocation) return null;

    const [userLongitude, userLatitude] = userLocation;

    const sortedList = merchants
      .map(item => ({
        ...item,
        distance: LocationManager.haversineDistance(
          userLatitude,
          userLongitude,
          item.latitude,
          item.longitude,
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    return sortedList.length > 0 ? sortedList[0] : null;
  },

  // Hàm lấy vị trí người dùng
  getUserLocation: setUserLocation => {
    const timeoutId = setTimeout(() => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setUserLocation([longitude, latitude]);
        },
        error => console.log(error),
        {timeout: 5000},
      );
    }, 1000);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  },
};

export default LocationManager;
