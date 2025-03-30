import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler
} from 'react-native';
import {Icon, PaperProvider} from 'react-native-paper';
import {ActionDialog, PrimaryButton, StatusText} from '../../components';
import {getOrderDetail, updateOrderStatus} from '../../axios';
import {
  Column,
  DualTextRow,
  HorizontalProductItem,
  LightStatusBar,
  NormalHeader,
  NormalLoading,
  NormalText,
  Row,
} from '../../components';
import {GLOBAL_KEYS, OrderStatus, colors} from '../../constants';
import {ShoppingGraph} from '../../layouts/graphs';
import {useAppContext} from '../../context/appContext';
import {Toaster} from '../../utils';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const OrderDetailScreen = props => {
  const {navigation, route} = props;
  const {orderId} = route.params;
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionDialogVisible, setActionDialogVisible] = useState(false);
  const [paymentDialogVisible, setPaymentDialogVisible] = useState(false);

  const {updateOrderMessage} = useAppContext();
  // console.log('updateOrderMessage = ', JSON.stringify(updateOrderMessage, null, 2))

  const fetchOrderDetail = async () => {
    try {
      const response = await getOrderDetail(orderId);
      // console.log('detail', JSON.stringify(response, null, 3));
      setOrderDetail(response);
    } catch (error) {
      console.error('error', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrderDetail();
  }, [orderId, updateOrderMessage]);
  // ✅ Đảm bảo useCallback không thay đổi giữa các lần render
  const backAction = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'OrderHistoryScreen' }],
      });
    }
    return true; // Chặn hành vi mặc định
  }, [navigation]);

// ✅ Xử lý nút Back vật lý
useFocusEffect(
  useCallback(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack(); // Quay lại nếu có màn hình trước
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'OrderHistoryScreen' }], // Nếu không, quay về lịch sử đơn hàng
        });
      }
      return true; // Chặn hành vi mặc định
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup khi rời khỏi màn hình
  }, [navigation])
);

  if (loading) {
    return (
      <View style={styles.container}>
        <LightStatusBar />
        <NormalHeader
          title="Chi tiết đơn hàng"
          onLeftPress={backAction} // Dùng chung logic Back
        />
        <NormalLoading visible={true} />
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <LightStatusBar />
        <NormalHeader
          title="Chi tiết đơn hàng"
          onLeftPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'OrderHistoryScreen' }],
              });
            }
          }}
        />

        {orderDetail && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.containerContent}>
            <Row
              style={{
                paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
                paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
                marginBottom: GLOBAL_KEYS.GAP_SMALL,
                justifyContent: 'space-between',
                flex: 1,
                backgroundColor: colors.white,
              }}>
              <Text
                style={{
                  fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
                  color: colors.black,
                  flex: 1,
                  fontWeight: '500',
                }}>
                {orderDetail?.deliveryMethod === 'pickup'
                  ? 'Tự đến lấy hàng'
                  : 'Giao hàng tận nơi'}
              </Text>

              <StatusText status={orderDetail.status} />
            </Row>

            {[
              'shippingOrder',
              'failedDelivery',
              'readyForPickup',
              'completed',
            ].includes(orderDetail.status) && (
              <ShipperInfo
                messageClick={() =>
                  navigation.navigate(ShoppingGraph.ChatScreen)
                }
                shipper={orderDetail.shipper}
              />
            )}

            {orderDetail.store && <MerchantInfo store={orderDetail.store} />}

            <RecipientInfo detail={orderDetail} />

            {orderDetail.orderItems && (
              <ProductsInfo orderItems={orderDetail.orderItems} />
            )}

            <PaymentDetails
              detail={orderDetail}
              _id={orderDetail._id}
              shippingFee={orderDetail.shippingFee}
              voucher={orderDetail.voucher}
              paymentMethod={orderDetail.paymentMethod}
              orderItems={orderDetail.orderItems}
              totalPrice={orderDetail.totalPrice}
              status={orderDetail.status}
              createdAt={orderDetail.createdAt}
            />

            <Row style={{flex: 1}}>
              {orderDetail.status === OrderStatus.AWAITING_PAYMENT.value && (
                <PrimaryButton
                  titleStyle={{fontSize: 12}}
                  style={{marginHorizontal: 16, flex: 1}}
                  title="Thanh toán"
                  onPress={() => {
                    setPaymentDialogVisible(true);
                  }}
                />
              )}

              {(orderDetail.status === OrderStatus.PENDING_CONFIRMATION.value ||
                orderDetail.status === OrderStatus.AWAITING_PAYMENT.value) && (
                <Pressable
                  style={[styles.button, {flex: 1}]}
                  onPress={() => setActionDialogVisible(true)}>
                  <Text style={styles.normalText}>Hủy đơn hàng</Text>
                </Pressable>
              )}
            </Row>
          </ScrollView>
        )}

        <ActionDialog
          visible={paymentDialogVisible}
          title={'Thanh toán'}
          content={'Thanh toán đơn hàng này'}
          approveText={'Thanh toán'}
          onCancel={() => setPaymentDialogVisible(false)}
          cancelText={'Đóng'}
          onApprove={() =>
            navigation.navigate(ShoppingGraph.PayOsScreen, {
              orderId: orderDetail._id,
              totalPrice: orderDetail.totalPrice,
            })
          }
        />
        <ActionDialog
          visible={actionDialogVisible}
          title="Xác nhận"
          content={`Bạn có chắc chắn muốn hủy đơn hàng này"?`}
          cancelText="Đóng"
          approveText="Đồng ý"
          onCancel={() => setActionDialogVisible(false)}
          onApprove={async () => {
            try {
              const response = await updateOrderStatus(
                orderDetail._id,
                OrderStatus.CANCELLED.value,
              );

              if (response) {
                Toaster.show('Hủy đơn hàng thành công');
              }
              await fetchOrderDetail();
            } catch (error) {
              console.log('error', error);
            } finally {
              setActionDialogVisible(false);
            }
          }}
        />
      </View>
    </PaperProvider>
  );
};

