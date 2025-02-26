import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon, RadioButton } from 'react-native-paper';
import { Ani_ModalLoading, ActionDialog, Column, DialogBasic, DialogNotification, DialogShippingMethod, DualTextRow, FlatInput, HorizontalProductItem, LightStatusBar, NormalHeader, NormalText, PrimaryButton, Row, TitleText } from '../../components';
import { GLOBAL_KEYS, colors } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { ShoppingGraph, UserGraph } from '../../layouts/graphs';
import { CartActionTypes } from '../../reducers';
import { CartManager, TextFormatter } from '../../utils';
import { fetchUserLocation } from '../../utils';

const { width } = Dimensions.get('window');
const CheckoutScreen = ({ navigation }) => {

  const [dialogRecipientInforVisible, setDialogRecipientInfoVisible] = useState(false);
  const [dialogShippingMethodVisible, setDialogShippingMethodVisible] = useState(false);
  const [actionDialogVisible, setActionDialogVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Giao hàng');
  const [editOption, setEditOption] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');

  const { cartState, cartDispatch } = useAppContext()
  const [userInfo, setUserInfo] = React.useState(null);


  const [selectedProduct, setSelectedProduct] = useState(null);// Sản phẩm cần xóa

  // Mở dialog với sản phẩm cần xóa
  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setActionDialogVisible(true);
  };

  // Xóa sản phẩm sau khi xác nhận
  const deleteProduct = async (id) => {
    const newCart = await CartManager.removeFromCart(id);
    cartDispatch({ type: CartActionTypes.UPDATE_CART, payload: newCart })
    setActionDialogVisible(false);
  }


  const handleCloseDialogShippingMethod = () => {
    setDialogShippingMethodVisible(false);
  };

  // Hàm xử lý khi chọn phương thức giao hàng
  const handleOptionSelect = option => {
    setSelectedOption(option);
    setDialogShippingMethodVisible(false); // Đóng dialog
  };

  const handleEditOption = option => {
    setEditOption(option);

    if (option === 'Giao hàng') {
      setDialogShippingMethodVisible(false);
    } else if (option === 'Mang đi') {
      setDialogShippingMethodVisible(false)
      navigation.navigate(UserGraph.AddressMerchantScreen);
    }
  };


  useEffect(() => {
    fetchUserLocation(setCurrentLocation, setLoading);
  }, []);


  if (cartState.items.length === 0) {
    return (
      <EmptyView goBack={() => navigation.goBack()} />
    )
  }

  return (
    <SafeAreaView style={styles.container}>


      <LightStatusBar />
      <NormalHeader title="Xác nhận đơn hàng" onLeftPress={() => navigation.goBack()} />

      <>

        {loading ? (
          <Ani_ModalLoading loading={loading} message='Đang tải Giỏ hàng...' />
        ) : (
          <>

            <ScrollView style={styles.containerContent}>
              <DualTextRow
                style={{ marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT, marginBottom: 8 }}
                leftText={'GIAO HÀNG'}
                rightText={'Thay đổi'}
                leftTextStyle={{ color: colors.primary, fontWeight: '700' }}
                rightTextStyle={{ color: colors.primary }}
                onRightPress={() => setIsModalVisible(true)}
              />
              <AddressSection
                currentLocation={currentLocation}
                changeAddress={() => { navigation.navigate(UserGraph.SelectAddressScreen) }}
                setAddress={setAddress} />

              <RecipientInfo
                userInfo={userInfo || { name: 'Dai ngoc', phoneNumber: '1234567890' }}
                onChangeRecipientInfo={() =>
                  //  navigation.navigate(ShoppingGraph.RecipientInfoSheet)}
                  setDialogRecipientInfoVisible(true)}
              />
              <TimeSection />

              {cartState.items.length > 0 ?
                <ProductsInfo
                  confirmDelete={confirmDelete}
                  cartDispatch={cartDispatch}
                  onEditItem={(item) => navigation.navigate(ShoppingGraph.EditCartItemScreen, { updateItem: item })}
                  cart={cartState.items}
                /> : null
              }

              <PaymentDetails cart={cartState.items} />
              <PrimaryButton title='Log cart' onPress={CartManager.readCart} />
            </ScrollView>

            <Footer cart={cartState.items} address={address} />


          </>
        )}
      </>
      <ActionDialog
        visible={actionDialogVisible}
        title="Xác nhận"
        content={`Bạn có chắc chắn muốn xóa "${selectedProduct?.productName}"?`}
        cancelText="Hủy"
        approveText="Xóa"
        onCancel={() => setActionDialogVisible(false)}
        onApprove={() => deleteProduct(selectedProduct.itemId)}
      />

      <DialogRecipientInfo
        visible={dialogRecipientInforVisible}
        onHide={() => setDialogRecipientInfoVisible(false)}
        onConfirm={(data) => {
          setUserInfo(data);
          setDialogRecipientInfoVisible(false);
        }}
      />


      <DialogShippingMethod
        isVisible={dialogShippingMethodVisible}
        selectedOption={selectedOption}
        onHide={handleCloseDialogShippingMethod}
        onOptionSelect={handleOptionSelect}
        onEditOption={handleEditOption}
      />

    </SafeAreaView>
  );

};
export default CheckoutScreen;


