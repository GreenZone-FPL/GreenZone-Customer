import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {ListItem} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Button,
  Dimensions,
} from 'react-native';
import {GLOBAL_KEYS, colors} from '../../constants';
import {
  NormalHeader,
  Row,
  Column,
  DualTextRow,
  LightStatusBar,
  DialogBasic,
  PrimaryButton,
} from '../../components';
import {TextFormatter} from '../../utils';
import {Icon, RadioButton} from 'react-native-paper';

const width = Dimensions.get('window').width;
const OrderCartScreen = props => {
  const navigation = props.navigation;

  const navigationGoback = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Xác nhận đơn hàng"
        onLeftPress={() => navigationGoback()}
      />

      <AddressInfo />

      <ProductsInfo navigationGoback={navigationGoback} />

      <PaymentDetails />

      <PayOrder />
    </View>
  );
};
export default OrderCartScreen;

const AddressInfo = () => {
  const [currentLocation, setCurrentLocation] = useState('');
  const [locationAvailable, setLocationAvailable] = useState(false);

  // Lấy vị trí người dùng
  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
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
        setCurrentLocation(items[0]);
        setLocationAvailable(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const options = [
    {
      id: 1,
      label: 'Giao hàng',
      address: locationAvailable
        ? currentLocation.address.label
        : 'Đang lấy vị trí...',
      phone: 'Ngọc Đại | 012345678',
    },
  ];

  return (
    <View style={styles.optionsContainer}>
      <FlatList
        data={options}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{item.label}</Text>
              <Row style={styles.row}>
                <Text style={styles.title}>Địa chỉ nhận hàng</Text>
                <Icon
                  source="square-edit-outline"
                  size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                  color={colors.primary}
                />
              </Row>
              <Text style={styles.optionAddress}>{item.address}</Text>
              <Row style={styles.row}>
                <Text style={styles.title}>Thông tin người nhận</Text>
                <Icon
                  source="square-edit-outline"
                  size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                  color={colors.primary}
                />
              </Row>

              <Text style={styles.optionPhone}>{item.phone}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const ProductsInfo = ({navigationGoback}) => {
  const [productList, setProductList] = useState(products);

  useEffect(() => {
    if (productList.length < 1) {
      navigationGoback();
    }
  }, [productList]);

  const handleDelete = id => {
    setProductList(prevList => prevList.filter(item => item.id !== id));
  };

  return (
    <View style={[styles.areaContainer, {borderBottomWidth: 0}]}>
      <FlatList
        data={productList}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <SwipeableProduct item={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.flatListContentContainer}
        scrollEnabled={false}
      />
    </View>
  );
};

const SwipeableProduct = ({item, onDelete, onEdit}) => {
  return (
    <ListItem.Swipeable
      animation={{duration: 500, useNativeDriver: true}}
      rightStyle={styles.rightStyle}
      containerStyle={{height: width / 6}}
      rightContent={reset => (
        <Row>
          <TouchableOpacity
            onPress={() => {
              //   onEdit();
              reset();
            }}
            style={styles.rightButton}>
            <Icon
              source={'square-edit-outline'}
              size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
              color={colors.black}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onDelete(item.id);
              reset();
            }}
            style={styles.rightButton}>
            <Icon
              source={'delete'}
              size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
              color={colors.black}
            />
          </TouchableOpacity>
        </Row>
      )}>
      <ListItem.Content style={{padding: 0, margin: 0, height: '100%'}}>
        <ProductItem item={item} />
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem.Swipeable>
  );
};

const ProductItem = ({item}) => {
  return (
    <Row style={styles.productItem}>
      <Image source={item.image} style={styles.productImage} />
      <Column style={{width: '60%'}}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productSize}>{item.size}</Text>
        <Text style={styles.productSize}>{item.topping}</Text>
      </Column>
      <Column>
        <Text style={styles.productPrice}>
          {TextFormatter.formatCurrency(item.price)}
        </Text>
        <Text style={styles.textDiscount}>
          {TextFormatter.formatCurrency(item.discount)}
        </Text>
      </Column>
    </Row>
  );
};

const products = [
  {
    id: '1',
    name: 'Trà Xanh Sữa Hạnh Nhân (Latte)',
    image: require('../../assets/images/product1.png'),
    price: 69000,
    size: 'Lớn',
    discount: 89000,
    topping: 'kem phô mai machiato',
  },
  {
    id: '2',
    name: 'Combo 3 Olong Tee',
    image: require('../../assets/images/product1.png'),
    price: 55000,
    size: 'Lớn',
    discount: 89000,
    topping: 'chân châu trắng',
  },
];