const ShipperInfo = ({messageClick, shipper}) => {
  console.log('shipper', shipper);
  return (
    <Row
      style={{
        gap: 16,
        padding: 16,
        backgroundColor: colors.white,
        marginBottom: 8,
      }}>
      <Image
        style={{width: 40, height: 40}}
        source={require('../../assets/images/helmet.png')}
      />
      <Column style={{flex: 1}}>
        <NormalText text="Nhân viên giao hàng" style={{fontWeight: '500'}} />
        <Text
          style={{
            fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
            color: colors.yellow700,
            fontWeight: '500',
          }}>
          {shipper?.firstName
            ? `${shipper.firstName} ${shipper.lastName} `
            : 'Đang chuẩn bị ...'}
        </Text>
      </Column>

      {/* <Row style={{ gap: 24 }}>
        <Icon source="phone-outline" color={colors.black} size={20} />
        <Pressable onPress={messageClick}>
          <Icon source="message-outline" color={colors.black} size={20} />
        </Pressable>
      </Row> */}
    </Row>
  );
};

const ProductsInfo = ({orderItems}) => {
  return (
    <View
      style={[
        styles.areaContainer,
        {borderBottomWidth: 0, backgroundColor: colors.white},
      ]}>
      <View style={{marginHorizontal: 16}}>
        <Title title={'Danh sách sản phẩm'} icon="clipboard-list" />
      </View>

      <FlatList
        data={orderItems}
        keyExtractor={item => item.product._id}
        renderItem={({item}) => {
          const formattedItem = {
            productName: item.product.name,
            image: item.product.image,
            variantName: item.product.size,
            price: item.price,
            quantity: item.quantity,
            isVariantDefault: false,
            toppingItems: Array.isArray(item.toppingItems)
              ? item.toppingItems
              : [],
          };

          return (
            <HorizontalProductItem
              containerStyle={{backgroundColor: colors.white}}
              item={formattedItem}
              enableAction={false}
              onAction={() => console.log('Edit product')}
              confirmDelete={() => console.log('Delete product')}
            />
          );
        }}
        contentContainerStyle={{}}
        scrollEnabled={false}
      />
    </View>
  );
};

