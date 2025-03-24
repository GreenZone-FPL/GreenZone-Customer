import React, {useState, useEffect, useCallback, useRef} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {getAllMerchants} from '../axios/modules/merchant';
import {CartManager} from './cartMananger';
import {useAppContext} from '../context/appContext';
import {DeliveryMethod} from '../constants';
import {AppAsyncStorage} from './appAsyncStorage';

export const LocationManager = ({cartState}) => {
  const [merchants, setMerchants] = useState([]);
  const [sortedMerchants, setSortedMerchants] = useState([]);
  const [userLocation, setUserLocation] = useState([null, null]);
  const cameraRef = useRef(null);
  const {cartDispatch} = useAppContext();

  // Hàm tính khoảng cách giữa người dùng và cửa hàng
  const haversineDistance = (lat, lon) => {
    if (!userLocation || userLocation[0] === null || userLocation[1] === null) {
      return null; // Vị trí người dùng không hợp lệ
    }

    const R = 6371; // Bán kính trái đất (km)
    const toRad = angle => (angle * Math.PI) / 180;

    const lat1 = userLocation[1];
    const lon1 = userLocation[0];
    const dLat = toRad(lat - lat1);
    const dLon = toRad(lon - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(2); // Trả về khoảng cách tính bằng km
  };

  // Hàm cập nhật cửa hàng vào giỏ hàng
  const updateStore = useCallback(async () => {
    if (
      cartState?.deliveryMethod === DeliveryMethod.DELIVERY.value &&
      sortedMerchants.length > 0
    ) {
      const merchant = sortedMerchants[0];

      // Đọc dữ liệu giỏ hàng từ AsyncStorage
      let cart = await AppAsyncStorage.readData('CART', {});

      // Kiểm tra nếu giỏ hàng đã có thông tin cửa hàng, nếu không thì cập nhật
      if (!cart.store || !cart.storeInfo) {
        cart = {
          ...cart,
          store: merchant._id,
          storeInfo: {
            storeName: merchant.name,
            storeAddress: `${merchant.specificAddress} ${merchant.ward} ${merchant.district} ${merchant.province}`,
          },
        };

        // Lưu lại giỏ hàng đã cập nhật vào AsyncStorage
        await AppAsyncStorage.storeData('CART', cart);

        // Cập nhật thông tin cửa hàng vào giỏ hàng thông qua CartManager
        if (cartDispatch) {
          CartManager.updateOrderInfo(cartDispatch, {
            store: merchant._id,
            storeInfo: cart.storeInfo,
          });
        }
      }
    }
  }, [sortedMerchants, cartState, cartDispatch]);

  // Hàm sắp xếp merchants theo khoảng cách
  const sortMerchant = () => {
    if (!merchants || merchants.length === 0) return;

    const sortedList = merchants
      .map(item => ({
        ...item,
        distance: haversineDistance(item.latitude, item.longitude),
      }))
      .sort((a, b) => a.distance - b.distance);

    setSortedMerchants(sortedList);
  };

  // Gọi API để lấy merchants
  const fetchMerchants = async () => {
    try {
      const data = await getAllMerchants();
      setMerchants(data.docs); // Cập nhật merchants
    } catch (error) {
      console.log('Error fetching merchants:', error);
    }
  };

  // Lấy vị trí người dùng
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setUserLocation([longitude, latitude]);
          if (cameraRef.current) {
            cameraRef.current.setCamera({
              centerCoordinate: [longitude, latitude],
              zoomLevel: 14,
              animationDuration: 1000,
            });
          }
        },
        error => console.log(error),
        {timeout: 5000},
      );
    }, 1000);

    // Cleanup geolocation timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  // Sắp xếp lại merchants khi merchants hoặc userLocation thay đổi
  useEffect(() => {
    if (
      merchants.length > 0 &&
      userLocation[0] !== null &&
      userLocation[1] !== null
    ) {
      sortMerchant();
    }
  }, [merchants, userLocation]);

  // Gọi merchants và lấy vị trí người dùng khi component mount
  useEffect(() => {
    fetchMerchants();
  }, []);

  // Gọi hàm updateStore nếu phương thức giao hàng là delivery
  useEffect(() => {
    const updateCart = async () => {
      // if (
      //   cartState?.deliveryMethod === DeliveryMethod.DELIVERY.value &&
      //   sortedMerchants.length > 0
      // ) {
      await updateStore(); // Gọi updateStore khi merchants đã được sắp xếp
      // }
    };

    // Wait for sorting before updating store
    updateCart();
  }, [cartState?.deliveryMethod, sortedMerchants]);

  return null;
};

