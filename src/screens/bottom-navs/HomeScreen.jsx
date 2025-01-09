import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Button, SafeAreaView, StyleSheet, ScrollView} from 'react-native';

import ScreenEnum from '../../constants/screenEnum';
import DeliveryButton from '../../components/buttons/DeliveryButton';
import DialogShippingMethod from '../../components/dialogs/DialogShippingMethod';
import HeaderWithBadge from '../../components/headers/HeaderWithBadge';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import CategoryMenu from '../../components/category/CategoryMenu';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import ProductsListHorizontal from '../../components/products/ProductsListHorizontal';
import ProductsListVertical from '../../components/products/ProductsListVertical';

const HomeScreen = props => {
  const {navigation} = props;
  const [currentLocation, setCurrenLocation] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  // Hàm xử lý khi đóng dialog
  const handleCloseDialog = () => {
    setIsModalVisible(false);
  };

  // Hàm xử lý khi chọn phương thức giao hàng
  const handleOptionSelect = option => {
    setSelectedOption(option);
    setIsModalVisible(false); // Đóng dialog sau khi chọn
  };
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
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <LightStatusBar />
        <HeaderWithBadge
          title="Home"
          onBadgePress={() => {
            navigation.navigate('ProductDetailSheet');
          }}
          isHome={true}
        />
        {/* <Button title="Checkout Screen" /> */}

        <CategoryMenu />
        <ProductsListHorizontal
          onItemClick={() => navigation.navigate(ScreenEnum.ProductDetailSheet)}
        />
        <ProductsListVertical
          onItemClick={() => navigation.navigate(ScreenEnum.ProductDetailSheet)}
        />

        <View style={styles.deliverybuttom}>
          <DeliveryButton
            title="Đi giao đến"
            address={currentLocation && currentLocation.address.label}
            onPress={() => setIsModalVisible(true)}
          />
          <DialogShippingMethod
            isVisible={isModalVisible}
            selectedOption={selectedOption}
            onHide={handleCloseDialog}
            onOptionSelect={handleOptionSelect}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  deliverybuttom: {
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    justifyContent: 'flex-end',
    flex: 1,
  },
});