const MerchantInfo = ({store}) => {
  return (
    <View style={[styles.areaContainer, {padding: 16}]}>
      <Title title="Cửa hàng" icon="store" />
      <Title title={store.name} titleStyle={{color: colors.black}} />
      <Text numberOfLines={2} style={styles.normalText}>
        {[
          store.specificAddress,
          store.ward,
          store.district,
          store.province,
        ].join(' ')}
      </Text>
    </View>
  );
};

const RecipientInfo = ({detail}) => {
  const {
    deliveryMethod,
    owner,
    consigneeName,
    consigneePhone,
    shippingAddress,
  } = detail;

  // Nếu là pickup hoặc các thông tin giao hàng bị null, thì lấy thông tin owner
  const recipientName =
    deliveryMethod === 'pickup' || !consigneeName
      ? `${owner.lastName} ${owner.firstName}`
      : consigneeName;

  const recipientPhone =
    deliveryMethod === 'pickup' || !consigneePhone
      ? owner.phoneNumber
      : consigneePhone;

  const recipientAddress =
    deliveryMethod !== 'pickup' && shippingAddress
      ? shippingAddress
      : 'Không có địa chỉ giao hàng';

  return (
    <View
      style={[
        styles.areaContainer,
        {paddingHorizontal: 16, paddingVertical: 8, gap: 8},
      ]}>
      <Title title="Người nhận" icon="map-marker" />
      <NormalText
        text={[recipientName, recipientPhone].join(' - ')}
        style={{color: colors.black, fontWeight: '500'}}
      />
      {/* Hiển thị địa chỉ nếu có */}
      {deliveryMethod !== 'pickup' && (
        <Text style={styles.normalText}>{recipientAddress}</Text>
      )}

      <DualTextRow
        style={{marginVertical: 0}}
        leftText={`Thời gian mong muốn nhận hàng`}
        rightText={new Date(detail.fulfillmentDateTime).toLocaleString('vi-VN')}
      />
    </View>
  );
};

const Title = ({
  title,
  icon,
  titleStyle,
  iconColor = colors.primary,
  iconSize = GLOBAL_KEYS.ICON_SIZE_DEFAULT,
}) => {
  return (
    <View style={styles.titleContainer}>
      {icon && <Icon source={icon} color={iconColor} size={iconSize} />}

      <Text style={[styles.greenText, titleStyle]}>{title}</Text>
    </View>
  );
};

