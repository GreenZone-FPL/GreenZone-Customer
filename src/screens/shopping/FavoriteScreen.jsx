import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Icon } from 'react-native-paper';
import {
  Column,
  EmptyView,
  LightStatusBar,
  NormalHeader,
  ProductsListVertical,
  Row,
} from '../../components';
import { colors } from '../../constants';
import { getFavoriteProducts } from '../../axios';
import { useFocusEffect } from '@react-navigation/native';
import { ShoppingGraph } from '../../layouts/graphs';

const FavoriteScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const response = await getFavoriteProducts();
      setFavorites(response.map(item => item.product));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const onItemClick = productId => {
    navigation.navigate(ShoppingGraph.ProductDetailSheet, { productId });
  };

  const onIconClick = productId => {
    navigation.navigate(ShoppingGraph.ProductDetailShort, { productId });
  };
  // khi màn hình được chọn thì dùng để tránh trường hợp cập nhập ui
  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, []),
  );
  return (
    <Column style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Sản phẩm yêu thích"
        onLeftPress={() => navigation.goBack()}
      />
      {
        favorites.length > 0 ?
          <ProductsListVertical
            title={null}
            onIconClick={onIconClick}
            onItemClick={onItemClick}
            products={favorites}
          /> :

          <EmptyView message='Danh sách yêu thích của bạn đang trống' />
      }

    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.fbBg,
    flex: 1,
  },
});

export default FavoriteScreen;
