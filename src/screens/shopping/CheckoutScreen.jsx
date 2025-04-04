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
  NormalInput,
  NormalLoading,
  NormalText,
  PrimaryButton,
  Row,
  TitleText,
} from '../../components';
import LabelInput from '../../components/inputs/LabelInput';
import {
  DeliveryMethod,
  GLOBAL_KEYS,
  PaymentMethod,
  colors,
} from '../../constants';
import { useAppContext } from '../../context/appContext';
import {
  BottomGraph,
  MainGraph,
  OrderGraph,
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
} from '../../utils';
import { color } from '@rneui/base';

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
  const { cartState, cartDispatch, setUpdateOrderMessage, awaitingPayments, setAwaitingPayments } = useAppContext();
  const [timeInfo, setTimeInfo] = React.useState({
    selectedDay: 'Hôm nay',
    selectedTime: 'Sớm nhất có thể',
  });

  const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm cần xóa

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

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

  const handleSelectPaymentMethod = method => {
    setSelectedPaymentMethod(method);
  };

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
              <Column
                style={{
                  gap: 8,
                  paddingVertical: 16,
                  backgroundColor: colors.white,
                  marginVertical: 8,
                }}>
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
                  leftTextStyle={{
                    color: colors.primary,
                    fontWeight: '700',
                    fontSize: 16,
                  }}
                  rightTextStyle={{ color: colors.primary }}
                  onRightPress={() => setDialogShippingMethodVisible(true)}
                />

                {cartState?.deliveryMethod === DeliveryMethod.PICK_UP.value && (
                  <StoreAddress
                    storeInfo={cartState?.storeInfo}
                    chooseMerchant={() => {
                      navigation.navigate(BottomGraph.MerchantScreen, {
                        isUpdateOrderInfo: true,
                        fromCheckout: true,
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

                {cartState.deliveryMethod === DeliveryMethod.PICK_UP.value && (
                  <>
                    <TimeSection
                      timeInfo={timeInfo}
                      showDialog={() => setDialogSelectTimeVisible(true)}
                      cartState={cartState}
                      style={{ flex: 1 }}
                    />
                  </>
                )}
              </Column>

              <TitleText
                text="Sản phẩm"
                style={{
                  color: colors.primary,
                  padding: 16,
                  backgroundColor: colors.white,
                }}
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
                selectedPaymentMethod={selectedPaymentMethod}
                handlePaymentSelection={handleSelectPaymentMethod}
                onSelectVoucher={() =>
                  navigation.navigate(VoucherGraph.MyVouchersScreen, {
                    isUpdateOrderInfo: true,
                  })
                }
              />

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
              message: 'Đặt hàng thành công',
              status: response?.data?.status,
            };
            await AppAsyncStorage.addToActiveOrders(newActiveOrder);
            setUpdateOrderMessage(newActiveOrder);

            await socketService.joinOrder2(
              response?.data?._id,
              response?.data?.status,
              data => {
                setUpdateOrderMessage({
                  visible: data.status !== 'waitingPayment',
                  orderId: data.orderId,
                  message: data.message,
                  status: data.status,
                });
              },
            );

            console.log('order data =', JSON.stringify(response, null, 2));
            await CartManager.clearOrderItems(cartDispatch);

            if (response?.data?.status === 'awaitingPayment') {
              const paymentParams = {
                orderId: response.data._id,
                totalPrice: response.data.totalPrice,
              };
              console.log('paymentParams', paymentParams)
              await AppAsyncStorage.storeData(
                AppAsyncStorage.STORAGE_KEYS.awaitingPayments, paymentParams);

              setAwaitingPayments(paymentParams)

              if (selectedPaymentMethod?.value === 'PayOs') {
                navigation.navigate(ShoppingGraph.PayOsScreen, paymentParams);
              }
              // else if (selectedPaymentMethod?.value === 'zalopay') {
              //   navigation.navigate(ShoppingGraph.Zalopayscreen, paymentParams);
              // }
            } else {
              navigation.reset({
                index: 1,
                routes: [
                  { name: MainGraph.graphName },
                  {
                    name: OrderGraph.OrderDetailScreen,
                    params: { orderId: response?.data?._id },
                  },
                ],
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
            consigneeName: data.name,
            consigneePhone: data.phoneNumber,
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
  const [nameError, setNameError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');

  const validate = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Vui lòng nhập tên người nhận!');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!phoneNumber.trim()) {
      setPhoneError('Vui lòng nhập số điện thoại!');
      isValid = false;
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      setPhoneError('Số điện thoại phải có đúng 10 chữ số!');
      isValid = false;
    } else {
      setPhoneError('');
    }

    return isValid;
  };

  const handleConfirm = () => {
    if (validate()) {
      onConfirm({ name, phoneNumber });
      setName('');
      setPhoneNumber('');
      setNameError('');
      setPhoneError('');
    }
  };

  return (
    <DialogBasic
      titleStyle={{ color: colors.black }}
      title={'Thay đổi thông tin người nhận'}
      isVisible={visible}
      onHide={onHide}
      style={{ backgroundColor: colors.white }}>
      <Column style={styles.content}>

        <NormalInput
          label="Tên người nhận" required
          value={name}
          setValue={setName}
          placeholder="Nguyễn Văn A"
          invalidMessage={nameError}
        />


        <NormalInput
          label="Số điện thoại" required
          placeholder="0123456789"
          value={phoneNumber}
          setValue={setPhoneNumber}
          invalidMessage={phoneError}
        />

        <PrimaryButton title={'Cập nhật'} onPress={handleConfirm} />
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
      style={[
        {
          gap: 8,
          backgroundColor: colors.white,
          paddingHorizontal: 16,
          marginBottom: 8,
        },
        style,
      ]}>
      {timeInfo && timeInfo.fulfillmentDateTime ? (
        <>
          <TitleText
            style={{ color: colors.green500 }}
            text={`${timeInfo.selectedTime}`}
          />
          <NormalText text={`${timeInfo.selectedDay}`} />
          {isToday && isEarliest && (
            <TitleText text="15-30 phút" style={{ color: colors.green500 }} />
          )}
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

const ShippingAddress = ({
  deliveryMethod,
  shippingAddressInfo,
  chooseUserAddress,
}) => {
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

const RecipientInfo = ({
  cartState,
  cartDispatch,
  onChangeRecipientInfo,
  style,
}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const userData = await AppAsyncStorage.readData('user');
        if (userData) {
          setUser(userData);
          if (!cartState?.consigneeName) {
            CartManager.updateOrderInfo(cartDispatch, {
              consigneeName: `${userData.firstName} ${userData.lastName}`,
              consigneePhone: userData.phoneNumber,
            });
          }
        }
      } catch (error) {
        console.error(
          'Lỗi khi lấy thông tin người dùng từ AsyncStorage:',
          error,
        );
      }
    })();
  }, []);

  if (!user) return null; // 🔥 Không render gì nếu chưa có user

  const consigneeName =
    cartState?.consigneeName || `${user.firstName} ${user.lastName}`;
  const consigneePhone = cartState?.consigneePhone || user.phoneNumber;

  return (
    <Pressable
      onPress={onChangeRecipientInfo}
      style={[
        {
          gap: 8,
          backgroundColor: colors.white,
          paddingHorizontal: 16,
          marginBottom: 8,
          borderRightColor: colors.gray200,
          borderRightWidth: 1,
        },
        style,
      ]}>
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

const PaymentDetailsView = ({
  onSelectVoucher,
  cartState,
  cartDispatch,
  handlePaymentSelection,
}) => {
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
        leftTextStyle={{
          color: colors.primary,
          fontWeight: 'bold',
          fontSize: 16,
          paddingVertical: 8,
        }}
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

      <PaymentMethodView
        cartDispatch={cartDispatch}
        cartState={cartState}
        onSelect={handlePaymentSelection}
      />
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
  // {
  //   name: 'ZaloPay',
  //   image: require('../../assets/images/logo_zalopay.png'),
  //   value: 'zalopay',
  //   paymentMethod: PaymentMethod.ONLINE.value,
  // },
];
const PaymentMethodView = ({ cartDispatch, cartState, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Xác định phương thức thanh toán mặc định dựa trên phương thức giao hàng
  useEffect(() => {
    const updatePaymentMethod = async () => {
      let selectedPayment;

      if (cartState.deliveryMethod === DeliveryMethod.PICK_UP.value) {
        selectedPayment = paymentMethods.find(m => m.value === 'PayOs');
      } else {
        selectedPayment = paymentMethods.find(m => m.value === 'cash');
      }

      setSelectedMethod(selectedPayment);

      // Cập nhật thông tin đơn hàng
      await CartManager.updateOrderInfo(cartDispatch, {
        paymentMethod: selectedPayment.paymentMethod,
      });
    };

    updatePaymentMethod();
  }, [cartState.deliveryMethod]);

  const handleSelectMethod = async (method, disabled) => {
    if (!disabled) {
      setSelectedMethod(method);
      await CartManager.updateOrderInfo(cartDispatch, {
        paymentMethod: method.paymentMethod,
      });
      setIsVisible(false);

      // Gửi giá trị ra ngoài component
      if (onSelect) {
        onSelect(method);
      }
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
        {selectedMethod && (
          <>
            <Image source={selectedMethod.image} style={styles.image} />
            <NormalText text={selectedMethod.name} />
          </>
        )}
        <Icon source="chevron-down" size={24} color={colors.gray700} />
      </TouchableOpacity>

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
                    selectedMethod?.value === method.value
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
        backgroundColor: colors.white,
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        justifyContent: 'flex-end',
        borderTopColor: colors.gray200,
        borderTopWidth: 1
      }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <Column>
          <TitleText
            style={{ fontSize: 18, color: colors.pink500, fontWeight: '700' }}
            text={`${TextFormatter.formatCurrency(
              paymentDetails.paymentTotal,
            )}`} />
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

        <Pressable
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
          style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20 }}
        >
          <TitleText
            text={`Đặt hàng`}
            style={{ color: colors.white, textAlign: 'right', fontSize: 14 }}
          />

        </Pressable>



      </Row>

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
    gap: 12,
    backgroundColor: colors.white,
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
