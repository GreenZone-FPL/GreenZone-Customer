import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GLOBAL_KEYS } from '../constants';
import { DeliveryButton } from './buttons/DeliveryButton';

const TestComponent = props => {
  const {navigation} = props;
  const [currentLocation, setCurrenLocation] = useState('');
  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      console.log(position);
      if (position.coords) {
        reverseGeocode({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      }
    });
  }, []);

  const reverseGeocode = async ({lat, long}) => {
    const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VI&apikey=Q9zv9fPQ8xwTBc2UqcUkP32bXAR1_ZA-8wLk7tjgRWo`;

    try {
      const res = await axios(api);
      if (res && res.status === 200 && res.data) {
        const items = res.data.items;
        setCurrenLocation(items[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
      }}>
      <DeliveryButton
        title="Đi giao đến"
        address={currentLocation && currentLocation.address.label}
        onPress={() => {
          console.log('DeliveryButton clicked');
        }}
      />
    </View>
  );
};

export default TestComponent;
