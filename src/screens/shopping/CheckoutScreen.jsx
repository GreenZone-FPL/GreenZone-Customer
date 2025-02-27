import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, View, Button } from 'react-native';
import { Icon, RadioButton } from 'react-native-paper';
import { ActionDialog, Ani_ModalLoading, Column, DialogBasic, DialogNotification, DialogShippingMethod, DualTextRow, FlatInput, HorizontalProductItem, LightStatusBar, NormalHeader, NormalText, PrimaryButton, Row, TitleText } from '../../components';
import DialogSelectTime from '../../components/dialogs/DialogSelectTime';
import { DeliveryMethod, GLOBAL_KEYS, PaymentMethod, colors } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { BottomGraph, ShoppingGraph, UserGraph, VoucherGraph } from '../../layouts/graphs';
import { CartActionTypes } from '../../reducers';
import { CartManager, TextFormatter, Toaster, fetchUserLocation } from '../../utils';
import { createPickUpOrder } from '../../axios/'
import { types } from 'react-native-document-picker';


const { width } = Dimensions.get('window');
const CheckoutScreen = ({ navigation }) => {
  const [dialogCreateOrderVisible, setDialogCreateOrderVisible] = useState(false);

  const [dialogRecipientInforVisible, setDialogRecipientInfoVisible] = useState(false);
  const [dialogShippingMethodVisible, setDialogShippingMethodVisible] = useState(false);
  const [dialogSelecTimeVisible, setDialogSelectTimeVisible] = useState(false);
  const [actionDialogVisible, setActionDialogVisible] = useState(false)
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Mang đi');
  const [note, setNote] = useState('');

  const { cartState, cartDispatch } = useAppContext()
  const [userInfo, setUserInfo] = React.useState(null);
  const [timeInfo, setTimeInfo] = React.useState(null);

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

  useEffect(() => {
    fetchUserLocation(setCurrentLocation, setLoading);
  }, []);


  if (cartState.orderItems.length === 0) {
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
                leftText={deliveryMethod.toLocaleUpperCase()}
                rightText={'Thay đổi'}
                leftTextStyle={{ color: colors.primary, fontWeight: '700' }}
                rightTextStyle={{ color: colors.primary }}
                onRightPress={() => setDialogShippingMethodVisible(true)}
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
              <TimeSection timeInfo={timeInfo} showDialog={() => setDialogSelectTimeVisible(true)} />


              <Column style={{ marginVertical: 8, marginHorizontal: 16 }}>
                <Row>
                  <NormalText
                    text='Thêm ghi chú cho cửa hàng bạn nhé'
                    style={{ color: colors.primary, fontStyle: "italic" }}
                  />
                  <Icon source="pencil" size={20} color={colors.primary} />
                </Row>

                <TextInput
                  style={styles.input}
                  placeholder="Nhập ghi chú khác..."
                  placeholderTextColor={colors.gray500}
                  value={note}
                  onChangeText={setNote}
                  multiline={true}
                  textAlignVertical="top"
                  returnKeyType="done"

                />
              </Column>

              {cartState.orderItems.length > 0 ?
                <ProductsInfo
                  confirmDelete={confirmDelete}
                  cartDispatch={cartDispatch}
                  onEditItem={(item) => navigation.navigate(ShoppingGraph.EditCartItemScreen, { updateItem: item })}
                  cart={cartState.orderItems}
                /> : null
              }

              <PaymentDetails
                cartState={cartState}
                onSelectVoucher={() => navigation.navigate(VoucherGraph.MyVouchersScreen,
                  {
                    cartTotal: CartManager.getCartTotal(cartState.orderItems),
                    deliveryAmount: 18000
                  }
                )}
                cart={cartState.orderItems}
              />
              <Column style={{ gap: 16, marginHorizontal: 16 }}>
                <Button title='Log cartState' onPress={() => console.log('cartState =', cartState)} />

                <Button title='Reset cartState' onPress={() => cartDispatch({ type: CartActionTypes.RESET_STATE })} />

              </Column>

            </ScrollView>

            <Footer showDialog={() => setDialogCreateOrderVisible(true)} deliveryMethod={deliveryMethod} note={note} cartDispatch={cartDispatch} cart={cartState.orderItems} address={address} />


          </>
        )}
      </>

      <DialogSelectTime
        visible={dialogSelecTimeVisible}
        onClose={() => setDialogSelectTimeVisible(false)}
        onConfirm={(data) => {
          setTimeInfo(data)
          setDialogSelectTimeVisible(false)
        }}
      />

      <ActionDialog
        visible={dialogCreateOrderVisible}
        title="Xác nhận"
        content={`Bạn xác nhận đặt đơn hàng"?`}
        cancelText="Hủy"
        approveText="Đồng ý"
        onCancel={() => setDialogCreateOrderVisible(false)}
        onApprove={async () => {

          try {
            const cartTotal = CartManager.getCartTotal(cartState.orderItems)
            const deliveryAmount = 18000
            const voucherAmount = 28000
            const paymentTotal = cartTotal + deliveryAmount - voucherAmount
            const orderInfo = {
              deliveryMethod: deliveryMethod === 'Mang đi' ? DeliveryMethod.PICK_UP : DeliveryMethod.DELIVERY,
              fulfillmentDateTime: timeInfo?.fulfillmentDateTime || new Date().toISOString(),
              totalPrice: paymentTotal,
              note,
              paymentMethod: PaymentMethod.COD
            }

            // Cập nhật state
            CartManager.updateOrderInfo(cartDispatch, orderInfo)

            // Gửi request tạo đơn hàng bằng dữ liệu mới (kết hợp state cũ + orderInfo mới)
            const body = { ...cartState, ...orderInfo }
            const missingFields = CartManager.checkValid(body)
            if (missingFields) {
              Toaster.show(`Thiếu thông tin: ${missingFields.join(', ')}`);
              return
            }

            const response = await createPickUpOrder({
              ...cartState,  // Giữ nguyên dữ liệu hiện tại
              ...orderInfo   // Ghi đè các thông tin cập nhật
            });
            console.log('order data', response)



          } catch (error) {
            console.log('error', error)
          } finally {
            setDialogCreateOrderVisible(false)
          }

        }}
      />
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
        selectedOption={deliveryMethod}
        onHide={() => setDialogShippingMethodVisible(false)}
        onOptionSelect={option => {
          setDeliveryMethod(option);
          setDialogShippingMethodVisible(false);
        }}
        onEditOption={option => {
          setDeliveryMethod(option);

          if (option === 'Giao hàng') {
            setDialogShippingMethodVisible(false);
          } else if (option === 'Mang đi') {
            setDialogShippingMethodVisible(false)
            navigation.navigate(BottomGraph.MerchantScreen, { updateOrderInfo: true });
          }
        }}
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

        <FlatInput label={'Tên người nhận'} value={name} setValue={setName} />

        <FlatInput label={'Số điện thoại'} value={phoneNumber} setValue={setPhoneNumber} />

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


