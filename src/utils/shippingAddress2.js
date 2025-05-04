import {useEffect} from 'react';
import {getAllMerchants} from '../axios/modules/merchant';
import {useCartContext} from '../context';
import {AppAsyncStorage} from './appAsyncStorage';
import {CartManager} from './cartMananger';
import {fetchUserLocation} from './geoLocationUtils';
import LocationManager from './locationManager';
import {Toaster} from './toaster';

export const shippingAddress2 = () => {
  const {cartDispatch, cartState} = useCartContext();

  useEffect(() => {
    const run = async () => {
      try {
        console.log('run useLocation');
        // Step 1: Lấy danh sách merchant
        const merchantRes = await getAllMerchants();
        const merchants = merchantRes.docs;
        // console.log('merchants', JSON.stringify(merchants, null, 3))

        // Step 2: Lấy shiping

        const lat = cartState.shippingAddressInfo.latitude;
        const lng = cartState.shippingAddressInfo.longitude;

        // Lưu vị trí user vào AsyncStorage
        await AppAsyncStorage.storeData(
          AppAsyncStorage.STORAGE_KEYS.shippingAddress,
          {
            location: location.title,
            latitude: lat.toString(),
            longitude: lng.toString(),
          },
        );

        await CartManager.updateOrderInfo(cartDispatch, {
          shippingAddressInfo: {
            location: location.title,
            latitude: lat.toString(),
            longitude: lng.toString(),
          },
        });

        // Step 3: Tìm merchant gần nhất
        const nearest = await LocationManager.getNearestMerchant(merchants, [
          lng,
          lat,
        ]);

        if (!nearest) return;

        const storeAddress = `${nearest.address}`;
        console.log('cua hang gan nhat', nearest);

        await AppAsyncStorage.storeData(
          AppAsyncStorage.STORAGE_KEYS.merchantLocationShipping,
          {
            _id: nearest._id,
            name: nearest.name,
            storeAddress,
            latitude: nearest.latitude.toString(),
            longitude: nearest.longitude.toString(),
          },
        );

        await CartManager.updateOrderInfo(cartDispatch, {
          store: nearest._id,
          storeInfo: {
            storeName: nearest.name,
            storeAddress,
          },
          storeSelect: nearest._id,
          storeInfoSelect: {
            storeName: nearest.name,
            storeAddress,
          },
        });
      } catch (err) {
        Toaster.show('Lỗi: Không thể lấy địa chỉ người dùng, merchants');
        console.log('Error in useLocation:', err);
      }
    };

    run();
  }, []);

  return null;
};