// export const LocationManager = ({ cartState }) => {
//   const [merchants, setMerchants] = useState([]);
//   const [sortedMerchants, setSortedMerchants] = useState([]);
//   const [userLocation, setUserLocation] = useState([null, null]);
//   const cameraRef = useRef(null);
//   const { cartDispatch } = useAppContext();

//   // Hàm tính khoảng cách giữa người dùng và cửa hàng
//   const haversineDistance = (lat, lon) => {
//     if (!userLocation || userLocation[0] === null || userLocation[1] === null) {
//       return null; // Vị trí người dùng không hợp lệ
//     }

//     const R = 6371; // Bán kính trái đất (km)
//     const toRad = angle => (angle * Math.PI) / 180;

//     const lat1 = userLocation[1];
//     const lon1 = userLocation[0];
//     const dLat = toRad(lat - lat1);
//     const dLon = toRad(lon - lon1);

//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(toRad(lat1)) *
//         Math.cos(toRad(lat)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return (R * c).toFixed(2); // Trả về khoảng cách tính bằng km
//   };

//   // Hàm sắp xếp merchants theo khoảng cách
//   const sortMerchant = () => {
//     if (!merchants || merchants.length === 0) return;

//     const sortedList = merchants
//       .map(item => ({
//         ...item,
//         distance: haversineDistance(item.latitude, item.longitude),
//       }))
//       .sort((a, b) => a.distance - b.distance);

//     setSortedMerchants(sortedList);
//   };

//   // Hàm cập nhật cửa hàng vào giỏ hàng
//   const updateStore = useCallback(async () => {
//     if (
//       cartState?.deliveryMethod === DeliveryMethod.DELIVERY.value &&
//       sortedMerchants.length > 0
//     ) {
//       const merchant = sortedMerchants[0];

//       // Đọc dữ liệu giỏ hàng từ AsyncStorage
//       let cart = await AppAsyncStorage.readData('CART', {});

//       // Kiểm tra nếu giỏ hàng đã có thông tin cửa hàng, nếu không thì cập nhật
//       if (!cart.store || !cart.storeInfo) {
//         cart = {
//           ...cart,
//           store: merchant._id,
//           storeInfo: {
//             storeName: merchant.name,
//             storeAddress: `${merchant.specificAddress} ${merchant.ward} ${merchant.district} ${merchant.province}`,
//           },
//         };

//         // Lưu lại giỏ hàng đã cập nhật vào AsyncStorage
//         await AppAsyncStorage.storeData('CART', cart);

//         // Cập nhật thông tin cửa hàng vào giỏ hàng thông qua CartManager
//         if (cartDispatch) {
//           CartManager.updateOrderInfo(cartDispatch, {
//             store: merchant._id,
//             storeInfo: cart.storeInfo,
//           });
//         }
//       }
//     }
//   }, [sortedMerchants, cartState, cartDispatch]);

//   // Gọi API để lấy merchants
//   const fetchMerchants = async () => {
//     try {
//       const data = await getAllMerchants();
//       setMerchants(data.docs); // Cập nhật merchants
//     } catch (error) {
//       console.log('Error fetching merchants:', error);
//     }
//   };

//   // Lấy vị trí người dùng
//   const fetchUserLocation = async () => {
//     return new Promise((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         position => {
//           const { latitude, longitude } = position.coords;
//           setUserLocation([longitude, latitude]);
//           if (cameraRef.current) {
//             cameraRef.current.setCamera({
//               centerCoordinate: [longitude, latitude],
//               zoomLevel: 14,
//               animationDuration: 1000,
//             });
//           }
//           resolve([longitude, latitude]);
//         },
//         error => reject(error),
//         { timeout: 5000 }
//       );
//     });
//   };

//   // Quản lý hàm bất đồng bộ (fetch, sort, update store)
//   const handleAsyncOperations = async () => {
//     try {
//       // 1. Fetch merchants
//       await fetchMerchants();

//       // 2. Fetch user location
//       await fetchUserLocation();

//       // 3. Sort merchants after location is available
//       sortMerchant();

//       // 4. Update store if delivery method is selected
//       await updateStore();
//     } catch (error) {
//       console.log('Error handling async operations:', error);
//     }
//   };

//   useEffect(() => {
//     handleAsyncOperations();
//   }, [cartState?.deliveryMethod]);

//   return null;
// };
