import React, {useEffect} from 'react';
import {Dimensions, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {createOrder} from '../../axios';
import {
  ActionDialog,
  Column,
  DeliveryMethodSheet,
  DualTextRow,
  LightStatusBar,
  NormalHeader,
  NormalLoading,
  Row,
} from '../../components';

import {
  DeliveryMethod,
  GLOBAL_KEYS,
  OnlineMethod,
  colors,
} from '../../constants';
import {useCheckoutContainer} from '../../containers/checkout/useCheckoutContainer';
import {useAppContext} from '../../context/appContext';
import {
  BottomGraph,
  MainGraph,
  OrderGraph,
  ShoppingGraph,
  UserGraph,
  VoucherGraph,
} from '../../layouts/graphs';
import {CartActionTypes} from '../../reducers';
import socketService from '../../services/socketService';
import {AppAsyncStorage, CartManager, Toaster} from '../../utils';
import {
  DialogPaymentMethod,
  DialogRecipientInfo,
  DialogSelectTime,
  Footer,
  PaymentDetailsView,
  PaymentMethodView,
  ProductsInfo,
  RecipientInfo,
  ShippingAddress,
  StoreAddress,
  TimeSection,
} from './checkout-components';

const {width} = Dimensions.get('window');
const CheckoutScreen = () => {
  const {
    cartState,
    cartDispatch,
    setUpdateOrderMessage,
    awaitingPayments,
    setAwaitingPayments,
  } = useAppContext();

  const {
    navigation,
    dialogCreateOrderVisible,
    setDialogCreateOrderVisible,
    dialogRecipientInforVisible,
    setDialogRecipientInfoVisible,
    dialogShippingMethodVisible,
    setDialogShippingMethodVisible,
    dialogPaymentMethodVisible,
    setDialogPaymentMethodVisible,
    dialogSelecTimeVisible,
    setDialogSelectTimeVisible,
    actionDialogVisible,
    setActionDialogVisible,
    loading,
    timeInfo,
    setTimeInfo,
    selectedProduct,
    setSelectedProduct,
    paymentMethod,
    deleteProduct,
    handleSelectMethod,
    onApproveCreateOrder,
  } = useCheckoutContainer();

  useEffect(() => {
    console.log('cartState', JSON.stringify(cartState, null, 2));
  }, [cartState]);

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
                  rightTextStyle={{color: colors.primary}}
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
                    <Row style={{gap: 0}}>
                      {cartState?.shippingAddressInfo && (
                        <RecipientInfo
                          cartDispatch={cartDispatch}
                          cartState={cartState}
                          onChangeRecipientInfo={() =>
                            setDialogRecipientInfoVisible(true)
                          }
                          style={{flex: 1}}
                        />
                      )}

                      <TimeSection
                        timeInfo={timeInfo}
                        showDialog={() => setDialogSelectTimeVisible(true)}
                        cartState={cartState}
                        style={{flex: 1}}
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
                      style={{flex: 1}}
                    />
                  </>
                )}
              </Column>

              {cartState.orderItems.length > 0 && (
                <ProductsInfo
                  items={cartState.orderItems}
                  onEditItem={item =>
                    navigation.navigate(ShoppingGraph.EditCartItemScreen, {
                      updateItem: item,
                    })
                  }
                  confirmDelete={product => {
                    setSelectedProduct(product);
                    setActionDialogVisible(true);
                  }}
                />
              )}

              <PaymentDetailsView
                cartState={cartState}
                onSelectVoucher={() =>
                  navigation.navigate(VoucherGraph.VouchersMerchantScreen, {
                    isUpdateOrderInfo: true,
                  })
                }
              />
              <PaymentMethodView
                selectedMethod={paymentMethod}
                openDialog={() => setDialogPaymentMethodVisible(true)}
              />
            </ScrollView>

            <Footer
              timeInfo={timeInfo}
              showDialog={() => setDialogCreateOrderVisible(true)}
              cartDispatch={cartDispatch}
              cartState={cartState}
            />
          </>
        )}
      </>

      <DialogPaymentMethod
        visible={dialogPaymentMethodVisible}
        onHide={() => setDialogPaymentMethodVisible(false)}
        cartState={cartState}
        selectedMethod={paymentMethod}
        handleSelectMethod={handleSelectMethod}
      />

      <DialogSelectTime
        visible={dialogSelecTimeVisible}
        onClose={() => setDialogSelectTimeVisible(false)}
        onConfirm={data => {
          // console.log('timeInfo', data);
          setTimeInfo(data);
          cartDispatch({
            type: CartActionTypes.UPDATE_ORDER_INFO,
            payload: {fulfillmentDateTime: data.fulfillmentDateTime},
          });
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
        onApprove={onApproveCreateOrder}
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
});
