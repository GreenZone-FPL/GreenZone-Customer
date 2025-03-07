import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon} from 'react-native-paper';
import io from 'socket.io-client';
import {getOrderDetail} from '../../axios';
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

const OrderDetailScreen = props => {
  const {navigation, route} = props;
  const {orderId} = route.params;
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const getOrderStatusLabel = value => {
    const statusEntry = Object.values(OrderStatus).find(
      status => status.value === value,
    );
    return statusEntry ? statusEntry.label : 'Trạng thái không xác định';
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        if (!orderId) {
          console.error('Lỗi: orderId không hợp lệ');
          return; 
        }
        const response = await getOrderDetail(orderId);
        setOrderDetail(response);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading || !orderDetail) {
    return (
      <NormalLoading visible={true} message="Đang tải chi tiết đơn hàng..." />
    );
  }

  const {
    deliveryMethod,
    store,
    owner,
    shippingAddress,
    shipper,
    orderItems,
    _id,
    shippingFee,
    voucher,
    paymentMethod,
    fulfillmentDateTime,
    totalPrice,
    status,
  } = orderDetail;

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Chi tiết đơn hàng"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.containerContent}>
        <Title
          title={
            deliveryMethod === 'pickup'
              ? 'Đơn hàng đang chờ lấy tại cửa hàng'
              : 'Đơn hàng đang trên đường giao đến bạn'
          }
          titleStyle={{fontWeight: '500', margin: 16}}
        />

        {/* trạng thái đơn hàng*/}
        <View
          style={{
            marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
            marginBottom: GLOBAL_KEYS.GAP_SMALL,
          }}>
          <Title title="Trạng thái đơn hàng" color={colors.black} />
          <Text style={styles.status}>
            {getOrderStatusLabel(orderDetail.status)}
          </Text>
        </View>

        {/* Hiển thị thông tin shipper nếu là giao hàng */}
        {deliveryMethod !== 'pickup' && shipper && (
          <ShipperInfo
            messageClick={() => navigation.navigate(ShoppingGraph.ChatScreen)}
            shipper={shipper}
          />
        )}
        {store && <MerchantInfo store={store} />}

        {/* Luôn hiển thị tên và số điện thoại người nhận */}
        <RecipientInfo
          deliveryMethod={deliveryMethod}
          owner={owner}
          shippingAddress={shippingAddress}
        />

        {orderItems && <ProductsInfo orderItems={orderItems} />}

        <PaymentDetails
          _id={_id}
          shippingFee={shippingFee}
          voucher={voucher}
          paymentMethod={paymentMethod}
          fulfillmentDateTime={fulfillmentDateTime}
          orderItems={orderItems}
          totalPrice={totalPrice}
          status={status}
        />
      </ScrollView>
    </View>
  );
};

const ShipperInfo = ({messageClick, shipper}) => {
  return (
    <Row style={{gap: 16, margin: 16}}>
      <Image
        style={{width: 40, height: 40}}
        source={require('../../assets/images/helmet.png')}
      />
      <Column style={{flex: 1}}>
        <NormalText text="Shipper" style={{fontWeight: '500'}} />
        <Text
          style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE, color: colors.black}}>
          {shipper?.name ? shipper.name : 'Đang chuẩn bị ...'}
        </Text>
      </Column>

      <Row style={{gap: 24}}>
        <Icon source="phone-outline" color={colors.black} size={20} />
        <Pressable onPress={messageClick}>
          <Icon source="message-outline" color={colors.black} size={20} />
        </Pressable>
      </Row>
    </Row>
  );
};

const ProductsInfo = ({orderItems}) => {
  return (
    <View style={[styles.areaContainer, {borderBottomWidth: 0}]}>
      <View style={{marginHorizontal: 16}}>
        <Title title={'Danh sách sản phẩm'} icon="sticker-text-outline" />
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
              item={formattedItem}
              enableAction={false}
              onAction={() => console.log('Edit product')}
              confirmDelete={() => console.log('Delete product')}
            />
          );
        }}
        contentContainerStyle={styles.flatListContentContainer}
        scrollEnabled={false}
      />
    </View>
  );
};

