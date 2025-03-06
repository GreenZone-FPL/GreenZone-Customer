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
import { Column, LightStatusBar, NormalHeader, Row } from '../../components';
import { GLOBAL_KEYS, colors } from '../../constants';
import { ShoppingGraph } from '../../layouts/graphs';
import { getFavoriteProducts } from '../../axios';
import { useFocusEffect } from '@react-navigation/native';

const FavoriteScreen = ({ navigation }) => {
  const navigateProductDetail = (productId) => {
    navigation.navigate(ShoppingGraph.ProductDetailSheet, { productId });
  };

  return (
    <Column style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Sản phẩm yêu thích"
        onLeftPress={() => navigation.goBack()}
      />
      <FavoriteProductList navigateProductDetail={navigateProductDetail} />
    </Column>
  );
};

const FavoriteProductList = ({ navigateProductDetail }) => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const products = await getFavoriteProducts();
      setFavorites(products.map(item => item.product));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigateProductDetail(item._id)} style={styles.itemContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={[styles.infoContainer]}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={{ fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT }}>{item.originalPrice} đ</Text>
          <View style={styles.iconContainer}>
            <Pressable>
              <Icon
                source="plus-circle"
                color={colors.primary}
                size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
              />
            </Pressable>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.flatListContent}>
      <FlatList
        data={favorites}
        keyExtractor={item => item._id.toString()} // Đảm bảo key hợp lệ
        renderItem={renderItem}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  flatListContent: {
    backgroundColor: colors.grayBg,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    borderRadius: 8,
    marginRight: 10,
    flex: 1,
    height: 100
  },
  productName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 2,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    justifyContent: "space-between", // Đẩy icon xuống dưới
    paddingBottom: 10, // Tạo khoảng cách đẹp hơn
  },
  iconContainer: {
    alignSelf: "flex-end", // Đưa icon về cuối
  },
});


export default FavoriteScreen;
