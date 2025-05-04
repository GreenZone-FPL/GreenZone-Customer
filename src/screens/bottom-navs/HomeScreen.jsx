import {FlashList} from '@shopify/flash-list';

import React, {useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import {
  AuthContainer,
  BarcodeUser,
  DeliveryButton,
  DialogShippingMethod,
  HeaderWithBadge,
  LightStatusBar,
  NormalLoading,
  NormalText,
  ProductsGrid,
  ProductsListHorizontal,
  TitleText,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {useAuthActions, useHomeContainer} from '../../containers';
import {useAuthContext, useCartContext, useProductContext} from '../../context';
import {useLocation} from '../../utils';
import {AIAssistant, CategoryView} from './HomeComponents';
import {ArticlesList} from '../articles/ArticlesList';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

const HomeScreen = () => {
  const {authState} = useAuthContext();
  const {cartState} = useCartContext();
  const {allProducts} = useProductContext();

  const {
    dialogShippingVisible,
    selectedOption,
    needToPay,
    loadingProducts,
    loadingDetail,
    refreshing,
    loadingNewProducts,
    newProducts,
    onRefresh,
    handleEditOption,
    setDialogShippingVisible,
    handleOptionSelect,
    handleCloseDialog,
    onNavigateProductDetailSheet,
    onClickAddToCart,
    navigateCheckOut,
    navigateOrderHistory,
    navigateSeedScreen,
  } = useHomeContainer();

  const {onNavigateLogin} = useAuthActions();

  useLocation();

  const onItemClick = useCallback(
    productId => {
      onNavigateProductDetailSheet(productId);
    },
    [onNavigateProductDetailSheet],
  );

  const onIconClick = useCallback(
    async productId => {
      await onClickAddToCart(productId);
    },
    [onClickAddToCart],
  );

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      {loadingDetail && <NormalLoading visible={loadingDetail} />}
      <HeaderWithBadge
        title={
          authState?.firstName
            ? `Xin chào, ${authState.firstName} ${authState?.lastName ?? ''}`
            : authState?.lastName
            ? `Xin chào, ${authState.lastName}`
            : 'Xin chào'
        }
        isHome={true}
        enableBadge={!!(authState?.firstName || authState?.lastName)}
      />

      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        style={styles.containerContent}>
        {authState.lastName ? (
          <BarcodeUser showPoints={true} onPress={navigateSeedScreen} />
        ) : (
          <AuthContainer onPress={onNavigateLogin} />
        )}

        <CategoryView />

        {needToPay && (
          <TouchableOpacity
            style={styles.btnAwaitingPayments}
            onPress={navigateOrderHistory}>
            <TitleText text={`Bạn có đơn hàng cần thanh toán`} />
            <NormalText text={'Ấn để tiếp tục'} />
          </TouchableOpacity>
        )}

        <ProductsListHorizontal
          loading={loadingNewProducts}
          title="Sản phẩm mới"
          products={newProducts}
          onItemClick={onItemClick}
          onIconClick={onIconClick}
        />
        <ArticlesList />

        <FlashList
          data={allProducts}
          estimatedItemSize={900}
          keyExtractor={item => item._id}
          scrollEnabled={false}
          nestedScrollEnabled={true}
          removeClippedSubviews={true}
          renderItem={({item}) => (
            <ProductsGrid
              title={item.name}
              products={item.products}
              onItemClick={onItemClick}
              onIconClick={onIconClick}
            />
          )}
        />
      </ScrollView>

      {dialogShippingVisible && (
        <DialogShippingMethod
          visible={dialogShippingVisible}
          selectedOption={selectedOption}
          onHide={handleCloseDialog}
          onOptionSelect={handleOptionSelect}
          onEditOption={handleEditOption}
        />
      )}

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
    </SafeAreaView>
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
  },
});
