import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Icon, RadioButton } from 'react-native-paper';
import { Column, Ani_ModalLoading, DialogBasic, DialogNotification, DialogShippingMethod, DualTextRow, HorizontalProductItem, LightStatusBar, NormalHeader, NormalText, PrimaryButton, Row, TitleText } from '../../components';
import { GLOBAL_KEYS, colors } from '../../constants';
import { ShoppingGraph, UserGraph } from '../../layouts/graphs';
import { CartManager, TextFormatter } from '../../utils';
import { useAppContext } from '../../context/appContext';
import { CartActionTypes } from '../../reducers';



const CheckoutScreen = (props) => {
  const navigation = props.navigation;
  const [isDialogShippingMethodVisible, setDialogShippingMethodVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Giao hàng');

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');

  const { cartState, cartDispatch } = useAppContext()
  const reverseGeocode = async ({ lat, long }) => {
    const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VI&apikey=Q9zv9fPQ8xwTBc2UqcUkP32bXAR1_ZA-8wLk7tjgRWo`;

    try {
      const res = await axios(api);
      if (res && res.status === 200 && res.data) {
        const items = res.data.items;
        if (items.length > 0) {
          setCurrentLocation(items[0]);
        } else {
          console.log('Không tìm thấy địa chỉ.');
        }
      }
    } catch (error) {
      console.log('Lỗi khi lấy địa chỉ:', error);
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true); // Bật loading ngay từ đầu
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1s
        Geolocation.getCurrentPosition(
          async position => {
            if (position.coords) {
              await reverseGeocode({
                lat: position.coords.latitude,
                long: position.coords.longitude,
              });
            }
          },
          error => console.log('Lỗi lấy vị trí:', error),
          { timeout: 5000 }
        );
      } finally {
        setLoading(false); // Chỉ tắt loading một lần duy nhất
      }
    };

    fetchLocation();

    return () => setLoading(false); // Cleanup nếu unmount
  }, []);


  if (cartState.items.length === 0) {
    return (

      <View style={styles.container}>
        <LightStatusBar />
        <NormalHeader title="Xác nhận đơn hàng" onLeftPress={() => navigation.goBack()} />
        <Image
          resizeMode="contain"
          source={require('../../assets/images/empty_cart.png')}
          style={{ width: '80%', height: 300, alignSelf: 'center' }}
        />
      </View >
    )
  }

  return (
    <View style={styles.container}>

      <>
        <LightStatusBar />
        <NormalHeader title="Xác nhận đơn hàng" onLeftPress={() => navigation.goBack()} />

        {loading ? (
          <Ani_ModalLoading loading={loading} message='Đang tải Giỏ hàng...' />
        ) : (
          <>
            <ScrollView style={styles.containerContent}>
              <DualTextRow
                leftText={'GIAO HÀNG'}
                rightText={'Thay đổi'}
                leftTextStyle={{ color: colors.primary, fontWeight: '700' }}
                rightTextStyle={{ color: colors.primary }}
                onRightPress={() => setDialogShippingMethodVisible(true)}
              />
              <AddressSection
                currentLocation={currentLocation}
                changeAddress={() => { navigation.navigate(UserGraph.SelectAddressScreen) }}
                setAddress={setAddress} />

              <RecipientInfo onChangeRecipientInfo={() => navigation.navigate(ShoppingGraph.RecipientInfoSheet)} />
              <TimeSection />

              {cartState.items.length > 0 && (
                <ProductsInfo
                  cartDispatch={cartDispatch}
                  onEditItem={(item) => navigation.navigate(ShoppingGraph.EditCartItemScreen, { updateItem: item })}
                  cart={cartState.items}
                />
              )}

              <PaymentDetails cart={cartState.items} />
              <PrimaryButton title='Log cart' onPress={async () => {
                const cart = CartManager.readCart()
                // console.log('cart toppingItems = ', cart.toppingItems)
              }

              } />
            </ScrollView>
            <Footer cart={cartState.items} address={address} />
          </>
        )}

        <DialogShippingMethod
          isVisible={isDialogShippingMethodVisible}
          selectedOption={selectedOption}
          onHide={() => setDialogShippingMethodVisible(false)}
          onEditOption={option => console.log(`Editing ${option}`)}
          onOptionSelect={option => setSelectedOption(option)}
        />
      </>

    </View>
  );

};
export default CheckoutScreen;


const dateOptions = ["Hôm nay", "Ngày mai"];
const timeSlots = Array.from({ length: 24 }, (_, i) => `${8 + Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`);

const TimeSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(dateOptions[0]); // Mặc định là "Hôm nay"
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const timeListRef = useRef(null);


  return (
    <TouchableOpacity>
      <DualTextRow
        leftText={'Thời gian nhận'}
        rightText={'Thay đổi'}
        leftTextStyle={{ fontWeight: '600' }}
        rightTextStyle={{ color: colors.primary }}
        onRightPress={() => setIsVisible(true)}
      />
      <NormalText text={`${selectedDay} - ${selectedTime}`} />

      <DialogBasic isVisible={isVisible} onHide={() => setIsVisible(false)} title="Thời gian nhận">
        <Row>
          {/* Danh sách ngày */}
          <FlatList
            data={dateOptions}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.dayItem, selectedDay === item && styles.selectedDay]}
                onPress={() => {
                  setSelectedDay(item);
                  setSelectedTime(timeSlots[0]); // Reset về 8:00 khi đổi ngày
                }}
              >
                <TitleText text={item} style={{ color: selectedDay === item ? colors.black : colors.gray400 }} />

              </TouchableOpacity>
            )}
          />

          {/* Danh sách giờ */}
          <FlatList
            ref={timeListRef}
            data={timeSlots}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            snapToAlignment="center"
            nestedScrollEnabled={true}
            snapToInterval={50} // Điều chỉnh để căn giữa
            decelerationRate="fast"
            initialNumToRender={3} // Chỉ render trước 3 item
            maxToRenderPerBatch={3} // Render tối đa 3 item cùng lúc
            windowSize={3} // Giữ 3 item trong bộ nhớ để tối ưu hiệu suất
            style={{ maxHeight: 150 }} // Giới hạn chiều cao để chỉ hiển thị 3 item (50px mỗi item)
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.timeItem, selectedTime === item && styles.selectedTimeItem]}
                onPress={() => setSelectedTime(item)}
              >
                <TitleText text={item} style={{ color: selectedTime === item ? colors.black : colors.gray400 }} />
              </TouchableOpacity>
            )}
          />
        </Row>

        {/* Nút Xác nhận */}
        <PrimaryButton title='Xác nhận' onPress={() => setIsVisible(false)} />
      </DialogBasic>
    </TouchableOpacity>
  );
};
const AddressSection = ({ currentLocation, changeAddress }) => {

  return (
    <>
      <DualTextRow
        leftText="Địa chỉ nhận hàng"
        leftTextStyle={{ fontWeight: '600' }}
        rightText="Thay đổi"
        rightTextStyle={{ color: colors.primary }}
        onRightPress={changeAddress}
      />

      <NormalText text={currentLocation ? currentLocation.address.label : 'Đang lấy vị trí...'} />
    </>
  );
};


const RecipientInfo = ({ onChangeRecipientInfo }) => {
  return (
    <>
      <DualTextRow
        leftText="Thông tin người nhận"
        rightText="Thay đổi"
        leftTextStyle={{ color: colors.black, fontWeight: '600' }}
        rightTextStyle={{ color: colors.primary }}
        onRightPress={onChangeRecipientInfo}
      />
      <NormalText text='Ngọc Đại | 012345678' />

    </>
  );
};

const ProductsInfo = ({ onEditItem, cart, cartDispatch }) => {

  return (
    <View style={{ marginVertical: 8 }}>
      <FlatList
        data={cart}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (

          <SwipeableItem
            item={item}
            onEdit={onEditItem}

            onDelete={async () => {
              const newCart = await CartManager.removeFromCart(item.itemId)

              cartDispatch({
                type: CartActionTypes.UPDATE_CART,
                payload: newCart
              })

            }} />
        )}
        contentContainerStyle={{ gap: 8 }}
        scrollEnabled={false}
      />
    </View>
  );
};

const SwipeableItem = ({ item, onDelete, onEdit }) => {
  const swipeableRef = useRef(null);
  const handleReset = () => {
    swipeableRef.current?.reset();
  };


  const renderRightActions = () => (
    <Row style={{ backgroundColor: 'white', marginLeft: 8 }}>
      <TouchableOpacity onPress={() => {
        onEdit(item)
        handleReset()
      }}>
        <Column style={[styles.actionButton, { backgroundColor: colors.green700 }]}>
          <Icon
            source={'tooltip-edit'}
            size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
            color={colors.white}
          />
          <NormalText text='Chỉnh sửa' style={{ color: colors.white }} />

        </Column>

      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        onDelete(item.productId)
        handleReset()
      }}>
        <Column style={[styles.actionButton, { backgroundColor: colors.gray400 }]}>
          <Icon
            source={'delete-variant'}
            size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
            color={colors.white}
          />
          <NormalText text='Xóa' style={{ color: colors.white }} />

        </Column>

      </TouchableOpacity>
    </Row>
  );

  return (
    <View style={styles.container}>
      <ReanimatedSwipeable
        renderRightActions={renderRightActions}
        rightThreshold={50}
        friction={2}
        ref={swipeableRef}
        containerStyle={{}}
      >
        <HorizontalProductItem
          containerStyle={{ marginBottom: 0, paddingHorizontal: 8, borderBottomColor: colors.gray300, borderBottomWidth: 1 }}
          item={item}
          enableAction={false} />
      </ReanimatedSwipeable>
    </View>
  );
}




const PaymentDetails = ({ cart }) => {
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const deliveryAmount = 18000
  const voucherAmount = 28000
  const paymentTotal = cartTotal + deliveryAmount - voucherAmount
  return (
    < View
      style={{ marginBottom: 8 }}>
      <DualTextRow
        leftText="CHI TIẾT THANH TOÁN"
        leftTextStyle={{ color: colors.primary, fontWeight: 'bold' }}
      />
      {
        [
          { leftText: `Tạm tính (${cart.length} sản phẩm)`, rightText: `${TextFormatter.formatCurrency(cartTotal)}` },
          { leftText: 'Phí giao hàng', rightText: `${TextFormatter.formatCurrency(deliveryAmount)}`, },
          {
            leftText: 'Giảm giá',
            rightText: `- ${TextFormatter.formatCurrency(voucherAmount)}`,
            rightTextStyle: { color: colors.primary },
          },
          {
            leftText: 'Tổng tiền',
            rightText: `${TextFormatter.formatCurrency(paymentTotal)}`,
            leftTextStyle: { color: colors.black, fontWeight: '500' },
            rightTextStyle: { fontWeight: '700', color: colors.primary },
          },
        ].map((item, index) => (
          <DualTextRow key={index} {...item} />
        ))
      }

      <PaymentMethod />
    </View >
  )
}





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
    <Row style={{ justifyContent: 'space-between', marginVertical: 8 }}>
      <NormalText text='Phương thức thanh toán' />

      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
        onPress={() => setIsVisible(true)}
      >
        <Image source={selectedMethod.image} style={styles.image} />

        <NormalText text={selectedMethod.name} />
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
        title="Chọn phương thức thanh toán"
      >
        <Column style={{ marginHorizontal: 16 }}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.value}
              onPress={() => handleSelectMethod(method)}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
            >
              <RadioButton
                value={method.value}
                status={selectedMethod.name === method.name ? 'checked' : 'unchecked'}
                color={colors.primary}
                onPress={() => handleSelectMethod(method)}
              />
              <Image source={method.image} style={styles.image} />
              <Text style={{ color: colors.gray700, marginLeft: 8 }}>{method.name}</Text>
            </TouchableOpacity>
          ))}
        </Column>
      </DialogBasic>
    </Row>
  );
};

const Footer = ({ cart, address }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const deliveryAmount = 18000
  const voucherAmount = 28000
  const paymentTotal = cartTotal + deliveryAmount - voucherAmount

  return (
    <View style={{ backgroundColor: colors.fbBg, padding: GLOBAL_KEYS.PADDING_DEFAULT, justifyContent: 'flex-end' }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <Column>
          <TitleText text='Tổng cộng' />
          <NormalText text={`${cart.length} sản phẩm`} />
          <NormalText text={`Bạn tiết kiệm ${TextFormatter.formatCurrency(voucherAmount)}`} style={{ color: colors.green750 }} />
        </Column>

        <Column>
          <TitleText text={`${TextFormatter.formatCurrency(paymentTotal)}`} style={{ color: colors.primary, textAlign: 'right' }} />
          <NormalText text={`${TextFormatter.formatCurrency(cartTotal)}`} style={styles.textDiscount} />
        </Column>
      </Row>

      <PrimaryButton title='Đặt hàng' onPress={() => setIsVisible(true)} />

      <DialogNotification
        isVisible={isVisible}
        onHide={() => setIsVisible(false)}
        title='Xác nhận thông tin đơn hàng'
        onConfirm={() => setIsVisible(false)}
        address={address} // Truyền địa chỉ vào DialogNotification
      />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fbBg,
    flexDirection: 'column',
  },
  containerContent: {
    backgroundColor: colors.white,
    flex: 1,
    gap: 16,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },

  textDiscount: {
    textDecorationLine: "line-through",
    color: colors.gray700,
    textAlign: 'right'
  },
  textQuantity: {
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.primary,
    color: colors.white,
    paddingHorizontal: 6,
    borderRadius: 10,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  selectedTime: { fontSize: 14, color: colors.gray700, marginTop: 4 },

  containerTime: { flexDirection: "row", justifyContent: "space-between", padding: 10 },

  dayItem: { padding: 12, alignItems: "center" },
  selectedDay: { borderRadius: 5 },
  dayText: { fontSize: 14, color: colors.gray700 },
  selectedDayText: { color: colors.black, fontWeight: "bold" },

  timeItem: { height: 50, justifyContent: "center", alignItems: "center" },
  selectedTimeItem: { borderRadius: 5 },
  timeText: { fontSize: 16, color: colors.gray700 },
  selectedTimeText: { color: "#333", fontWeight: "bold" },

  actionButton: {
    flexDirection: 'column', alignItems: 'center', paddingHorizontal: 16, backgroundColor: colors.green700, height: '100%', justifyContent: 'center', borderRadius: 8
  }
})
