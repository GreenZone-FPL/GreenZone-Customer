import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';

import {
  DeliveryButton,
  DialogShippingMethod,
  HeaderWithBadge,
  LightStatusBar,
  ProductsListHorizontal,
  ProductsListVertical,
  Indicator,
  ZoomCarousel,
  ImageCarousel,
  BarcodeUser,
  TitleText,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {ShoppingGraph, UserGraph} from '../../layouts/graphs';

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
        <HeaderWithBadge title="Home" onBadgePress={() => {}} isHome={true} />
        <BarcodeUser nameUser="User name" codeId="M1678263323" />
        <CardCategory />
        <Button
          title="Checkout Screen"
          onPress={() => navigation.navigate(ShoppingGraph.CheckoutScreen)}
        />

        <Indicator
          color={colors.primary}
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        />
        <ZoomCarousel data={dataBanner} time={3000} />
        <ImageCarousel data={dataBanner} time={2000} />

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

const Item = ({imagePath, title, onPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.item}>
    <Image source={imagePath} style={styles.itemImage} />
    <TitleText text={title} style={styles.textTitle} numberOfLines={1} />
  </TouchableOpacity>
);

const CardCategory = () => {
  return (
    <View style={styles.card}>
      <ScrollView
        horizontal={true} // Cuộn ngang
        showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
        contentContainerStyle={{gap: GLOBAL_KEYS.GAP_DEFAULT}}>
        <Item
          imagePath={require('../../assets/images/image-Service/ic_delivery.png')}
          title="Giao hàng"
        />
        <Item
          imagePath={require('../../assets/images/image-Service/ic_take_away.png')}
          title="Mang đi"
        />
        <Item
          imagePath={require('../../assets/images/image-Service/voucher.png')}
          title="Voucher"
        />
        <Item
          imagePath={require('../../assets/images/image-Service/coin.png')}
          title="Đổi xu"
        />
        <Item
          imagePath={require('../../assets/images/image-Service/order.png')}
          title="Đơn Hàng"
        />
        <Item
          imagePath={require('../../assets/images/image-Service/feedback.png')}
          title="Góp ý"
        />
        <Item
          imagePath={require('../../assets/images/image-Service/vip.png')}
          title="Hạng thành viên"
        />
      </ScrollView>
    </View>
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
  item: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  itemImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  textTitle: {
    flexWrap: 'wrap',
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 10,
  },
  card: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginHorizontal: 16,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    justifyContent: 'space-around',
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
