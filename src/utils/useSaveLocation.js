import {useEffect, useState} from 'react';
import {fetchUserLocation} from './geoLocationUtils';
import {AppAsyncStorage} from './appAsyncStorage';
import LocationManager from './locationManager';
import {getAllMerchants} from '../axios/modules/merchant';
import {CartManager} from './cartMananger';
import {useAppContext} from '../context/appContext';

const useSaveLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [merchants, setMerchants] = useState([]);
  const {cartDispatch, cartState} = useAppContext();

  // Lấy danh sách merchants
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const data = await getAllMerchants();
        setMerchants(data.docs);
      } catch (error) {
        console.log('Error fetching merchants:', error);
      }
    };
    fetchMerchants();
  }, []);

  // Lấy vị trí user
  useEffect(() => {
    const getLocationAndSave = async () => {
      try {
        setLoading(true);
        const location = await fetchUserLocation(
          setCurrentLocation,
          setLoading,
        );

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
      } catch (error) {
        console.log('Error fetching location:', error);
      }
    };

    getLocationAndSave();
  }, []);

  // Lưu địa chỉ cửa hàng gần nhất
  useEffect(() => {
    const getNearestStore = async () => {
      if (!currentLocation?.position || merchants.length === 0) return;

      try {
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
              storeAddress: `${nearest.specificAddress}, ${nearest.ward}, ${nearest.district}, ${nearest.province}`,
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
            storeSelect: nearest._id,
            storeInfoSelect: {
              storeName: nearest.name,
              storeAddress: `${nearest.specificAddress}, ${nearest.ward}, ${nearest.district}, ${nearest.province}`,
            },
          });
        }
      } catch (error) {
        console.log('Error finding nearest store:', error);
      }
    };

    if (currentLocation && merchants.length > 0) {
      getNearestStore();
    }
  }, [merchants, currentLocation]);

  return null;
};

export default useSaveLocation;
