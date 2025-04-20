import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Pressable
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
import { useAppContext } from '../../context/appContext';
import useSaveLocation from '../../utils/useSaveLocation';
import { CategoryView } from './HomeComponents/CategoryView';
import { AppGraph } from '../../layouts/graphs';
import { HomeSkeleton } from '../../skeletons';

const HomeScreen = () => {
  const { cartState, authState } = useAppContext();
  const {
    dialogShippingVisible,
    selectedOption,
    currentCategory,
    needToPay,
    allProducts,
    loadingMerchant,
    loadingProducts,
    loadingProfile,
    loadingNoti,
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
  useSaveLocation();
  const navigation = useNavigation()
  if (loadingMerchant || loadingProducts || loadingProfile || loadingNoti) {
    return <HomeSkeleton />
  }
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
      {/* {
        loading && <HomeSkeleton/>
      } */}
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


      <Pressable
        onPress={() => navigation.navigate(AppGraph.AIChatScreen)}
        style={styles.chat}>

        <Image
          source={require('../../assets/images/robot.png')}
          style={styles.imageRobot} />
      </Pressable>


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
  imageRobot: {
    width: '100%',
    height: '100%',
  },
  chat: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    position: 'absolute',
    bottom: 100,
    right: 16
  }
});
