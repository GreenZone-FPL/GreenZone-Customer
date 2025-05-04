import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
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

import { useNavigation } from '@react-navigation/native';
import { DeliveryMethod, GLOBAL_KEYS, colors } from '../../constants';
import { useCheckoutContainer } from '../../containers/checkout/useCheckoutContainer';
import { useCartContext } from '../../context';
import {
  BottomGraph,
  ShoppingGraph,
  UserGraph,
  VoucherGraph,
} from '../../layouts/graphs';
import { CartActionTypes } from '../../reducers';
import { AppAsyncStorage, CartManager, useLocation } from '../../utils';
import {
  DialogPaymentMethod,
  DialogRecipientInfo,
  DialogSelectTime,
  EmptyView,
  Footer,
  PaymentDetailsView,
  PaymentMethodView,
  ProductsInfo,
  RecipientInfo,
  ShippingAddress,
  StoreAddress,
  TimeSection,
} from './checkout-components';
import { shippingAddress2 } from '../../utils/shippingAddress2';
import { getAllMerchants } from '../../axios/modules/merchant';

const CheckoutScreen = () => {
  const { cartState, cartDispatch } = useCartContext();
  const navigation = useNavigation();

  console.log('cartState', JSON.stringify(cartState, null, 3));

  console.log('cartState', JSON.stringify(cartState, null, 3));

  const {
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

  const [nearestMerchant, setNearestMerchant] = useState(null);
  const [loadingMerchants, setLoadingMerchants] = useState(false);


  useEffect(() => {
    if (
      cartState?.deliveryMethod === DeliveryMethod.DELIVERY.value &&
      cartState?.shippingAddressInfo?.latitude &&
      cartState?.shippingAddressInfo?.longitude
    ) {
      fetchMerchantsAndFindNearest();
    }
  }, [cartState?.deliveryMethod, cartState?.shippingAddressInfo]);

  const fetchMerchantsAndFindNearest = async () => {
    try {
      setLoadingMerchants(true);
      const data = await getAllMerchants();
      const merchants = data.docs;

      const { latitude, longitude } = cartState.shippingAddressInfo;

      const nearest = findNearestMerchant(latitude, longitude, merchants);

      await CartManager.updateOrderInfo(cartDispatch, {
        store: nearest._id,
        storeInfo: {
          storeName: nearest.name,
          storeAddress: nearest.address,
        },
      });
      setNearestMerchant(nearest);
    } catch (error) {
      console.log('Error fetching merchants:', error);
    } finally {
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = deg => {
    return deg * (Math.PI / 180);
  };

  const findNearestMerchant = (userLat, userLong, merchants) => {
    let nearest = null;
    let minDistance = Infinity;

    merchants.forEach(merchant => {
      const distance = getDistanceFromLatLonInKm(
        userLat,
        userLong,
        merchant.latitude,
        merchant.longitude,
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = merchant;
      }
    });

    return nearest;
  };

  if (cartState.orderItems.length === 0) {
    return <EmptyView />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Xác nhận đơn hàng"
        onLeftPress={() => navigation.goBack()}
      />

      {loading && <NormalLoading visible={loading} />}

      <ScrollView style={styles.containerContent}>
        <Column
          style={{
            paddingVertical: 16,
            backgroundColor: colors.white,
            marginVertical: 5,
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

          {cartState.deliveryMethod === DeliveryMethod.PICK_UP.value && (
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

        <PaymentDetailsView
          cartState={cartState}
          onSelectVoucher={() =>
            navigation.navigate(VoucherGraph.SelectVouchersScreen, {
              isUpdateOrderInfo: true,
            })
          }
          style={{ flex: 1 }}
        />
        <PaymentMethodView
          selectedMethod={paymentMethod}
          openDialog={() => setDialogPaymentMethodVisible(true)}
        />
      </ScrollView>

      <Footer
        cartState={cartState}
        showDialog={() => setDialogCreateOrderVisible(true)}
      />

      {dialogPaymentMethodVisible && (
        <DialogPaymentMethod
          visible={dialogPaymentMethodVisible}
          onHide={() => setDialogPaymentMethodVisible(false)}
          cartState={cartState}
          selectedMethod={paymentMethod}
          handleSelectMethod={handleSelectMethod}
        />
      )}

      {dialogSelecTimeVisible && (
        <DialogSelectTime
          visible={dialogSelecTimeVisible}
          onClose={() => setDialogSelectTimeVisible(false)}
          onConfirm={data => {
            setTimeInfo(data);

            setTimeout(() => {
              cartDispatch({
                type: CartActionTypes.UPDATE_ORDER_INFO,
                payload: { fulfillmentDateTime: data.fulfillmentDateTime },
              });
            }, 0);
            setDialogSelectTimeVisible(false);
          }}
        />
      )}

      {dialogCreateOrderVisible && (
        <ActionDialog
          visible={dialogCreateOrderVisible}
          title="Xác nhận"
          content={`Bạn xác nhận đặt đơn hàng?`}
          cancelText="Hủy"
          approveText="Đồng ý"
          onCancel={() => setDialogCreateOrderVisible(false)}
          onApprove={onApproveCreateOrder}
        />
      )}

      {actionDialogVisible && (
        <ActionDialog
          visible={actionDialogVisible}
          title="Xác nhận"
          content={`Bạn có chắc chắn muốn xóa "${selectedProduct?.productName}"?`}
          cancelText="Hủy"
          approveText="Xóa"
          onCancel={() => setActionDialogVisible(false)}
          onApprove={() => deleteProduct(selectedProduct.itemId)}
        />
      )}

      {dialogRecipientInforVisible && (
        <DialogRecipientInfo
          visible={dialogRecipientInforVisible}
          onHide={() => setDialogRecipientInfoVisible(false)}
          onConfirm={data => {
            setTimeout(() => {
              CartManager.updateOrderInfo(cartDispatch, {
                consigneeName: data.name,
                consigneePhone: data.phoneNumber,
              }).catch(error => {
                console.log('Lỗi khi updateOrderInfo:', error);
              });
            }, 0);

            setDialogRecipientInfoVisible(false);
          }}
        />
      )}

      {dialogShippingMethodVisible && (
        <DeliveryMethodSheet
          visible={dialogShippingMethodVisible}
          selectedOption={
            cartState.deliveryMethod === DeliveryMethod.PICK_UP.value
              ? DeliveryMethod.PICK_UP
              : DeliveryMethod.DELIVERY
          }
          onClose={() => setDialogShippingMethodVisible(false)}
          onSelect={async option => {
            setDialogShippingMethodVisible(false);
            try {
              // console.log('option', option)
              //select home:
              // storeInfo: checkout

              if (option.value === DeliveryMethod.DELIVERY.value) {
                const merchantLocation = await AppAsyncStorage.readData(
                  AppAsyncStorage.STORAGE_KEYS.merchantLocation,
                );
                if (merchantLocation) {
                  await CartManager.updateOrderInfo(cartDispatch, {
                    deliveryMethod: option.value,
                    store: merchantLocation._id,
                    storeInfo: {
                      storeName: merchantLocation.name,
                      storeAddress: merchantLocation.storeAddress,
                    },
                  });
                }
              } else {
                await CartManager.updateOrderInfo(cartDispatch, {
                  deliveryMethod: option.value,
                  store: cartState.storeSelect,
                  storeInfo: {
                    storeName: cartState.storeInfoSelect.storeName,
                    storeAddress: cartState.storeInfoSelect.storeAddress,
                  },
                });
              }
            } catch (error) {
              console.log('Lỗi khi updateOrderInfo:', error);
            }
          }}
        />
      )}
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
  },
});
