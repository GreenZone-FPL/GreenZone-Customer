import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import {
  DualTextRow,
  HorizontalProductItem,
  PaymentMethodRow,
  NormalHeader,
  LightStatusBar,
  Row,
  Column,
  NormalText,
  ActionDialog
} from '../../components';
import { GLOBAL_KEYS, OrderStatus, colors } from '../../constants';
import { OrderGraph, ShoppingGraph } from '../../layouts/graphs';
import { updateOrderStatus, getOrderDetail } from '../../axios';
import SocketService from '../../services/socketService';
import { AppAsyncStorage } from '../../utils';
import { io } from 'socket.io-client';
// const socket = io('wss://greenzone.motcaiweb.io.vn/socket.io/?EIO=4&transport=websocket');

const socket = io('https://serversocket-4oew.onrender.com/');
const OrderDetailScreen2 = props => {
  const { navigation, route } = props;
  const { order } = route.params;
  const { deliveryMethod, store, owner, shippingAddress, shipper, orderItems } = order;
  const [actionDialogVisible, setActionDialogVisible] = useState(false)
  const [orderStatus, setOrderStatus] = useState("Đang xử lý...");

  console.log('Dữ liệu đơn hàng:', JSON.stringify(order, null, 2));


  const handleOrderUpdate = useCallback((data) => {
    setOrderStatus(data.status);
  }, []);


  useEffect(() => {
    if (!order?._id) return;

    const initSocket = async () => {
      await SocketService.initialize();

      SocketService.joinOrder(order._id);

      SocketService.onOrderUpdateStatus(handleOrderUpdate);


    }
    initSocket()

    return () => {
      SocketService.offOrderUpdateStatus(handleOrderUpdate);
    };
  }, [order?._id]);

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Chi tiết đơn hàng2"
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
          titleStyle={{ fontWeight: '500', margin: 16 }}
        />

        {/* Hiển thị thông tin shipper nếu là giao hàng */}
        {deliveryMethod !== 'pickup' && (
          <ShipperInfo
            messageClick={() => navigation.navigate(ShoppingGraph.ChatScreen)}
            shipper={shipper}
          />
        )}
        <MerchantInfo store={store} />

        {/* Luôn hiển thị tên và số điện thoại người nhận */}
        <RecipientInfo
          deliveryMethod={deliveryMethod}
          owner={owner}
          shippingAddress={shippingAddress}
        />

        <ProductsInfo orderItems={orderItems} />

        <PaymentDetails />

        {
          (order.status === OrderStatus.PENDING_CONFIRMATION.value ||
            order.status === OrderStatus.AWAITING_PAYMENT.value) &&
          <Pressable style={styles.button} onPress={() => setActionDialogVisible(true)}>
            <Text style={styles.normalText}>Cancel this order</Text>
          </Pressable>
        }

        <Pressable style={styles.button} onPress={() =>
          socket.emit('thuthao', { message: 'abc' })
        }
        >
          <Text style={styles.normalText}>Emit event</Text>
        </Pressable>

      </ScrollView>


      <ActionDialog
        visible={actionDialogVisible}
        title="Xác nhận"
        content={`Bạn có chắc chắn muốn hủy đơn hàng này"?`}
        cancelText="Đóng"
        approveText="Đồng ý"
        onCancel={() => setActionDialogVisible(false)}
        onApprove={async () => {
          try {
            const response = await updateOrderStatus(order._id, OrderStatus.CANCELLED.value)
            // console.log('response', response)

            SocketService.updateOrderStatus(order._id, OrderStatus.CANCELLED.value)

            const updatedOrder = await getOrderDetail(order._id);
            console.log('Updated Order Detail:', updatedOrder);

            // Cập nhật lại state nếu bạn lưu order trong state
            // setOrder(updatedOrder);
          } catch (error) {
            console.log('error', error)
          } finally {
            setActionDialogVisible(false)
          }

        }}
      />
    </View>
  );
};

const ShipperInfo = ({ messageClick, shipper }) => {
  return (
    <Row style={{ gap: 16, margin: 16 }}>
      <Image
        style={{ width: 40, height: 40 }}
        source={require('../../assets/images/helmet.png')}
      />
      <Column style={{ flex: 1 }}>
        <NormalText text="Shipper" style={{ fontWeight: '500' }} />
        <Text
          style={{ fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE, color: colors.black }}>
          {shipper.name} Tannie
        </Text>
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
    <View style={[styles.areaContainer, { borderBottomWidth: 0 }]}>
      <View style={{ marginHorizontal: 16 }}>
        <Title title={'Danh sách sản phẩm'} icon="sticker-text-outline" />
      </View>

      <FlatList
        data={orderItems}
        keyExtractor={item => item.product._id}
        renderItem={({ item }) => {
          console.log('orderItems:', JSON.stringify(orderItems, null, 2));
          const formattedItem = {

            productName: item.product.name,
            image: item.product.image,
            variantName: item.product.size, // Kích thước sản phẩm
            price: item.price, // Giá đã tính cho từng sản phẩm
            quantity: item.quantity, // Số lượng sản phẩm
            isVariantDefault: false, // Giả sử luôn có biến thể
            toppingItems: item.toppings || [],
          };

          return (
            <HorizontalProductItem
              item={formattedItem} // Truyền item đã chuyển đổi
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

const MerchantInfo = ({ store }) => {
  return (
    <View style={[styles.areaContainer, { marginHorizontal: 16 }]}>
      <Title title="Cửa hàng" icon="store" />
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

const RecipientInfo = ({ deliveryMethod, owner, shippingAddress }) => {
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
    <View style={[styles.areaContainer, { marginHorizontal: 16 }]}>
      <Title title="Người nhận" icon="map-marker" />
      <Title
        title={[recipientName, '||', recipientPhone].join(' ')}
        titleStyle={{ color: colors.black }}
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

const PaymentDetails = () => (
  <View style={{ marginBottom: 8, marginHorizontal: 16 }}>
    <DualTextRow
      leftText="CHI TIẾT THANH TOÁN"
      leftTextStyle={{ color: colors.primary, fontWeight: 'bold' }}
    />
    <OrderId />
    {[
      { leftText: 'Tạm tính (2 sản phẩm)', rightText: '69.000đ' },
      { leftText: 'Phí giao hàng', rightText: '18.000đ' },
      {
        leftText: 'Giảm giá',
        rightText: '-28.000đ',
        rightTextStyle: { color: colors.primary },
      },
      {
        leftText: 'Đã thanh toán',
        rightText: '68.000đ',
        leftTextStyle: {
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderWidth: 1,
          borderRadius: 6,
          borderColor: colors.primary,
          color: colors.primary,
        },
        rightTextStyle: { fontWeight: '700', color: colors.primary },
      },
      { leftText: 'Thời gian đặt hàng', rightText: '2024/07/03, 20:08' },
    ].map((item, index) => (
      <DualTextRow key={index} {...item} />
    ))}

    <PaymentMethodRow enableChange={false} />


  </View>
);

const OrderId = () => {
  return (
    <View style={[styles.row, { marginBottom: 6 }]}>
      <Text style={styles.normalText}>Mã đơn hàng</Text>
      <Pressable style={styles.row} onPress={() => { }}>
        <Text style={[styles.normalText, { fontWeight: 'bold', marginRight: 8 }]}>
          202407032008350
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
    margin: 16,
  },
});

export default OrderDetailScreen2;