const PaymentDetails = () => (
  <View
    style={{marginBottom: 8, paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT}}>
    <DualTextRow
      leftText="CHI TIẾT THANH TOÁN"
      leftTextStyle={{color: colors.primary, fontWeight: 'bold'}}
    />
    {[
      {leftText: 'Tạm tính (2 sản phẩm)', rightText: '69.000đ'},
      {leftText: 'Phí giao hàng', rightText: '18.000đ'},
      {
        leftText: 'Giảm giá',
        rightText: '-28.000đ',
        rightTextStyle: {color: colors.primary},
      },
      {
        leftText: 'Tổng tiền',
        rightText: '68.000đ',
        leftTextStyle: {color: colors.black, fontWeight: '500'},
        rightTextStyle: {fontWeight: '700', color: colors.primary},
      },
    ].map((item, index) => (
      <DualTextRow key={index} {...item} />
    ))}
    <Row style={{justifyContent: 'space-between'}}>
      <Row>
        <Text style={styles.textQuantity}>3</Text>
        <Text style={{color: colors.primary, fontWeight: '500'}}>Ưu đãi</Text>
        <Icon
          source="chevron-down"
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
          color={colors.primary}
        />
      </Row>
      <Text style={{color: colors.primary, fontWeight: '500'}}>
        Tiết kiệm 19.000đ
      </Text>
    </Row>

    <PaymentMethod />
  </View>
);

const PaymentMethod = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState({
    name: 'Tiền mặt',
    image: require('../../assets/images/logo_vnd.png'),
  });

  // Danh sách phương thức thanh toán
  const paymentMethods = [
    {
      name: 'Tiền mặt',
      image: require('../../assets/images/logo_vnd.png'),
      value: 'cash',
    },
    {
      name: 'Momo',
      image: require('../../assets/images/logo_momo.png'),
      value: 'momo',
    },
    {
      name: 'ZaloPay',
      image: require('../../assets/images/logo_zalopay.png'),
      value: 'zalopay',
    },
    {
      name: 'PayOs',
      image: require('../../assets/images/logo_payos.png'),
      value: 'PayOs',
    },
    {
      name: 'Thanh toán bằng thẻ',
      image: require('../../assets/images/logo_card.png'),
      value: 'Card',
    },
  ];

  const handleSelectMethod = method => {
    setSelectedMethod(method);
    setIsVisible(false);
  };

  return (
    <Row style={{justifyContent: 'space-between', marginVertical: 8}}>
      <Text>Phương thức thanh toán</Text>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => setIsVisible(true)}>
        <Image source={selectedMethod.image} style={styles.image} />
        <Text style={{color: colors.gray700, marginLeft: 8}}>
          {selectedMethod.name}
        </Text>
        <Icon
          source="chevron-down"
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
          color={colors.gray700}
        />
      </TouchableOpacity>

      {/* Dialog chọn phương thức thanh toán */}
      <DialogBasic
        isVisible={isVisible}
        onHide={() => setIsVisible(false)}
        title="Chọn phương thức thanh toán">
        <View style={{marginHorizontal: 16}}>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.value}
              onPress={() => handleSelectMethod(method)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
              }}>
              <RadioButton
                value={method.value}
                status={
                  selectedMethod.name === method.name ? 'checked' : 'unchecked'
                }
              />
              <Image source={method.image} style={styles.image} />
              <Text style={{color: colors.gray700, marginLeft: 8}}>
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </DialogBasic>
    </Row>
  );

};

const PayOrder = () => {
  return (
    <View
      style={{
        backgroundColor: colors.green200,
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        justifyContent: 'flex-end',
      }}>
      <Row style={{justifyContent: 'space-between', marginBottom: 6}}>
        <Text>2 sản phẩm</Text>
        <Row>
          <Text style={{fontWeight: '700', color: colors.primary}}>
            68.000đ
          </Text>
          <Text style={styles.textDiscount}>69.000đ</Text>
        </Row>
      </Row>
      <PrimaryButton title="Đặt hàng" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  optionsContainer: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  optionItem: {
    flexDirection: 'row',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    color: colors.primary,
  },
  optionAddress: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
  },
  optionPhone: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
  },
  row: {
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  title: {
    fontWeight: '500',
  },
  areaContainer: {
    borderColor: colors.gray200,
    marginBottom: GLOBAL_KEYS.PADDING_DEFAULT,
    padding: GLOBAL_KEYS.GAP_SMALL,
  },
  rightStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    backgroundColor: colors.gray200,
  },
  flatListContentContainer: {
    // gap: GLOBAL_KEYS.PADDING_SMALL,
  },
  productItem: {
    borderColor: colors.gray200,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    marginTop: 8,
  },
  productImage: {
    width: width / 8,
    height: width / 8,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  productName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: 'green',
  },
  productSize: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    color: colors.gray700,
  },
  rightButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textDiscount: {
    textDecorationLine: 'line-through',
    color: colors.gray700,
  },
  textQuantity: {
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.primary,
    color: colors.white,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

