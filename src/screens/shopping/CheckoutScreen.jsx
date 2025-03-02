import React, { useEffect, useState } from 'react';
import { Alert, Button, Dimensions, FlatList, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon, RadioButton } from 'react-native-paper';
import { createPickUpOrder } from '../../axios/';
import { ActionDialog, Ani_ModalLoading, Column, DeliveryMethodSheet, DialogBasic, DualTextRow, FlatInput, HorizontalProductItem, LightStatusBar, NormalHeader, NormalText, PrimaryButton, Row, TitleText } from '../../components';
import DialogSelectTime from '../../components/dialogs/DialogSelectTime';
import { DeliveryMethod, GLOBAL_KEYS, PaymentMethod, colors } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { BottomGraph, ShoppingGraph, UserGraph, VoucherGraph } from '../../layouts/graphs';
import { CartManager, TextFormatter, fetchUserLocation } from '../../utils';

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
  const [deliveryMethod, setDeliveryMethod] = useState(DeliveryMethod.PICK_UP);
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
    await CartManager.removeFromCart(id, cartDispatch);
    // cartDispatch({ type: CartActionTypes.UPDATE_ORDER_ITEMS, payload: newCart })
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
                style={{ paddingVertical: 8, paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT, marginVertical: 8, backgroundColor: colors.white }}
                leftText={cartState.deliveryMethod === DeliveryMethod.PICK_UP.value ? DeliveryMethod.PICK_UP.label.toLocaleUpperCase() : DeliveryMethod.DELIVERY.label.toLocaleUpperCase()}
                rightText={'Thay đổi'}
                leftTextStyle={{ color: colors.primary, fontWeight: '700' }}
                rightTextStyle={{ color: colors.primary }}
                onRightPress={() => setDialogShippingMethodVisible(true)}
              />

              <AddressSection
                cartState={cartState}
                chooseUserAddress={() => { navigation.navigate(UserGraph.SelectAddressScreen, { isUpdateOrderInfo: true }) }}
                chooseMerchant={() => { navigation.navigate(BottomGraph.MerchantScreen, { isUpdateOrderInfo: true }) }}
              />

              {
                cartState.deliveryMethod === DeliveryMethod.DELIVERY.value &&
                <RecipientInfo
                  userInfo={userInfo || { name: 'Dai ngoc', phoneNumber: '1234567890' }}
                  onChangeRecipientInfo={() =>
                    //  navigation.navigate(ShoppingGraph.RecipientInfoSheet)}
                    setDialogRecipientInfoVisible(true)}
                />
              }
              <TimeSection timeInfo={timeInfo} showDialog={() => setDialogSelectTimeVisible(true)} />


              <Column style={styles.containerItem}>
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

              <PaymentDetailsView
                cartState={cartState}
                onSelectVoucher={() => navigation.navigate(VoucherGraph.MyVouchersScreen, { isUpdateOrderInfo: true })}

              />
              <Column style={{ gap: 16, marginHorizontal: 16 }}>
                <Button title='Log cartState' onPress={() => console.log('cartState =', JSON.stringify(cartState, null, 2))} />

                <Button title='Clear cartState' onPress={() => CartManager.clearCart(cartDispatch)} />

              </Column>

            </ScrollView>

            <Footer
              showDialog={() => setDialogCreateOrderVisible(true)}
              note={note}
              cartDispatch={cartDispatch}
              cartState={cartState}
            />


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
              deliveryMethod: deliveryMethod.label === DeliveryMethod.PICK_UP.label ? DeliveryMethod.PICK_UP.value : DeliveryMethod.DELIVERY.value,
              fulfillmentDateTime: timeInfo?.fulfillmentDateTime || new Date().toISOString(),
              totalPrice: paymentTotal,
              note,
              paymentMethod: PaymentMethod.COD.value
            }

            // Cập nhật state
            CartManager.updateOrderInfo(cartDispatch, orderInfo)

            // Gửi request tạo đơn hàng bằng dữ liệu mới (kết hợp state cũ + orderInfo mới)
            const body = { ...cartState, ...orderInfo }
            const missingFields = CartManager.checkValid(body)
            if (missingFields) {
              Alert.alert('Cảnh báo', `Thiếu thông tin: ${missingFields.join(', ')}`)
              // Toaster.show(`Thiếu thông tin: ${missingFields.join(', ')}`);
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

      <DeliveryMethodSheet
        visible={dialogShippingMethodVisible}
        selectedOption={cartState.deliveryMethod === DeliveryMethod.PICK_UP.value ? DeliveryMethod.PICK_UP : DeliveryMethod.DELIVERY}
        onClose={() => setDialogShippingMethodVisible(false)}
        onSelect={async option => {
          console.log('option', option)
          await CartManager.updateOrderInfo(cartDispatch, { deliveryMethod: option.value })
          setDialogShippingMethodVisible(false);
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
  console.log('timeInfo', timeInfo)
  return (
    <Column style={styles.containerItem}>
      <DualTextRow
        style={{ marginVertical: 0 }}
        leftText={'Thời gian nhận'}
        rightText={'Thay đổi'}
        leftTextStyle={{ fontWeight: '600' }}
        rightTextStyle={{ color: colors.primary }}
        onRightPress={showDialog}
      />

      {
        timeInfo ?
          <>
            {
              timeInfo.selectedDay === 'Hôm nay' && timeInfo.selectedTime === 'Sớm nhất có thể' &&
              <TitleText text='15-30 phút' style={{ color: colors.green500 }} />
            }

            <NormalText text={`${timeInfo.selectedDay} - ${timeInfo.selectedTime} - ${timeInfo.fulfillmentDateTime}`} />


          </>

          :
          <NormalText text='Chọn thời gian nhận' style={{ color: colors.orange700 }} />
      }

    </Column>
  );
};
const AddressSection = ({ cartState, chooseMerchant, chooseUserAddress }) => {

  return (
    <View style={styles.containerItem}>
      <DualTextRow
        style={{ marginVertical: 0, marginBottom: 8 }}
        leftText="Địa chỉ nhận hàng"
        leftTextStyle={{ fontWeight: '600' }}
        rightText="Thay đổi"
        rightTextStyle={{ color: colors.primary }}
        onRightPress={() => {
          if (cartState.deliveryMethod === DeliveryMethod.PICK_UP.value) {
            chooseMerchant()
          } else {
            chooseUserAddress()
          }
        }}
      />
      {
        cartState.deliveryMethod === DeliveryMethod.PICK_UP.value ?
          ((cartState?.storeInfo?.storeName && cartState?.storeInfo?.storeAddress) ? (
            <>
              <TitleText text={cartState?.storeInfo?.storeName} style={{ marginBottom: 8, color: colors.green500 }} />
              <NormalText text={cartState?.storeInfo?.storeAddress} />
            </>

          ) : <NormalText text='Vui lòng chọn địa chỉ cửa hàng' style={{ color: colors.orange700 }} />) :
          <NormalText text='Vui lòng chọn địa chỉ giao hàng' style={{ color: colors.orange700 }} />
      }

    </View >
  );
};


const RecipientInfo = ({ userInfo, onChangeRecipientInfo }) => {

  return (
    <View style={styles.containerItem}>
      <DualTextRow
        style={{ marginVertical: 0, marginBottom: 8 }}
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
            await CartManager.removeFromCart(item.itemId, cartDispatch);
            // cartDispatch({ type: CartActionTypes.UPDATE_ORDER_ITEMS, payload: newCart });
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


const PaymentDetailsView = ({ onSelectVoucher, cartState }) => {
  const paymentDetails = CartManager.getPaymentDetails(cartState)

  return (
    < View
      style={[styles.containerItem, { backgroundColor: colors.gray200, paddingHorizontal: 0, gap: 1, paddingVertical: 0 }]}>
      <DualTextRow
        style={{ paddingVertical: 8, marginVertical: 0, paddingHorizontal: 16, backgroundColor: colors.white }}
        leftText="CHI TIẾT THANH TOÁN"
        leftTextStyle={{ color: colors.primary, fontWeight: 'bold' }}
      />
      {
        [
          { leftText: `Tạm tính (${cartState.orderItems.length} sản phẩm)`, rightText: `${TextFormatter.formatCurrency(paymentDetails.cartTotal)}` },
          { leftText: 'Phí giao hàng', rightText: `${TextFormatter.formatCurrency(paymentDetails.deliveryAmount)}`, },
          {
            leftText: cartState.voucher ? `${cartState?.voucherInfo?.code}` : 'Chọn khuyến mãi',
            leftTextStyle: { color: cartState.voucher ? colors.primary : colors.orange700, fontWeight: '500' },
            rightText: paymentDetails.voucherAmount === 0 ? '' : `- ${TextFormatter.formatCurrency(paymentDetails.voucherAmount)}`,
            rightTextStyle: { color: colors.primary },
            onLeftPress: () => onSelectVoucher()
          },
          {
            leftText: 'Tổng tiền',
            rightText: `${TextFormatter.formatCurrency(paymentDetails.paymentTotal)}`,
            leftTextStyle: { color: colors.black, fontWeight: '500', fontSize: 14 },
            rightTextStyle: { fontWeight: '700', color: colors.primary, fontSize: 14 },
          },
        ].map((item, index) => (
          <DualTextRow key={index} {...item} style={{ paddingVertical: 12, marginVertical: 0, backgroundColor: colors.white, paddingHorizontal: 16 }} />
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
      paymentMethod: PaymentMethod.COD.value
    },
    {
      name: 'Momo',
      image: require('../../assets/images/logo_momo.png'),
      value: 'momo',
      paymentMethod: PaymentMethod.ONLINE.value
    },
    {
      name: 'ZaloPay',
      image: require('../../assets/images/logo_zalopay.png'),
      value: 'zalopay',
      paymentMethod: PaymentMethod.ONLINE.value
    },
    {
      name: 'PayOs',
      image: require('../../assets/images/logo_payos.png'),
      value: 'PayOs',
      paymentMethod: PaymentMethod.ONLINE.value
    },
    {
      name: 'Thanh toán bằng thẻ',
      image: require('../../assets/images/logo_card.png'),
      value: 'Card',
      paymentMethod: PaymentMethod.ONLINE.value
    },
  ];

  const handleSelectMethod = method => {
    setSelectedMethod(method);
    setIsVisible(false);
  };

  return (
    <Row style={{ justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: colors.white, paddingVertical: 8 }}>
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


const Footer = ({ cartState, showDialog, timeInfo, note, cartDispatch }) => {
  const paymentDetails = CartManager.getPaymentDetails(cartState)

  return (
    <View style={{ backgroundColor: colors.fbBg, padding: GLOBAL_KEYS.PADDING_DEFAULT, justifyContent: 'flex-end' }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <Column>
          <TitleText text='Tổng cộng' />
          <NormalText text={`${cartState.orderItems.length} sản phẩm`} />
          {
            cartState?.voucher &&
            <NormalText
              text={`Bạn tiết kiệm ${TextFormatter.formatCurrency(paymentDetails.voucherAmount)}`}
              style={{ color: colors.green750 }} />
          }

        </Column>

        <Column>
          <TitleText text={`${TextFormatter.formatCurrency(paymentDetails.paymentTotal)}`} style={{ color: colors.primary, textAlign: 'right' }} />
          {/* <NormalText text={`${TextFormatter.formatCurrency(paymentDetails.cartTotal)}`} style={styles.textDiscount} /> */}
        </Column>
      </Row>

      <PrimaryButton title='Đặt hàng' onPress={() => {

        const orderInfo = {
          deliveryMethod: cartState.deliveryMethod === DeliveryMethod.PICK_UP.value ? DeliveryMethod.PICK_UP.value : DeliveryMethod.DELIVERY.value,
          fulfillmentDateTime: timeInfo?.fulfillmentDateTime || new Date().toISOString(),
          totalPrice: paymentDetails.paymentTotal,
          note,
          paymentMethod: PaymentMethod.COD.value
        }

        // Cập nhật state
        CartManager.updateOrderInfo(cartDispatch, orderInfo)

        // Gửi request tạo đơn hàng bằng dữ liệu mới (kết hợp state cũ + orderInfo mới)
        const body = { ...cartState, ...orderInfo }
        CartManager.updateOrderInfo(cartDispatch, body)
        const missingFields = CartManager.checkValid(body)
        if (missingFields) {
          Alert.alert('Cảnh báo', `Thiếu thông tin: ${missingFields.join(', ')}`)
          // Toaster.show(`Thiếu thông tin: ${missingFields.join(', ')}`);
          return
        }
        showDialog()

      }}
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
    backgroundColor: colors.fbBg,
    flex: 1,
    gap: 16,
  },
  containerItem: {
    marginBottom: GLOBAL_KEYS.PADDING_SMALL,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white
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
