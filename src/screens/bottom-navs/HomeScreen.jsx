import { FlashList } from '@shopify/flash-list';

import React, { useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import {
  AuthContainer,
  BarcodeUser,
  DeliveryButton,
  DialogShippingMethod,
  HeaderWithBadge,
  LightStatusBar,
  NormalText,
  NotificationList,
  ProductsGrid,
  ProductsListHorizontal,
  TitleText
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAuthActions, useHomeContainer } from '../../containers';
import { useAuthContext, useCartContext, useProductContext } from '../../context';
import { useLocation } from '../../utils';
import { AIAssistant, CategoryView } from './HomeComponents';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

const HomeScreen = () => {
  const { authState } = useAuthContext();
  const { cartState } = useCartContext();
  const { allProducts } = useProductContext();


  const {
    dialogShippingVisible,
    selectedOption,
    currentCategory,
    needToPay,
    loadingProducts,
    handleEditOption,
    setDialogShippingVisible,
    handleScroll,
    handleOptionSelect,
    handleCloseDialog,
    onLayoutCategory,
    onNavigateProductDetailSheet,
    onClickAddToCart,
    navigateCheckOut,
    navigateOrderHistory,
    navigateAdvertising,
    navigateSeedScreen
  } = useHomeContainer();


  const { onNavigateLogin } = useAuthActions();

  useLocation()


  const onItemClick = useCallback((productId) => {
    onNavigateProductDetailSheet(productId);
  }, [onNavigateProductDetailSheet]);

  const onIconClick = useCallback((productId) => {
    onClickAddToCart(productId);
  }, [onClickAddToCart]);



  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <HeaderWithBadge
        title={
          authState.isLoggedIn
            ? currentCategory
              ? currentCategory
              : 'Xin chào'
            : 'Chào bạn mới'
        }
        isHome={false}
        enableBadge={!!authState.lastName}
      />


      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.containerContent}>

        {authState.lastName ? (
          <BarcodeUser
            showPoints={true}
            onPress={navigateSeedScreen}
          />
        ) : (
          <AuthContainer onPress={onNavigateLogin} />
        )}

        <CategoryView />

        {
          needToPay &&
          <TouchableOpacity
            style={styles.btnAwaitingPayments}
            onPress={navigateOrderHistory}>
            <TitleText
              text={`Bạn có đơn hàng cần thanh toán`}
            />
            <NormalText text={'Ấn để tiếp tục'} />
          </TouchableOpacity>
        }

        <ProductsListHorizontal
          loading={loadingProducts}
          title="Sản phẩm mới"
          products={allProducts
            .flatMap(category => category.products)
            .slice(0, 10)}
          onItemClick={onItemClick}
          onIconClick={onIconClick}
        />
        <NotificationList onSeeMorePress={navigateAdvertising} />

        <FlashList
          data={allProducts}
          estimatedItemSize={600}
          keyExtractor={item => item._id}
          scrollEnabled={false}
          nestedScrollEnabled={true}
          removeClippedSubviews={true}
          renderItem={({ item }) => (
            <View onLayout={event => onLayoutCategory(item._id, event)}>
              <ProductsGrid
                title={item.name}
                products={item.products}
                onItemClick={onItemClick}
                onIconClick={onIconClick}
              />

            </View>
          )}
        />





      </ScrollView>

      {
        dialogShippingVisible &&
        <DialogShippingMethod
          visible={dialogShippingVisible}
          selectedOption={selectedOption}
          onHide={handleCloseDialog}
          onOptionSelect={handleOptionSelect}
          onEditOption={handleEditOption}
        />
      }

      <DeliveryButton
        deliveryMethod={selectedOption}
        title={selectedOption === 'Mang đi' ? 'Đến lấy tại' : 'Giao đến'}
        address={
          selectedOption === 'Mang đi'
            ? cartState?.storeInfoSelect?.storeAddress
            : cartState?.shippingAddressInfo?.location
              ? cartState?.shippingAddressInfo?.location
              : cartState
                ? cartState?.address?.label
                : 'Đang xác định vị trí...'
        }
        onPress={() => setDialogShippingVisible(true)}
        style={styles.deliverybutton}
        cartState={cartState}
        onPressCart={navigateCheckOut}
      />

      <AIAssistant />
    </SafeAreaView >
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: 'relative',
  },
  containerContent: {
    flex: 1,
    marginBottom: 90,
  },
  deliverybutton: {
    position: 'absolute',
    bottom: 0,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  btnAwaitingPayments: {
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: colors.yellow300,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  imageRobot: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  chat: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    position: 'absolute',
    bottom: 100,
    right: 16,
  }

});