const EmptyView = ({ goBack }) => {
  return (
    <View style={[styles.container, { alignItems: 'center', gap: 50 }]}>
      <LightStatusBar />
      <NormalHeader title="Xác nhận đơn hàng" onLeftPress={goBack} />
      <Image
        resizeMode="contain"
        source={require('../../assets/images/empty_cart.png')}
        style={{ width: '80%', height: 300, alignSelf: 'center' }}
      />

      <NormalText text='Giỏ hàng của bạn đang trống' />
    </View >
  )
}


const DialogRecipientInfo = ({ visible, onHide, onConfirm }) => {
  const [name, setName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');

  return (
    <DialogBasic
      title={'Thay đổi thông tin người nhận '}
      isVisible={visible}
      onHide={onHide}
      style={{ backgroundColor: colors.fbBg }}
    >
      <Column style={styles.content}>
        <Text style={styles.label}>Tên người nhận</Text>
        <FlatInput label={''} value={name} setValue={setName} />
        <Text style={styles.label}>Số điện thoại</Text>
        <FlatInput label={''} value={phoneNumber} setValue={setPhoneNumber} />

        <PrimaryButton

          title={'Cập nhật'}
          onPress={() => {
            onConfirm({ name, phoneNumber })
            setName('')
            setPhoneNumber('')
          }} />


      </Column>

    </DialogBasic>
  )
}


const dateOptions = ["Hôm nay", "Ngày mai"];
const timeSlots = Array.from({ length: 24 }, (_, i) => `${8 + Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`);

const TimeSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(dateOptions[0]); // Mặc định là "Hôm nay"
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const timeListRef = useRef(null);


  return (
    <TouchableOpacity style={{ marginBottom: 8, marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT }}>
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
    <View style={{ marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT, marginBottom: 8 }}>
      <DualTextRow
        leftText="Địa chỉ nhận hàng"
        leftTextStyle={{ fontWeight: '600' }}
        rightText="Thay đổi"
        rightTextStyle={{ color: colors.primary }}
        onRightPress={changeAddress}
      />

      <NormalText text={currentLocation ? currentLocation.address.label : 'Đang lấy vị trí...'} />
    </View >
  );
};


const RecipientInfo = ({ userInfo, onChangeRecipientInfo }) => {

  return (
    <View style={{ marginBottom: 8, marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT }}>
      <DualTextRow
        leftText="Thông tin người nhận"
        rightText="Thay đổi"
        leftTextStyle={{ color: colors.black, fontWeight: '600' }}
        rightTextStyle={{ color: colors.primary }}
        onRightPress={onChangeRecipientInfo}
      />
      <NormalText text={`${userInfo?.name} | ${userInfo?.phoneNumber}`} />
    </View >
  );
};

const ProductsInfo = ({ onEditItem, cart, cartDispatch, confirmDelete }) => (
  
    <FlatList
      data={cart}
      keyExtractor={(item) => item.itemId.toString()}
      renderItem={({ item }) => (
        <Pressable onPress={() => onEditItem(item)}>
          <HorizontalProductItem
            confirmDelete={() => confirmDelete(item)}
            onDelete={async () => {
              const newCart = await CartManager.removeFromCart(item.itemId);
              cartDispatch({ type: CartActionTypes.UPDATE_CART, payload: newCart });
            }}
            containerStyle={{ paddingHorizontal: 16 }}
            item={item}
            enableAction={false}
          />
        </Pressable>
      )}
      contentContainerStyle={{ gap: 0, marginHorizontal: 0 }}
      nestedScrollEnabled={true}
      scrollEnabled={false}
    />

 

);





const PaymentDetails = ({ cart }) => {
  const cartTotal = CartManager.getCartTotal(cart)
  const deliveryAmount = 18000
  const voucherAmount = 28000
  const paymentTotal = cartTotal + deliveryAmount - voucherAmount
  return (
    < View
      style={{ marginBottom: 8, marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT }}>
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
  const cartTotal = CartManager.getCartTotal(cart)
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
    flexDirection: 'column',
    backgroundColor: colors.fbBg,
    position: 'relative',
  },
  containerContent: {
    backgroundColor: colors.white,
    flex: 1,
    gap: 16,
  },
  swiper: {
    height: 200,
    width: width * 0.8,
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
    flexDirection: 'column', alignItems: 'center', paddingHorizontal: 12, backgroundColor: colors.green700, height: '100%', justifyContent: 'center', borderRadius: 8
  },

  content: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.transparent
  },
  label: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  goBackButton: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
    backgroundColor: colors.green100,
    alignItems: 'center',
    justifyContent: 'center',
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    position: 'absolute',
    end: 0,
  },
})
