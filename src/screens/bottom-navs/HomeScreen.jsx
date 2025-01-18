import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, ScrollView, StyleSheet} from 'react-native';

import {
  CategoryMenu,
  DeliveryButton,
  DialogShippingMethod,
  HeaderWithBadge,
  LightStatusBar,
  ProductsListHorizontal,
  ProductsListVertical,
  Carousel,
  Indicator,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {ShoppingGraph} from '../../layouts/graphs';

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
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <ScrollView style={styles.containerContent}>
        <HeaderWithBadge
          title="Home"
          onBadgePress={() => {
            navigation.navigate('ProductDetailSheet');
          }}
          isHome={true}
        />
        <Button
          title="Checkout Screen"
          onPress={() => navigation.navigate(ShoppingGraph.CheckoutScreen)}
        />

        <CategoryMenu />

        <Indicator
          color={colors.primary}
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        />
        <Carousel
          data={dataBanner}
          time={3000}
          dotFlexDirection={'row'}
          dotJustifyContent={'center'}
          dotMarginVertical={GLOBAL_KEYS.PADDING_DEFAULT}
          dotWidth={GLOBAL_KEYS.ICON_SIZE_DEFAULT / 2}
          dotHeight={GLOBAL_KEYS.ICON_SIZE_DEFAULT / 2}
          dotBorderRadius={GLOBAL_KEYS.BORDER_RADIUS_DEFAULT}
          dotBackgroundColor={colors.blue500}
          dotMarginHorizontal={GLOBAL_KEYS.PADDING_DEFAULT}
          dotSelectedBackgroundColor={colors.red800}
        />

        <ProductsListHorizontal
          onItemClick={() =>
            navigation.navigate(ShoppingGraph.ProductDetailSheet)
          }
        />
        <ProductsListVertical
          onItemClick={() =>
            navigation.navigate(ShoppingGraph.ProductDetailSheet)
          }
        />
      </ScrollView>

      <DeliveryButton
        title="Đi giao đến"
        address={currentLocation && currentLocation.address.label}
        onPress={() => setIsModalVisible(true)}
        style={styles.deliverybutton}
      />
      <DialogShippingMethod
        isVisible={isModalVisible}
        selectedOption={selectedOption}
        onHide={handleCloseDialog}
        onOptionSelect={handleOptionSelect}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
    position: 'relative',
  },
  containerContent: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 90,
  },
  deliverybutton: {
    position: 'absolute',
    bottom: 0,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
});

const dataBanner = [
  {
    id: 1,
    image: 'https://intphcm.com/data/upload/banner-tet.jpg',
  },
  {
    id: 2,
    image: 'https://rubee.com.vn/wp-content/uploads/2022/04/banner-la-gi.jpg',
  },
  {
    id: 3,
    image:
      'https://rubicmarketing.com/wp-content/uploads/2022/03/thiet-ke-banner-quang-cao-online-1.jpg',
  },
];
