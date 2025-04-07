import React from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
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
import { useAppContainer, useHomeContainer } from '../../containers';
import { useAppContext } from '../../context/appContext';
import { TextFormatter } from '../../utils';
import useSaveLocation from '../../utils/useSaveLocation';
import { CategoryView } from './HomeComponents/CategoryView';

const HomeScreen = () => {
  const { cartState, authState, awaitingPayments } = useAppContext();

  const {
    isModalVisible,
    setIsModalVisible,
    selectedOption,
    currentCategory,
    handleScroll,
    user,
    allProducts,
    handleEditOption,
    handleOptionSelect,
    handleCloseDialog,
    onLayoutCategory,
    onNavigateProductDetailSheet,
    onClickAddToCart,
    navigatePayOS,
    navigateZaloPay,
    navigateCheckOut,
    navigateOrderHistory,
    navigateAdvertising,
    navigateBeanScreen,
  } = useHomeContainer();

  const { onNavigateLogin } = useAppContainer();
  useSaveLocation();
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
        onBadgePress={() => { }}
        isHome={false}
      />

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.containerContent}>
        {authState.lastName ? (
          user && (
            <BarcodeUser
              user={user}
              showPoints={false}
              onPress={navigateBeanScreen}
            />
          )
        ) : (
          <AuthContainer onPress={onNavigateLogin} />
        )}

        <CategoryView />
        {awaitingPayments && (
          <TouchableOpacity
            style={styles.btnAwaitingPayments}
            onPress={navigateOrderHistory}
          >
            <TitleText
              text={`Bạn có đơn hàng ${TextFormatter.formatCurrency(
                awaitingPayments.totalPrice,
              )} cần thanh toán`}
            />
            <NormalText text={'Ấn để tiếp tục'} />
          </TouchableOpacity>
        )}

        {allProducts.length > 0 && (
          <ProductsListHorizontal
            title="Sản phẩm mới"
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
        )}
        <NotificationList onSeeMorePress={navigateAdvertising} />

        <FlatList
          data={allProducts}
          keyExtractor={item => item._id}
          scrollEnabled={false}
          maxToRenderPerBatch={10}
          windowSize={5}
          nestedScrollEnabled
          initialNumToRender={10} // Chỉ render 10 item đầu tiên
          removeClippedSubviews={true} // Tắt item khi ra khỏi màn hình
          renderItem={({ item }) => (
            <View onLayout={event => onLayoutCategory(item._id, event)}>
              <ProductsGrid
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
        onPress={() => setIsModalVisible(true)}
        style={styles.deliverybutton}
        cartState={cartState}
        onPressCart={navigateCheckOut}
      />
      <DialogShippingMethod
        isVisible={isModalVisible}
        selectedOption={selectedOption}
        onHide={handleCloseDialog}
        onOptionSelect={handleOptionSelect}
        onEditOption={handleEditOption}
      />
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
    marginHorizontal: 16,
    backgroundColor: colors.yellow300,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
});
