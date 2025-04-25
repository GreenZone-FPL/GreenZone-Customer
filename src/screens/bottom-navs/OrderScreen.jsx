import React from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  AuthContainer,
  CategoryMenu,
  DeliveryButton,
  DialogShippingMethod,
  HeaderOrder,
  LightStatusBar,
  MyBottomSheet,
  ProductsListHorizontal,
  ProductsListVertical
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAuthActions, useOrderContainer } from '../../containers';
import { useAuthContext, useCartContext, useProductContext } from '../../context';
import { FlashList } from '@shopify/flash-list';

const OrderScreen = () => {
  const { authState } = useAuthContext()
  const { cartState } = useCartContext()
  const { allProducts } = useProductContext();
  const {
    dialogShippingVisible,
    selectedOption,
    currentCategory,
    categories,
    dialogVisible,
    scrollViewRef,
    loadingCategories,
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
    navigateSearchProduct
  } = useOrderContainer()


  const { onNavigateLogin } = useAuthActions();

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />

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
        scrollEventThrottle={16}>

        {!authState.lastName && (
          <AuthContainer onPress={onNavigateLogin} />
        )}

        <CategoryMenu
          loading={loadingCategories}
          categories={categories}
          onCategorySelect={category => scrollToCategory(category._id)}
        />


        <ProductsListHorizontal
          loading={false}
          title='Sản phẩm mới'
          products={allProducts
            .flatMap(category => category.products)
            .slice(0, 10)}
          onItemClick={productId => {
            onNavigateProductDetailSheet(productId);
          }}
          onIconClick={productId => {
            onClickAddToCart(productId);
          }}
        />

        <FlashList
          data={allProducts}
          estimatedItemSize={600}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View onLayout={event => onLayoutCategory(item._id, event)}>
              <ProductsListVertical
                title={item.name}
                products={item.products}
                onItemClick={productId => {
                  onNavigateProductDetailSheet(productId);
                }}
                onIconClick={productId => {
                  onClickAddToCart(productId);
                }}
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


      {
        dialogVisible &&
        <MyBottomSheet
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
          title="Danh mục">
          <View style={{ marginVertical: 8 }}>
            <CategoryMenu
              categories={categories}
              loading={loadingCategories}
              onCategorySelect={category => {
                scrollToCategory(category._id);
              }}
            />

          </View>

        </MyBottomSheet>
      }

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
