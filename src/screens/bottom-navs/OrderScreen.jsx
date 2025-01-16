import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';

import {
  SaleProductsListHorizontal,
  ProductsListVertical,
  CategoryMenu,
  LightStatusBar,
} from '../../components';
import {colors, ScreenEnum} from '../../constants';

const OrderScreen = props => {
  const {navigation} = props;

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <ScrollView style={styles.containerContent}>
        <CategoryMenu />
        <SaleProductsListHorizontal
          onItemClick={() => navigation.navigate(ScreenEnum.ProductDetailSheet)}
        />
        <ProductsListVertical
          onItemClick={() => navigation.navigate(ScreenEnum.ProductDetailSheet)}
        />
      </ScrollView>
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
  },
});