const MerchantInfo = ({store}) => {
  return (
    <View style={[styles.areaContainer, {marginHorizontal: 16}]}>
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

const RecipientInfo = ({deliveryMethod, owner, shippingAddress}) => {
  // Chọn nguồn dữ liệu phù hợp
  const recipientName =
    deliveryMethod === 'pickup'
      ? `${owner.lastName} ${owner.firstName}`
      : shippingAddress.consigneeName;

  const recipientPhone =
    deliveryMethod === 'pickup'
      ? owner.phoneNumber
      : shippingAddress.consigneePhone;

  return (
    <View style={[styles.areaContainer, {marginHorizontal: 16}]}>
      <Title title="Người nhận" icon="map-marker" />
      <Title
        title={[recipientName, '||', recipientPhone].join(' ')}
        titleStyle={{color: colors.black}}
      />
      {/* Chỉ hiển thị địa chỉ nếu không phải là "pickup" */}
      {deliveryMethod !== 'pickup' && (
        <Text style={styles.normalText}>
          {`${shippingAddress.specificAddress}, ${shippingAddress.ward}, ${shippingAddress.district}, ${shippingAddress.province}`}
        </Text>
      )}
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
  _id,
  shippingFee,
  voucher,
  paymentMethod,
  fulfillmentDateTime,
  orderItems,
  totalPrice,
  status,
}) => {
  // Tính tổng tiền sản phẩm (chưa bao gồm phí giao hàng và giảm giá)
  const subTotal = orderItems.reduce((sum, item) => sum + item.price, 0);

  // Số tiền giảm giá từ voucher (nếu có)
  const discount = voucher
    ? voucher.discountType === 'percentage'
      ? (subTotal * voucher.discountValue) / 100
      : voucher.discountValue
    : 0;

  // Tổng tiền thực tế phải trả
  const paidAmount = totalPrice;

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
        return null;
    }
  };
  // Xác định trạng thái thanh toán
  const getPaymentStatus = () => {
    if (paymentMethod === 'cod') {
      return {text: 'Chưa thanh toán', color: 'red'};
    }
    if (status === 'awaitingPayment') {
      return {text: 'Chờ thanh toán', color: 'orange'};
    }
    return {text: 'Đã thanh toán', color: colors.primary};
  };

  const paymentStatus = getPaymentStatus();

  return (
    <View style={{marginBottom: 8, marginHorizontal: 16}}>
      <DualTextRow
        leftText="CHI TIẾT THANH TOÁN"
        leftTextStyle={{color: colors.primary, fontWeight: 'bold'}}
      />
      <OrderId _id={_id} />
      {[
        {
          leftText: `Tạm tính (${orderItems.length} sản phẩm)`,
          rightText: `${subTotal.toLocaleString()}đ`,
        },
        {
          leftText: 'Phí giao hàng',
          rightText: `${shippingFee.toLocaleString()}đ`,
        },
        {
          leftText: 'Giảm giá',
          rightText: `-${(discount || 0).toLocaleString('vi-VN')}đ`,
          rightTextStyle: {color: colors.primary},
        },
        {
          leftText: 'Trạng thái thanh toán',
          rightText: paymentStatus.text,
          leftTextStyle: {
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderWidth: 1,
            borderRadius: 6,
            borderColor: paymentStatus.color,
            color: paymentStatus.color,
          },
          rightTextStyle: {fontWeight: '700', color: paymentStatus.color},
        },

        {
          leftText: 'Thời gian đặt hàng',
          rightText: new Date(fulfillmentDateTime).toLocaleString('vi-VN'),
        },
      ].map((item, index) => (
        <DualTextRow key={index} {...item} />
      ))}
      {/* Phương thức thanh toán với icon */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 8,
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 16, color: '#000', marginRight: 8}}>
          Phương thức thanh toán:
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {getPaymentIcon(paymentMethod)}
          <Text style={{fontSize: 16, color: '#000', marginLeft: 8}}>
            {paymentMethod.toUpperCase()}
          </Text>
        </View>
      </View>
      <Pressable style={styles.button} onPress={() => {}}>
        <Text style={styles.normalText}>Hủy đơn hàng</Text>
      </Pressable>
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
    backgroundColor: colors.white,
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
    borderBottomWidth: 5,
    borderColor: colors.gray200,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 2,
    marginVertical: 16,
  },
  status: {fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.orange700},
});

export default OrderDetailScreen;