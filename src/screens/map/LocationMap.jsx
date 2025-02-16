import {View, Text, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import Geocoder from 'react-native-geocoding';
import {DeliveryButton} from '../../components';
import MapView from 'react-native-maps';

const MAP_API_KEY = process.env.MAP_API_KEY || ''; // Kiểm tra API key hợp lệ
Geocoder.init(MAP_API_KEY);

const LocationMap = props => {
  const {navigation} = props;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        if (position.coords) {
          reverseGeocode({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        }
      },
      error => {
        Alert.alert(
          'Lỗi',
          'Không thể lấy vị trí hiện tại. Hãy kiểm tra cài đặt GPS.',
        );
        console.error(error);
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  const reverseGeocode = async ({lat, long}) => {
    const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VI&apikey=Q9zv9fPQ8xwTBc2UqcUkP32bXAR1_ZA-8wLk7tjgRWo`;
    try {
      const res = await axios.get(api);
      if (res.status === 200 && res.data?.items?.length > 0) {
        setCurrentLocation(res.data.items[0]);
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy địa chỉ phù hợp.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy thông tin địa chỉ.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
      <MapView
        style={{width: '100%', height: '89%'}}
        showsMyLocationButton={true}
        showsUserLocation={true}
        initialRegion={
          currentLocation
            ? {
                latitude: currentLocation.position.lat,
                longitude: currentLocation.position.lng, 
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : {
                latitude: 10.762622, // Mặc định nếu chưa có dữ liệu
                longitude: 106.660172,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
        }
      />
      <DeliveryButton
        title="Đi giao đến"
        address={
          currentLocation ? currentLocation.address.label : 'Đang tải...'
        }
        onPress={() => console.log('DeliveryButton clicked')}
        disabled={loading}
      />
    </View>
  );
};

export default LocationMap;
