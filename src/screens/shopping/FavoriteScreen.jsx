import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {getFavoriteProducts} from '../../axios';
import {
  Column,
  EmptyView,
  LightStatusBar,
  NormalHeader,
  ProductsListVertical,
} from '../../components';
import {colors} from '../../constants';
import {ShoppingGraph} from '../../layouts/graphs';
import {useHomeContainer} from '../../containers';

const FavoriteScreen = ({navigation}) => {
  const [favorites, setFavorites] = useState([]);
  const {onNavigateProductDetailSheet, onClickAddToCart} = useHomeContainer();
  const fetchFavorites = async () => {
    try {
      const response = await getFavoriteProducts();
      setFavorites(response.map(item => item.product));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

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
      {favorites.length > 0 ? (
        <ProductsListVertical
          title={null}
          onIconClick={onIconClick}
          onItemClick={onItemClick}
          products={favorites}
        />
      ) : (
        <EmptyView message="Danh sách yêu thích của bạn đang trống" />
      )}
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});

export default FavoriteScreen;