const TimeSection = ({ timeInfo, showDialog }) => {
  return (
    <Column style={{ marginBottom: 8, marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT }}>
      <DualTextRow
        leftText={'Thời gian nhận'}
        rightText={'Thay đổi'}
        leftTextStyle={{ fontWeight: '600' }}
        rightTextStyle={{ color: colors.primary }}
        onRightPress={showDialog}
      />

      {
        timeInfo ?
          <NormalText text={`${timeInfo.selectedDay} - ${timeInfo.selectedTime}`} /> :
          <NormalText text='Chọn thời gian nhận' />
      }

    </Column>
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


const PaymentDetails = ({ onSelectVoucher, cart, cartState }) => {
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
            leftText: 'Giảm giá >>>',
            rightText: `- ${TextFormatter.formatCurrency(voucherAmount)}`,
            rightTextStyle: { color: colors.primary },
            onLeftPress: () => onSelectVoucher()
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

      <PaymentMethodView />
    </View >
  )
}


const PaymentMethodView = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState({
    name: 'Thanh toán khi nhận hàng',
    image: require('../../assets/images/logo_vnd.png'),
  });


  const paymentMethods = [
    {
      name: 'Thanh toán khi nhận hàng',
      image: require('../../assets/images/logo_vnd.png'),
      value: 'cash',
      paymentMethod: PaymentMethod.COD
    },
    {
      name: 'Momo',
      image: require('../../assets/images/logo_momo.png'),
      value: 'momo',
      paymentMethod: PaymentMethod.ONLINE
    },
    {
      name: 'ZaloPay',
      image: require('../../assets/images/logo_zalopay.png'),
      value: 'zalopay',
      paymentMethod: PaymentMethod.ONLINE
    },
    {
      name: 'PayOs',
      image: require('../../assets/images/logo_payos.png'),
      value: 'PayOs',
      paymentMethod: PaymentMethod.ONLINE
    },
    {
      name: 'Thanh toán bằng thẻ',
      image: require('../../assets/images/logo_card.png'),
      value: 'Card',
      paymentMethod: PaymentMethod.ONLINE
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

const getPaymentTotal = () => {
  const cartTotal = CartManager.getCartTotal(cart)
  const deliveryAmount = 18000
  const voucherAmount = 28000
  const paymentTotal = cartTotal + deliveryAmount - voucherAmount

}
const Footer = ({ showDialog, timeInfo, note, deliveryMethod, cartDispatch, cart, address }) => {

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
          {/* <NormalText text={`${TextFormatter.formatCurrency(cartTotal)}`} style={styles.textDiscount} /> */}
        </Column>
      </Row>

      <PrimaryButton title='Đặt hàng' onPress={showDialog}
      />

      {/* <DialogNotification
        isVisible={isVisible}
        onHide={() => setIsVisible(false)}
        title='Xác nhận thông tin đơn hàng'
        onConfirm={() => setIsVisible(false)}
        address={address} // Truyền địa chỉ vào DialogNotification
      /> */}
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
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  content: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.transparent
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    minHeight: 80,
  },
})
