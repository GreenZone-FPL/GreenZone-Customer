import React from 'react';
import {Dimensions, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
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
import {DeliveryMethod, GLOBAL_KEYS, colors} from '../../constants';
import {useCheckoutContainer} from '../../containers';
import {useAppContext} from '../../context/appContext';
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
  const {cartState, cartDispatch} = useAppContext();
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
    selectedProduct,
    setSelectedProduct,
    paymentMethod,
    chooseMerchant,
    chooseUserAddress,
    navigateEditCartItem,
    onConfirmSelectTime,
    onSelectVoucher,
    onConfirmRecipientInfo,
    onSelectShippingMethod,
    deleteProduct,
    handleSelectMethod,
    onApproveCreateOrder,
  } = useCheckoutContainer();

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
              <Column style={styles.form}>
                <DualTextRow
                  style={styles.dualTextRow}
                  leftText={
                    cartState.deliveryMethod === DeliveryMethod.PICK_UP.value
                      ? DeliveryMethod.PICK_UP.label
                      : DeliveryMethod.DELIVERY.label
                  }
                  rightText={'Thay đổi'}
                  leftTextStyle={styles.leftText}
                  rightTextStyle={styles.rightText}
                  onRightPress={() => setDialogShippingMethodVisible(true)}
                />

                {cartState?.deliveryMethod === DeliveryMethod.PICK_UP.value && (
                  <StoreAddress
                    storeInfo={cartState?.storeInfo}
                    chooseMerchant={chooseMerchant}
                  />
                )}

                {cartState.deliveryMethod === DeliveryMethod.DELIVERY.value && (
                  <>
                    <ShippingAddress
                      deliveryMethod={cartState?.deliveryMethod}
                      shippingAddressInfo={cartState?.shippingAddressInfo}
                      chooseUserAddress={chooseUserAddress}
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
                  onEditItem={navigateEditCartItem}
                  confirmDelete={product => {
                    setSelectedProduct(product);
                    setActionDialogVisible(true);
                  }}
                />
              )}

              <PaymentDetailsView
                cartState={cartState}
                onSelectVoucher={onSelectVoucher}
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
        onConfirm={onConfirmSelectTime}
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
        onConfirm={onConfirmRecipientInfo}
      />

      <DeliveryMethodSheet
        visible={dialogShippingMethodVisible}
        selectedOption={
          cartState.deliveryMethod === DeliveryMethod.PICK_UP.value
            ? DeliveryMethod.PICK_UP
            : DeliveryMethod.DELIVERY
        }
        onClose={() => setDialogShippingMethodVisible(false)}
        onSelect={onSelectShippingMethod}
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
  form: {
    paddingVertical: 16,
    backgroundColor: colors.white,
    marginVertical: 8,
  },
  dualTextRow: {
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginTop: 8,
    marginBottom: 0,
    backgroundColor: colors.white,
  },
  leftText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  rightText: {
    color: colors.primary,
  },
});