const PaymentDetails = ({
  detail,
  _id,
  shippingFee,
  voucher,
  paymentMethod,
  orderItems,
  totalPrice,
  status,
  createdAt,
}) => {
  // Tính tổng tiền sản phẩm (chưa bao gồm phí giao hàng và giảm giá)
  const subTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Số tiền giảm giá từ voucher (nếu có)
  const discount = voucher
    ? voucher.discountType === 'percentage'
      ? (subTotal * voucher.discountValue) / 100
      : voucher.discountValue
    : 0;

  // Chọn icon phù hợp với phương thức thanh toán
  const getPaymentIcon = method => {
    switch (method) {
      case 'cod':
        return (
          <Image
            style={{width: 24, height: 24}}
            source={require('../../assets/images/logo_vnd.png')}
          />
        );
      case 'payOs':
        return (
          <Image
            style={{width: 24, height: 24}}
            source={require('../../assets/images/logo_payos.png')}
          />
        );
      case 'zalopay':
        return (
          <Image
            style={{width: 24, height: 24}}
            source={require('../../assets/images/logo_zalopay.png')}
          />
        );
      default:
        return null;
    }
  };

  // Xác định trạng thái thanh toán
  const getPaymentStatus = () => {
    if (status === 'completed') {
      return {text: 'Đã thanh toán', color: colors.primary};
    }
    if (paymentMethod === 'cod') {
      return {text: 'Chưa thanh toán', color: colors.orange700};
    }
    if (status === 'awaitingPayment') {
      return {text: 'Chờ thanh toán', color: colors.pink500};
    }
    if (status === 'cancelled') {
      return {text: 'Chưa thanh toán', color: colors.orange700};
    }
    return {text: 'Đã thanh toán', color: colors.primary};
  };

  const paymentStatus = getPaymentStatus();

  return (
    <View
      style={{
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.white,
      }}>
      <DualTextRow
        leftText="Chi tiết thanh toán"
        leftTextStyle={{
          color: colors.primary,
          fontWeight: 'bold',
          fontSize: 18,
          marginBottom: 8,
        }}
      />
      <OrderId _id={_id} />

      <Row
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 14, color: colors.black, marginRight: 8}}>
          Trạng thái đơn hàng
        </Text>
        <StatusText status={status} />
      </Row>

      <DualTextRow
        leftText={`Tạm tính (${orderItems.length} sản phẩm)`}
        rightText={`${subTotal.toLocaleString()}đ`}
      />

      <DualTextRow
        leftText="Phí giao hàng"
        rightText={`${shippingFee.toLocaleString()}đ`}
      />

      <DualTextRow
        leftText="Giảm giá"
        rightText={`-${(discount || 0).toLocaleString('vi-VN')}đ`}
        rightTextStyle={{color: colors.primary}}
      />

      <DualTextRow
        leftText="Trạng thái thanh toán"
        rightText={paymentStatus.text}
        rightTextStyle={{color: paymentStatus.color}}
      />

      <DualTextRow
        leftText="Thời gian đặt hàng"
        rightText={new Date(createdAt).toLocaleString('vi-VN')}
      />

      {/* Kiểm tra và hiển thị nếu có thời gian pendingConfirmationAt */}
      {detail?.pendingConfirmationAt && (
        <DualTextRow
          leftText="Thời gian chờ xác nhận"
          rightText={new Date(detail?.pendingConfirmationAt).toLocaleString(
            'vi-VN',
          )}
        />
      )}

      {detail?.readyForPickupAt && (
        <DualTextRow
          leftText="Thời gian sẵn sàng lấy hàng"
          rightText={new Date(detail?.readyForPickupAt).toLocaleString('vi-VN')}
        />
      )}

      {detail?.shippingOrderAt && (
        <DualTextRow
          leftText="Thời gian giao hàng"
          rightText={new Date(detail?.shippingOrderAt).toLocaleString('vi-VN')}
        />
      )}

      {detail?.completedAt && (
        <DualTextRow
          leftText="Thời gian hoàn thành"
          rightText={new Date(detail?.completedAt).toLocaleString('vi-VN')}
        />
      )}

      {detail?.cancelledAt && (
        <DualTextRow
          leftText="Thời gian hủy đơn"
          rightText={new Date(detail?.cancelledAt).toLocaleString('vi-VN')}
        />
      )}

      <Row
        style={{
          alignItems: 'center',
          marginVertical: 6,
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 14, color: colors.black, marginRight: 8}}>
          Phương thức thanh toán:
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {getPaymentIcon(paymentMethod)}
          <Text style={{fontSize: 14, color: colors.black, marginLeft: 8}}>
            {paymentMethod === 'online' ? 'Thanh toán online' : 'Tiền mặt'}
          </Text>
        </View>
      </Row>

      <DualTextRow
        leftText="Tổng tiền"
        rightText={`${totalPrice.toLocaleString('vi-VN')}đ`}
        rightTextStyle={{
          color: colors.primary,
          fontWeight: '700',
          fontSize: 18,
        }}
        leftTextStyle={{color: colors.black, fontWeight: '500'}}
      />
    </View>
  );
};

const OrderId = ({_id}) => {
  return (
    <View style={[styles.row, {marginBottom: 6}]}>
      <Text style={styles.normalText}>Mã đơn hàng</Text>
      <Pressable style={styles.row} onPress={() => {}}>
        <Text style={[styles.normalText, {fontWeight: 'bold', marginRight: 8}]}>
          {_id}
        </Text>
        <Icon source="content-copy" color={colors.teal900} size={18} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  containerContent: {
    backgroundColor: colors.fbBg,
    flex: 1,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  normalText: {
    textAlign: 'justify',
    lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    marginRight: 4,
  },

  flatListContentContainer: {
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  greenText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.primary,
    fontWeight: '600',
  },
  titleContainer: {
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  areaContainer: {
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    paddingVertical: 8,
    backgroundColor: colors.white,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  status: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.green500,
    fontWeight: '500',
  },
});

export default OrderDetailScreen;
