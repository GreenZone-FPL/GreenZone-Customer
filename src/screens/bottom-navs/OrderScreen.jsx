import React, {useCallback} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
} from 'react-native';

import {
  AuthContainer,
  CategoryMenu,
  DeliveryButton,
  DialogShippingMethod,
  HeaderOrder,
  LightStatusBar,
  MyBottomSheet,
  NormalLoading,
  ProductsListHorizontal,
  ProductsListVertical,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {useAuthActions, useOrderContainer} from '../../containers';
import {useAuthContext, useCartContext, useProductContext} from '../../context';
import {FlashList} from '@shopify/flash-list';
import {AIAssistant} from './HomeComponents';

const OrderScreen = () => {
  const {authState} = useAuthContext();
  const {cartState} = useCartContext();
  const {allProducts, newProducts} = useProductContext();
  const {
    dialogShippingVisible,
    selectedOption,
    currentCategory,
    categories,
    dialogVisible,
    scrollViewRef,
    loadingCategories,
    loadingDetail,
    refreshing,
    onRefresh,
    setDialogShippingVisible,
    setDialogVisible,
    handleEditOption,
    handleOptionSelect,
    handleCloseDialog,
    onLayoutCategory,
    onNavigateProductDetailSheet,
    onClickAddToCart,
    navigateCheckOut,
    scrollToCategory,
    handleScroll,
    navigateFavorite,
    navigateSearchProduct,
  } = useOrderContainer();

  const {onNavigateLogin} = useAuthActions();

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
      <HeaderOrder
        title={currentCategory}
        onCategoryPress={() => setDialogVisible(true)}
        onFavoritePress={navigateFavorite}
        onSearchProduct={navigateSearchProduct}
      />
      <ScrollView
        style={styles.containerContent}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        scrollEventThrottle={16}>
        {!authState.lastName && <AuthContainer onPress={onNavigateLogin} />}

        <CategoryMenu
          loading={loadingCategories}
          categories={categories}
          onCategorySelect={category => scrollToCategory(category._id)}
        />

        <ProductsListHorizontal
          loading={false}
          title="Sản phẩm mới"
          products={newProducts}
          onItemClick={onItemClick}
          onIconClick={onIconClick}
        />

        <FlashList
          data={allProducts}
          estimatedItemSize={900}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          renderItem={({item}) => (
            <View onLayout={event => onLayoutCategory(item._id, event)}>
              <ProductsListVertical
                title={item.name}
                products={item.products}
                onItemClick={onItemClick}
                onIconClick={onIconClick}
              />
            </View>
          )}
        />
      </ScrollView>

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

      {dialogShippingVisible && (
        <DialogShippingMethod
          visible={dialogShippingVisible}
          selectedOption={selectedOption}
          onHide={handleCloseDialog}
          onOptionSelect={handleOptionSelect}
          onEditOption={handleEditOption}
        />
      )}

      {dialogVisible && (
        <MyBottomSheet
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
          title="Danh mục">
          <View style={{marginVertical: 8}}>
            <CategoryMenu
              categories={categories}
              loading={loadingCategories}
              onCategorySelect={category => {
                scrollToCategory(category._id);
              }}
            />
          </View>
        </MyBottomSheet>
      )}
      <AIAssistant />
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
    position: 'relative',
  },
  containerContent: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 90,
  },
  deliverybutton: {
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
});
