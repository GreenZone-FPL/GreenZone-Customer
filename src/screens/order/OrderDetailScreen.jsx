import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Icon, PaperProvider } from 'react-native-paper';
import {
  ActionDialog,
  Column,
  DualTextRow,
  HorizontalProductItem,
  LightStatusBar,
  NormalHeader,
  NormalLoading,
  NormalText,
  PrimaryButton,
  Row,
  StatusText,
} from '../../components';
import { colors, GLOBAL_KEYS, OrderStatus } from '../../constants';
import { useOrderDetailContainer } from '../../containers/orders/useOrderDetailContainer';
import { useAppContext } from '../../context/appContext';
import { ShoppingGraph } from '../../layouts/graphs';
import { Toaster } from '../../utils';
import { DialogPaymentMethod, onlineMethods } from '../checkout/checkout-components';

const OrderDetailScreen = ({ route }) => {
  const { orderId } = route.params;
  const { cartState } = useAppContext();

  const {
    navigation,
    orderDetail,
    loading,
    paymentMethod,
    dialogPaymentMethodVisible,
    setDialogPaymentMethodVisible,
    dialogCancelOrderVisible,
    setDialogCancelOrderVisible,
    handleSelectMethod,
    onCancelOrder,
    backAction,
  } = useOrderDetailContainer(orderId)

  if (loading) {
    return (
      <View style={styles.container}>
        <LightStatusBar />
        <NormalHeader
          title="Chi tiết đơn hàng"
          onLeftPress={backAction} // Dùng chung logic Back
        />
        <NormalLoading visible={loading} />
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <LightStatusBar />
        <NormalHeader
          title="Chi tiết đơn hàng"
          onLeftPress={backAction}
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

            {['shippingOrder', 'readyForPickup'].includes(
              orderDetail.status,
            ) && (
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

            <Row style={{ flex: 1 }}>
              {orderDetail.status === OrderStatus.AWAITING_PAYMENT.value && (
                <PrimaryButton
                  titleStyle={{ fontSize: 12 }}
                  style={{ marginHorizontal: 16, flex: 1 }}
                  title="Thanh toán"
                  onPress={() => {
                    setDialogPaymentMethodVisible(true);
                  }}
                />
              )}

              {(orderDetail.status === OrderStatus.PENDING_CONFIRMATION.value ||
                orderDetail.status === OrderStatus.AWAITING_PAYMENT.value) && (
                  <Pressable
                    style={[styles.button, { flex: 1 }]}
                    onPress={() => setDialogCancelOrderVisible(true)}>
                    <Text style={styles.normalText}>Hủy đơn hàng</Text>
                  </Pressable>
                )}
            </Row>
          </ScrollView>
        )}

        <DialogPaymentMethod
          methods={onlineMethods}
          visible={dialogPaymentMethodVisible}
          onHide={() => setDialogPaymentMethodVisible(false)}
          cartState={cartState}
          selectedMethod={paymentMethod}
          handleSelectMethod={handleSelectMethod}
        />

        <ActionDialog
          visible={dialogCancelOrderVisible}
          title="Xác nhận"
          content={`Bạn có chắc chắn muốn hủy đơn hàng này"?`}
          cancelText="Đóng"
          approveText="Đồng ý"
          onCancel={() => setDialogCancelOrderVisible(false)}
          onApprove={onCancelOrder}
        />
      </View>
    </PaperProvider>
  );
};

const ShipperInfo = ({ messageClick, shipper }) => {
  return (
    <Row
      style={{
        gap: 16,
        padding: 16,
        backgroundColor: colors.white,
        marginBottom: 8,
      }}>
      {shipper?.avatar ? (
        <Image
          style={{ width: 60, height: 60, borderRadius: 40 }}
          source={{ uri: shipper.avatar }}
        />
      ) : (
        <Image
          style={{ width: 60, height: 60, borderRadius: 40 }}
          source={require('../../assets/images/helmet.png')}
        />
      )}

      <Column style={{ flex: 1 }}>
        <NormalText text="Nhân viên giao hàng" style={{ fontWeight: '500' }} />
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
        <NormalText text={`Điện thoại: ${shipper.phoneNumber}`} />
      </Column>

      <Row style={{ gap: 24 }}>
        <Icon source="phone-outline" color={colors.black} size={20} />
        <Pressable onPress={messageClick}>
          <Icon source="message-outline" color={colors.black} size={20} />
        </Pressable>
      </Row>
    </Row>
  );
};

const ProductsInfo = ({ orderItems }) => {
  return (
    <View
      style={[
        styles.areaContainer,
        { borderBottomWidth: 0, backgroundColor: colors.white },
      ]}>
      <View style={{ marginHorizontal: 16 }}>
        <Title title={'Danh sách sản phẩm'} icon="clipboard-list-outline" />
      </View>

      <FlatList
        data={orderItems}
        keyExtractor={item => item.product._id}
        renderItem={({ item }) => {
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
              containerStyle={{ backgroundColor: colors.white }}
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

const MerchantInfo = ({ store }) => {
  return (
    <View style={[styles.areaContainer, { padding: 16 }]}>
      <Title title="Cửa hàng" icon="store-outline" />
      <Title title={store.name} titleStyle={{ color: colors.black }} />
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

const RecipientInfo = ({ detail }) => {
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
        { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
      ]}>
      <Title title="Người nhận" icon="map-marker-outline" />
      <NormalText
        text={[recipientName, recipientPhone].join(' - ')}
        style={{ color: colors.black, fontWeight: '500' }}
      />
      {/* Hiển thị địa chỉ nếu có */}
      {deliveryMethod !== 'pickup' && (
        <Text style={styles.normalText}>{recipientAddress}</Text>
      )}

      <DualTextRow
        style={{ marginVertical: 0 }}
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
  // const subTotal = orderItems.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0,
  // );

  // Số tiền giảm giá từ voucher (nếu có)
  const discount = voucher
    ? voucher.discountType === 'percentage'
      ? (subTotal * voucher.value) / 100
      : voucher.value
    : subTotal - voucher.value < 0
      ? 0
      : subTotal - voucher.value;

  // Chọn icon phù hợp với phương thức thanh toán
  const getPaymentIcon = method => {
    switch (method) {
      case 'cod':
        return (
          <Image
            style={{ width: 24, height: 24 }}
            source={require('../../assets/images/logo_vnd.png')}
          />
        );
      case 'payOs':
        return (
          <Image
            style={{ width: 24, height: 24 }}
            source={require('../../assets/images/logo_payos.png')}
          />
        );
      case 'zalopay':
        return (
          <Image
            style={{ width: 24, height: 24 }}
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
      return { text: 'Đã thanh toán', color: colors.primary };
    }
    if (paymentMethod === 'cod') {
      return { text: 'Chưa thanh toán', color: colors.orange700 };
    }
    if (status === 'awaitingPayment') {
      return { text: 'Chờ thanh toán', color: colors.pink500 };
    }
    if (status === 'cancelled') {
      return { text: 'Chưa thanh toán', color: colors.orange700 };
    }
    return { text: 'Đã thanh toán', color: colors.primary };
  };

  const paymentStatus = getPaymentStatus();
  const subTotal = detail.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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
        <Text
          style={{
            fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
            color: colors.black,
            marginRight: 8,
          }}>
          Trạng thái đơn hàng
        </Text>
        <StatusText status={status} />
      </Row>

      <DualTextRow
        leftText="Phí giao hàng"
        rightText={`${detail.deliveryMethod === 'delivery'
          ? shippingFee.toLocaleString()
          : 0
          }đ`}
      />

      <DualTextRow
        leftText="Giảm giá"
        rightText={`-${(discount || 0).toLocaleString('vi-VN')}đ`}
        rightTextStyle={{ color: colors.primary }}
      />

      <DualTextRow
        leftText="Trạng thái thanh toán"
        rightText={paymentStatus.text}
        rightTextStyle={{ color: paymentStatus.color }}
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
        <Text
          style={{
            fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
            color: colors.black,
            marginRight: 8,
          }}>
          Phương thức thanh toán:
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {getPaymentIcon(paymentMethod)}
          <Text
            style={{
              fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
              color: colors.black,
              marginLeft: 8,
            }}>
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
        leftTextStyle={{ color: colors.black, fontWeight: '500' }}
      />
    </View>
  );
};

const OrderId = ({ _id }) => {

  const handleCopy = () => {
    Clipboard.setString(_id);
    Toaster.show('Đã sao chép mã đơn hàng!')

  };


  return (
    <View style={[styles.row, { marginBottom: 6 }]}>
      <Text style={styles.normalText}>Mã đơn hàng</Text>
      <Pressable style={styles.row} onPress={handleCopy}>
        <Text style={[styles.normalText, { fontWeight: 'bold', marginRight: 8 }]}>
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
