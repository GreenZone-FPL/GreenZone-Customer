import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fetchUserLocation} from './geoLocationUtils';
import {AppAsyncStorage} from './appAsyncStorage';
import LocationManager from './locationManager';
import {getAllMerchants} from '../axios/modules/merchant';
import {CartManager} from './cartMananger';
import {useAppContext} from '../context/appContext';

const CallSaveLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [merchants, setMerchants] = useState([]);
  const {cartDispatch} = useAppContext();

  // hàm gọi api merchants
  const fetchMerchants = async () => {
    try {
      const data = await getAllMerchants();
      setMerchants(data.docs);
    } catch (error) {
      console.log('Error fetching merchants:', error);
    }
  };

  // Lấy vị trí hiện tại của customer và lưu vào AsyncStorage - lưu vào cartStable
  useEffect(() => {
    const getLocationAndSave = async () => {
      setLoading(true); // Bắt đầu quá trình lấy vị trí
      const location = await fetchUserLocation(setCurrentLocation, setLoading);
      if (location) {
        await AppAsyncStorage.storeData(
          AppAsyncStorage.STORAGE_KEYS.currentLocation,
          {
            location: location.title,
            latitude: location.position.lat.toString(),
            longitude: location.position.lng.toString(),
          },
        );
        if (cartDispatch) {
          await CartManager.updateOrderInfo(cartDispatch, {
            shippingAddressInfo: {
              location: location.title,
              latitude: location.position.lat.toString(),
              longitude: location.position.lng.toString(),
            },
          });
        }
      }

      setLoading(false);
    };
    fetchMerchants();
    getLocationAndSave();
  }, []);

  // hàm tự động lưu địa chỉ cửa hàng gần nhất vào AsynStorage và cập nhập vào cartStable
  useEffect(() => {
    const getNearestStore = async () => {
      try {
        if (!currentLocation || !merchants || merchants.length === 0) {
          return;
        }

        const userLocation = [
          currentLocation.position.lng,
          currentLocation.position.lat,
        ];

        const nearest = await LocationManager.getNearestMerchant(
          merchants,
          userLocation,
        );
        if (nearest) {
          await AppAsyncStorage.storeData(
            AppAsyncStorage.STORAGE_KEYS.merchantLocation,
            {
              _id: nearest._id,
              name: nearest.name,
              storeAddress: `${nearest.specificAddress},${nearest.ward}, ${nearest.district}, ${nearest.province}`,
              latitude: nearest.latitude.toString(),
              longitude: nearest.longitude.toString(),
            },
          );
          await CartManager.updateOrderInfo(cartDispatch, {
            store: nearest._id,
            storeInfo: {
              storeName: nearest.name,
              storeAddress: `${nearest.specificAddress}, ${nearest.ward}, ${nearest.district}, ${nearest.province}`,
            },
          });
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    getNearestStore();
  }, [merchants, currentLocation]);

  return;
};

export default CallSaveLocation;
