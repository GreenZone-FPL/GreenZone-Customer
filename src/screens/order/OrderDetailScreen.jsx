import { useRoute } from '@react-navigation/native';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  DeliveryMethodText,
  LightStatusBar,
  NormalHeader,
  NormalLoading,
  NormalText,
  PrimaryButton,
  Row,
  StatusText,
} from '../../components';
import { colors, DeliveryMethod, GLOBAL_KEYS, OrderStatus } from '../../constants';
import { useOrderDetailContainer } from '../../containers/orders/useOrderDetailContainer';
import { useAppContext } from '../../context/appContext';
import {
  DialogPaymentMethod,
  onlineMethods,
} from '../checkout/checkout-components';
import {
  CancelDialog,
  MerchantInfo,
  PaymentDetails,
  ProductsInfo,
  RecipientInfo,
  ShipperInfo,
  TimelineStatus,
  CallSupportButton
} from './order-detail-components';

const OrderDetailScreen = () => {
  const route = useRoute()
  const { orderId } = route.params;
  const { cartState } = useAppContext();

  const {
    cancelDialogVisible,
    setCancelDialogVisible,
    orderDetail,
    loading,
    paymentMethod,
    dialogPaymentMethodVisible,
    setDialogPaymentMethodVisible,
    handleSelectMethod,
    backAction,
    callBackAfterCancel,
  } = useOrderDetailContainer(orderId);

  if (loading) {
    return (
      <View style={styles.container}>
        <LightStatusBar />
        <NormalHeader title="Chi tiết đơn hàng" onLeftPress={backAction} />
        <NormalLoading visible={loading} />
      </View>
    );
  }

  return (

    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader title="Chi tiết đơn hàng" onLeftPress={backAction} />

      {orderDetail && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.containerContent}
        >
          <Row style={styles.statusRow}>

            <DeliveryMethodText deliveryMethod={orderDetail?.deliveryMethod} />

            <StatusText status={orderDetail.status} />
          </Row>
          <TimelineStatus details={orderDetail}/>
          {orderDetail.status !== 

          }
          <CallSupportButton phoneNumber={orderDetail.store.phoneNumber} label="Gọi hỗ trợ"/>

          {orderDetail.deliveryMethod !== DeliveryMethod.PICK_UP.value && ['shippingOrder', 'readyForPickup'].includes(orderDetail.status) && (
            <ShipperInfo shipper={orderDetail.shipper} />
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


          <Row style={styles.buttonRow}>


            {(orderDetail.status ===
              OrderStatus.PENDING_CONFIRMATION.value ||
              orderDetail.status === OrderStatus.AWAITING_PAYMENT.value) && (
                <Pressable
                  style={[styles.cancelButton, styles.flex1]}
                  onPress={() => setCancelDialogVisible(true)}
                >
                  <NormalText text="Hủy đơn hàng" style={{ color: colors.red900 }} />
                </Pressable>
              )}

            {orderDetail.status === OrderStatus.AWAITING_PAYMENT.value && (
              <PrimaryButton
                titleStyle={styles.payTitle}
                style={styles.payButton}
                title="Thanh toán"
                onPress={() => setDialogPaymentMethodVisible(true)}
              />
            )}
          </Row>
        </ScrollView>
      )}

      <CancelDialog
        visible={cancelDialogVisible}
        onHide={() => setCancelDialogVisible(false)}
        orderId={orderId}
        callBack={callBackAfterCancel}
      />

      <DialogPaymentMethod
        methods={onlineMethods}
        visible={dialogPaymentMethodVisible}
        onHide={() => setDialogPaymentMethodVisible(false)}
        cartState={cartState}
        selectedMethod={paymentMethod}
        handleSelectMethod={handleSelectMethod}
      />
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
  statusRow: {
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginBottom: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: colors.white,
  },
  statusText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    flex: 1,
    fontWeight: '500',
  },
  buttonRow: {
    flex: 1,
    backgroundColor: colors.white
  },
  payTitle: {
    fontSize: 12,
  },
  payButton: {
    marginHorizontal: 16,
    flex: 1,
    padding: 13
  },
  codButton: {
    backgroundColor: colors.white,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  codTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.primary,
    fontWeight: '500',
    flex: 1
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    borderColor: colors.red900,
    borderWidth: 1
  },
  flex1: {
    flex: 1,
  },
});

export default OrderDetailScreen;
