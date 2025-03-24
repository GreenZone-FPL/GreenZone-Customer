import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, RadioButton } from 'react-native-paper';
import { createOrder } from '../../axios/';
import {
  ActionDialog,
  Column,
  DeliveryMethodSheet,
  DialogBasic,
  DialogSelectTime,
  DualTextRow,
  FlatInput,
  HorizontalProductItem,
  LightStatusBar,
  NormalHeader,
  NormalLoading,
  NormalText,
  PrimaryButton,
  Row,
  TitleText,
} from '../../components';
import {
  DeliveryMethod,
  GLOBAL_KEYS,
  OrderStatus,
  PaymentMethod,
  colors,
} from '../../constants';
import { useAppContext } from '../../context/appContext';
import {
  BottomGraph,
  ShoppingGraph,
  UserGraph,
  VoucherGraph,
} from '../../layouts/graphs';
import socketService from '../../services/socketService';
import {
  AppAsyncStorage,
  CartManager,
  TextFormatter,
  Toaster,
  fetchUserLocation,
  LocationManager,
} from '../../utils';
import { CartActionTypes } from '../../reducers';

const { width } = Dimensions.get('window');
const CheckoutScreen = ({ navigation }) => {
  const [dialogCreateOrderVisible, setDialogCreateOrderVisible] =
    useState(false);

  const [dialogRecipientInforVisible, setDialogRecipientInfoVisible] =
    useState(false);
  const [dialogShippingMethodVisible, setDialogShippingMethodVisible] =
    useState(false);
  const [dialogSelecTimeVisible, setDialogSelectTimeVisible] = useState(false);
  const [actionDialogVisible, setActionDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [note, setNote] = useState('');
  const { cartState, cartDispatch, setUpdateOrderMessage } = useAppContext();
  const [timeInfo, setTimeInfo] = React.useState({
    selectedDay: 'Hôm nay',
    selectedTime: 'Sớm nhất có thể',
  });

  const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm cần xóa

  useEffect(() => {
    const initSocket = async () => {
      await socketService.initialize();
    };
    initSocket();

    return () => { };
  }, []);
  useEffect(() => {
    if (timeInfo?.fulfillmentDateTime) {
      const fulfillmentTimeISO = new Date(
        timeInfo.fulfillmentDateTime,
      ).toISOString();
      const nowISO = new Date().toISOString();

      if (fulfillmentTimeISO < nowISO) {
        setTimeInfo({ selectedDay: 'Hôm nay', selectedTime: 'Sớm nhất có thể' });
      }
    }
  }, [timeInfo?.fulfillmentDateTime]);

  // Mở dialog với sản phẩm cần xóa
  const confirmDelete = product => {
    setSelectedProduct(product);
    setActionDialogVisible(true);
  };

  // Xóa sản phẩm sau khi xác nhận
  const deleteProduct = async id => {
    await CartManager.removeFromCart(id, cartDispatch);
    setActionDialogVisible(false);
  };

  useEffect(() => {
    fetchUserLocation(setCurrentLocation, setLoading);
  }, []);

  if (cartState.orderItems.length === 0) {
    return <EmptyView goBack={() => navigation.goBack()} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Xác nhận đơn hàng"
        onLeftPress={() => navigation.goBack()}
      />

      <>
        {loading ? (
          <NormalLoading visible={loading} message="Đang tải Giỏ hàng..." />
        ) : (
          <>
            <ScrollView style={styles.containerContent}>
              <Column style={{gap: 8, paddingVertical: 16, backgroundColor: colors.white, marginVertical: 8}}>
                <DualTextRow
                  style={{
                    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
                    marginTop: 8,
                    marginBottom: 0,
                    backgroundColor: colors.white,
                  }}
                  leftText={
                    cartState.deliveryMethod === DeliveryMethod.PICK_UP.value
                      ? DeliveryMethod.PICK_UP.label
                      : DeliveryMethod.DELIVERY.label
                  }
                  rightText={'Thay đổi'}
                  leftTextStyle={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}
                  rightTextStyle={{ color: colors.primary }}
                  onRightPress={() => setDialogShippingMethodVisible(true)}
                />

                {cartState?.deliveryMethod === DeliveryMethod.DELIVERY.value ? (
                  <LocationManager cartState={cartState} />
                ) : (
                  <StoreAddress
                    storeInfo={cartState?.storeInfo}
                    chooseMerchant={() => {
                      navigation.navigate(BottomGraph.MerchantScreen, {
                        isUpdateOrderInfo: true,
                      });
                    }}
                  />
                )}

                {cartState.deliveryMethod === DeliveryMethod.DELIVERY.value && (
                  <>
                    <ShippingAddress
                      deliveryMethod={cartState?.deliveryMethod}
                      shippingAddressInfo={cartState?.shippingAddressInfo}
                      chooseUserAddress={() => {
                        navigation.navigate(UserGraph.SelectAddressScreen, {
                          isUpdateOrderInfo: true,
                        });
                      }}
                    />
                    <Row style={{ gap: 0 }}>

                      {cartState?.shippingAddressInfo && (
                        <RecipientInfo
                          cartDispatch={cartDispatch}
                          cartState={cartState}
                          onChangeRecipientInfo={() =>
                            setDialogRecipientInfoVisible(true)
                          }
                          style={{ flex: 1 }}
                        />
                      )}


                      <TimeSection
                        timeInfo={timeInfo}
                        showDialog={() => setDialogSelectTimeVisible(true)}
                        cartState={cartState}
                        style={{ flex: 1 }}
                      />
                    </Row>


                  </>
                )}
              </Column>







              <TitleText
                text="Sản phẩm"
                style={{ color: colors.primary, padding: 16, backgroundColor: colors.white }}
              />


              {cartState.orderItems.length > 0 ? (
                <ProductsInfo
                  confirmDelete={confirmDelete}
                  cartDispatch={cartDispatch}
                  onEditItem={item =>
                    navigation.navigate(ShoppingGraph.EditCartItemScreen, {
                      updateItem: item,
                    })
                  }
                  cart={cartState.orderItems}
                />
              ) : null}

              <PaymentDetailsView
                cartDispatch={cartDispatch}
                cartState={cartState}
                onSelectVoucher={() =>
                  navigation.navigate(VoucherGraph.MyVouchersScreen, {
                    isUpdateOrderInfo: true,
                  })
                }
              />
              <Column style={{ gap: 16, marginHorizontal: 16 }}>
                <Button
                  title="Log cartState"
                  onPress={() =>
                    console.log(
                      'cartState =',
                      JSON.stringify(cartState, null, 2),
                    )
                  }
                />

                <Button
                  title="Clear cartState"
                  onPress={() => CartManager.clearCartState(cartDispatch)}
                />


                <Button
                  title="Xóa hết sản phẩm"
                  onPress={() => CartManager.clearOrderItems(cartDispatch)}
                />

                {/* <Button
                  title="Clear activeOrder"
                  onPress={async () =>
                    await AppAsyncStorage.storeData(
                      AppAsyncStorage.STORAGE_KEYS.activeOrders,
                      [],
                    )
                  }
                />

                <Button
                  title="Read activeOrder"
                  onPress={async () => await AppAsyncStorage.getActiveOrders()}
                /> */}
              </Column>
            </ScrollView>

            <Footer
              timeInfo={timeInfo}
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
        onConfirm={data => {
          console.log('timeInfo', data);
          setTimeInfo(data);
          setDialogSelectTimeVisible(false);
        }}
      />

      <ActionDialog
        visible={dialogCreateOrderVisible}
        title="Xác nhận"
        content={`Bạn xác nhận đặt đơn hàng?`}
        cancelText="Hủy"
        approveText="Đồng ý"
        onCancel={() => setDialogCreateOrderVisible(false)}
        onApprove={async () => {
          try {
            let response = null;
            if (cartState.deliveryMethod === DeliveryMethod.PICK_UP.value) {
              const pickupOrder = CartManager.setUpPickupOrder(cartState);
              console.log(
                'pickupOrder =',
                JSON.stringify(pickupOrder, null, 2),
              );
              response = await createOrder(pickupOrder);
            } else if (
              cartState.deliveryMethod === DeliveryMethod.DELIVERY.value
            ) {
              const deliveryOrder = CartManager.setupDeliveryOrder(cartState);
              console.log(
                'deliveryOrder =',
                JSON.stringify(deliveryOrder, null, 2),
              );

              response = await createOrder(deliveryOrder);
            }
            const newActiveOrder = {
              visible: true,
              orderId: response?.data?._id,
              oldStatus: response?.data?.status,
              message: 'Đặt hàng thành công',
              status: response?.data?.status,
            };
            await AppAsyncStorage.addToActiveOrders(newActiveOrder);
            setUpdateOrderMessage(newActiveOrder);

            await socketService.joinOrder2(
              response?.data?._id,
              response?.data?.status,
              data => {
                setUpdateOrderMessage(prev => ({
                  visible: true,
                  orderId: data.orderId,
                  oldStatus: prev.status,
                  message: data.message,
                  status: data.status,
                }));
              },
            );

            console.log('order data =', JSON.stringify(response, null, 2));

            if (response?.data?.status === 'awaitingPayment') {
              navigation.navigate(ShoppingGraph.PayOsScreen, {
                orderId: response.data._id,
                totalPrice: response.data.totalPrice,
              });
            } else {
              navigation.navigate(ShoppingGraph.OrderSuccessScreen, {
                order: response,
              });
            }
          } catch (error) {
            console.log('error', error);
            Toaster.show('Đã xảy ra lỗi, vui lòng thử lại');
          } finally {
            setDialogCreateOrderVisible(false);
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
        onConfirm={data => {
          CartManager.updateOrderInfo(cartDispatch, {
            shippingAddressInfo: {
              ...cartState?.shippingAddressInfo,
              consigneeName: data.name,
              consigneePhone: data.phoneNumber,
            },
          });
          setDialogRecipientInfoVisible(false);
        }}
      />

      <DeliveryMethodSheet
        visible={dialogShippingMethodVisible}
        selectedOption={
          cartState.deliveryMethod === DeliveryMethod.PICK_UP.value
            ? DeliveryMethod.PICK_UP
            : DeliveryMethod.DELIVERY
        }
        onClose={() => setDialogShippingMethodVisible(false)}
        onSelect={async option => {
          console.log('option', option);
          await CartManager.updateOrderInfo(cartDispatch, {
            deliveryMethod: option.value,
          });
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

      <NormalText text="Giỏ hàng của bạn đang trống" />
    </View>
  );
};

const DialogRecipientInfo = ({ visible, onHide, onConfirm }) => {
  const [name, setName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');

  return (
    <DialogBasic
      title={'Thay đổi thông tin người nhận '}
      isVisible={visible}
      onHide={onHide}
      style={{ backgroundColor: colors.fbBg }}>
      <Column style={styles.content}>
        <FlatInput label={'Tên người nhận'} value={name} setValue={setName} />

        <FlatInput
          label={'Số điện thoại'}
          value={phoneNumber}
          setValue={setPhoneNumber}
        />

        <PrimaryButton
          title={'Cập nhật'}
          onPress={() => {
            onConfirm({ name, phoneNumber });
            setName('');
            setPhoneNumber('');
          }}
        />
      </Column>
    </DialogBasic>
  );
};

const TimeSection = ({ timeInfo, showDialog, style }) => {
  const isToday = timeInfo?.selectedDay === 'Hôm nay';
  const isEarliest = timeInfo?.selectedTime === 'Sớm nhất có thể';

  return (
    <Pressable
      onPress={showDialog}
      style={[{ gap: 8, backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 8 }, style]}>
      {timeInfo && timeInfo.fulfillmentDateTime ? (
        <>
          {isToday && isEarliest && (
            <TitleText text="15-30 phút" style={{ color: colors.green500 }} />
          )}
          <NormalText text={`${timeInfo.selectedDay} - ${timeInfo.selectedTime}`} />
        </>
      ) : (
        <>
          <TitleText text="15-30 phút" style={{ color: colors.green500 }} />
          <NormalText text="Sớm nhất có thể" />
        </>
      )}
    </Pressable>
  );
};







const ShippingAddress = ({ deliveryMethod, shippingAddressInfo, chooseUserAddress }) => {
  // console.log("Dữ liệu shippingAddressInfo:", JSON.stringify(shippingAddressInfo, null, 2));


  return (
    <View style={[styles.containerItem, { marginBottom: 0 }]}>
      <DualTextRow
        style={{ marginVertical: 0, marginBottom: 8 }}
        leftText="Địa chỉ nhận hàng"
        leftTextStyle={{ fontWeight: '600' }}
        rightText="Thay đổi"
        rightTextStyle={{ color: colors.primary }}
        onRightPress={chooseUserAddress}
      />
      {deliveryMethod !== DeliveryMethod.PICK_UP.value &&
        shippingAddressInfo ? (
        <>
          {shippingAddressInfo.description && (
            <NormalText
              text={shippingAddressInfo.description}
              style={{ lineHeight: 20, color: colors.black }}
            />
          )}
          {shippingAddressInfo.location && (
            <NormalText
              text={shippingAddressInfo.location}
              style={{ lineHeight: 20, color: colors.black }}
            />
          )}
        </>
      ) : (
        <NormalText
          text="Vui lòng chọn địa chỉ giao hàng"
          style={{ color: colors.orange700 }}
        />
      )}
    </View>
  );
};

const StoreAddress = ({ storeInfo, chooseMerchant }) => {
  return (
    <View style={styles.containerItem}>
      <DualTextRow
        style={{ marginVertical: 0, marginBottom: 8 }}
        leftText="Địa chỉ cửa hàng"
        leftTextStyle={{ fontWeight: '600' }}
        rightText="Thay đổi"
        rightTextStyle={{ color: colors.primary }}
        onRightPress={chooseMerchant}
      />
      {storeInfo?.storeName && storeInfo?.storeAddress ? (
        <>
          <TitleText
            text={storeInfo?.storeName}
            style={{ marginBottom: 8, color: colors.green500 }}
          />
          <NormalText text={storeInfo?.storeAddress} />
        </>
      ) : (
        <NormalText
          text="Vui lòng chọn địa chỉ cửa hàng"
          style={{ color: colors.orange700 }}
        />
      )}
    </View>
  );
};

const RecipientInfo = ({ cartState, cartDispatch, onChangeRecipientInfo, style }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const userData = await AppAsyncStorage.readData("user");
        if (userData) {
          setUser(userData);
          if (!cartState?.consigneeName) {
            CartManager.updateOrderInfo(cartDispatch, {
              consigneeName: `${userData.lastName} ${userData.firstName}`,
              consigneePhone: userData.phoneNumber,
            })
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng từ AsyncStorage:", error);
      }
    })();
  }, []);

  if (!user) return null; // 🔥 Không render gì nếu chưa có user

  const consigneeName = cartState?.consigneeName || `${user.lastName} ${user.firstName}`;
  const consigneePhone = cartState?.consigneePhone || user.phoneNumber;

  return (
    <Pressable
      onPress={onChangeRecipientInfo}
      style={[{ gap: 8, backgroundColor: colors.white, paddingVertical: 8, paddingHorizontal: 16, marginBottom: 8, borderRightColor: colors.gray200, borderRightWidth: 1 }, style]}>

      <NormalText text={`${consigneeName}`} style={{}} />
      <NormalText text={`${consigneePhone}`} style={{ color: colors.gray700 }} />
    </Pressable>
  );
};

const ProductsInfo = ({ onEditItem, cart, cartDispatch, confirmDelete }) => (
  <FlatList
    data={cart}
    keyExtractor={item => item.itemId.toString()}
    renderItem={({ item }) => (
      <Pressable onPress={() => onEditItem(item)}>
        <HorizontalProductItem
          confirmDelete={() => confirmDelete(item)}
          onDelete={async () => {
            await CartManager.removeFromCart(item.itemId, cartDispatch);
          }}
          containerStyle={{ paddingHorizontal: 16 }}
          item={item}
          enableAction={false}
          enableDelete={true}
        />
      </Pressable>
    )}
    contentContainerStyle={{ gap: 0, marginHorizontal: 0 }}
    nestedScrollEnabled={true}
    scrollEnabled={false}
  />
);

const PaymentDetailsView = ({ onSelectVoucher, cartState, cartDispatch }) => {
  const paymentDetails = CartManager.getPaymentDetails(cartState);

  return (
    <View
      style={[
        styles.containerItem,
        {
          backgroundColor: colors.gray200,
          paddingHorizontal: 0,
          gap: 1,
          paddingVertical: 0,
        },
      ]}>
      <DualTextRow
        style={{
          paddingVertical: 8,
          marginVertical: 0,
          paddingHorizontal: 16,
          backgroundColor: colors.white,
        }}
        leftText="Chi tiết thanh toán"
        leftTextStyle={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}
      />

      <DualTextRow
        style={{
          paddingVertical: 12,
          marginVertical: 0,
          backgroundColor: colors.white,
          paddingHorizontal: 16,
        }}
        leftText={`Tạm tính (${cartState.orderItems.length} sản phẩm)`}
        rightText={`${TextFormatter.formatCurrency(paymentDetails.cartTotal)}`}
      />

      {cartState.deliveryMethod === DeliveryMethod.DELIVERY.value && (
        <DualTextRow
          style={{
            paddingVertical: 12,
            marginVertical: 0,
            backgroundColor: colors.white,
            paddingHorizontal: 16,
          }}
          leftText="Phí giao hàng"
          rightText={`${TextFormatter.formatCurrency(
            paymentDetails.deliveryAmount,
          )}`}
        />
      )}

      <DualTextRow
        style={{
          paddingVertical: 12,
          marginVertical: 0,
          backgroundColor: colors.white,
          paddingHorizontal: 16,
        }}
        leftText={
          cartState.voucher
            ? `${cartState?.voucherInfo?.code}`
            : 'Chọn khuyến mãi'
        }
        leftTextStyle={{
          color: cartState.voucher ? colors.primary : colors.orange700,
          fontWeight: '500',
        }}
        rightText={
          paymentDetails.voucherAmount === 0
            ? ''
            : `- ${TextFormatter.formatCurrency(paymentDetails.voucherAmount)}`
        }
        rightTextStyle={{ color: colors.primary }}
        onLeftPress={() => onSelectVoucher()}
      />

      <DualTextRow
        style={{
          paddingVertical: 12,
          marginVertical: 0,
          backgroundColor: colors.white,
          paddingHorizontal: 16,
        }}
        leftText="Tổng tiền"
        rightText={`${TextFormatter.formatCurrency(
          paymentDetails.paymentTotal,
        )}`}
        leftTextStyle={{ color: colors.black, fontWeight: '500', fontSize: 14 }}
        rightTextStyle={{
          fontWeight: '700',
          color: colors.primary,
          fontSize: 14,
        }}
      />

      <PaymentMethodView cartDispatch={cartDispatch} cartState={cartState} />
    </View>
  );
};

const paymentMethods = [
  {
    name: 'Thanh toán khi nhận hàng',
    image: require('../../assets/images/logo_vnd.png'),
    value: 'cash',
    paymentMethod: PaymentMethod.COD.value,
  },
  {
    name: 'PayOs',
    image: require('../../assets/images/logo_payos.png'),
    value: 'PayOs',
    paymentMethod: PaymentMethod.ONLINE.value,
  },
  {
    name: 'ZaloPay',
    image: require('../../assets/images/logo_zalopay.png'),
    value: 'zalopay',
    paymentMethod: PaymentMethod.ONLINE.value,
  },
  {
    name: 'Thanh toán bằng thẻ',
    image: require('../../assets/images/logo_card.png'),
    value: 'Card',
    paymentMethod: PaymentMethod.ONLINE.value,
  },
];
const PaymentMethodView = ({ cartDispatch, cartState }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);

  const handleSelectMethod = (method, disabled) => {
    if (!disabled) {
      setSelectedMethod(method);
      CartManager.updateOrderInfo(cartDispatch, {
        paymentMethod: method.paymentMethod,
      });
      setIsVisible(false);
    } else {
      Toaster.show(
        'Phương thức thanh toán không khả dụng với đơn Tự đến lấy tại cửa hàng',
      );
    }
  };

  return (
    <Row
      style={{
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: colors.white,
        paddingVertical: 8,
      }}>
      <NormalText text="Phương thức thanh toán" />

      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
        onPress={() => setIsVisible(true)}>
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
        title="Chọn phương thức thanh toán">
        <Column style={{ marginHorizontal: 16 }}>
          {paymentMethods.map(method => {
            const disabled =
              cartState.deliveryMethod === DeliveryMethod.PICK_UP.value &&
              method.paymentMethod === PaymentMethod.COD.value;

            return (
              <TouchableOpacity
                key={method.value}
                onPress={() => handleSelectMethod(method, disabled)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                }}>
                <RadioButton
                  disabled={disabled}
                  value={method.value}
                  status={
                    selectedMethod.name === method.name
                      ? 'checked'
                      : 'unchecked'
                  }
                  color={colors.primary}
                  onPress={() => handleSelectMethod(method, disabled)}
                />
                <Image source={method.image} style={styles.image} />
                <Text style={{ color: colors.gray700, marginLeft: 8 }}>
                  {method.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Column>
      </DialogBasic>
    </Row>
  );
};

const Footer = ({ cartState, showDialog, timeInfo, note, cartDispatch }) => {
  const paymentDetails = CartManager.getPaymentDetails(cartState);

  return (
    <View
      style={{
        backgroundColor: colors.fbBg,
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        justifyContent: 'flex-end',
      }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <Column>
          <TitleText text="Tổng cộng" />
          <NormalText text={`${cartState.orderItems.length} sản phẩm`} />
          {cartState?.voucher && (
            <NormalText
              text={`Bạn tiết kiệm ${TextFormatter.formatCurrency(
                paymentDetails.voucherAmount,
              )}`}
              style={{ color: colors.primary, fontWeight: '500' }}
            />
          )}
        </Column>

        <Column>
          <TitleText
            text={`${TextFormatter.formatCurrency(
              paymentDetails.paymentTotal,
            )}`}
            style={{ color: colors.red900, textAlign: 'right', fontSize: 16 }}
          />
          {/* <NormalText text={`${TextFormatter.formatCurrency(paymentDetails.cartTotal)}`} style={styles.textDiscount} /> */}
        </Column>
      </Row>

      <PrimaryButton
        title="Đặt hàng"
        onPress={async () => {
          const orderInfo = {
            fulfillmentDateTime:
              timeInfo?.fulfillmentDateTime || new Date().toISOString(),
            totalPrice: paymentDetails.paymentTotal,
            note,
          };
          const newCart = await CartManager.updateOrderInfo(
            cartDispatch,
            orderInfo,
          );

          const missingFields = CartManager.checkValid(newCart);
          console.log('missingFields', missingFields);
          if (missingFields) {
            Alert.alert('Thiếu thông tin', `${missingFields.join(', ')}`);
            return;
          }
          showDialog();
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
    backgroundColor: colors.white,
  },

  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  content: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.transparent,
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
});
