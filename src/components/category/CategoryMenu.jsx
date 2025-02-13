import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import { Icon } from 'react-native-paper';
import { Skeleton } from '@rneui/themed';
import LinearGradient from "react-native-linear-gradient";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const CategoryMenu = props => {

  const { categories, loading } = props
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const formatCurrencyVND = amount => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const handleCategoryPress = category => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <FlatList
          data={Array(8).fill({})} // Tạo danh sách giả có 8 phần tử để hiển thị skeleton
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => (
            <Skeleton animation="wave" height={80}  style={styles.itemContainer} LinearGradientComponent={LinearGradient} />
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          numColumns={4}
          columnWrapperStyle={{ gap: 8 }}
          contentContainerStyle={styles.flatlistContainer}
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => handleCategoryPress(item)}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.icon }} style={styles.image} />
              </View>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          numColumns={4}
          columnWrapperStyle={{ gap: 8 }}
          contentContainerStyle={styles.flatlistContainer}
        />
      )}




      {/* Modal hiển thị sản phẩm */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={[styles.modalContainer, { justifyContent: 'flex-end' }]}>
          <View style={styles.modalContent}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>{selectedCategory?.name}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}>
                <Icon source="close" color={colors.red900} size={20} />
              </TouchableOpacity>
            </View>

            {selectedCategory &&
              products.filter(p =>
                selectedCategory.id === 1
                  ? p.tag === 'new'
                  : p.categoryId === selectedCategory.id,
              ).length === 0 ? (
              <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
            ) : (
              <FlatList
                data={
                  selectedCategory?.id === 1
                    ? products.filter(p => p.tag === 'new')
                    : products.filter(
                      p => p.categoryId === selectedCategory?.id,
                    )
                }
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.productItem}>
                    <Image source={{ uri: item.icon }} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <Text style={styles.productPrice}>
                        {formatCurrencyVND(item.price)}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.addButton}>
                      <Icon source="plus" color={colors.primary} size={20} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, justifyContent: 'center' },
  itemContainer: {
    alignItems: 'center',
    marginBottom: GLOBAL_KEYS.GAP_SMALL,
    // maxWidth: width / 4.5,
    width: width / 4.7,
    borderRadius: 6
    // flex: 1,
  },
  flatlistContainer: {
    marginHorizontal: 16,
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  imageContainer: {
    borderRadius: 34,
    backgroundColor: colors.green100,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  image: { width: 34, height: 34, resizeMode: 'contain', borderRadius: 34 },
  itemName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    marginTop: GLOBAL_KEYS.GAP_SMALL,
    textAlign: 'center',
    width: 68,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    marginHorizontal: GLOBAL_KEYS.PADDING_SMALL,
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: GLOBAL_KEYS.PADDING_SMALL,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: GLOBAL_KEYS.PADDING_SMALL,
  },
  productImage: {
    width: width / 4,
    height: height / 8,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  productInfo: { flex: 1, marginLeft: GLOBAL_KEYS.PADDING_DEFAULT },
  productName: { fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER, fontWeight: 'bold' },
  productPrice: { fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE, color: colors.red900 },
  addText: { color: colors.white, fontSize: 20, fontWeight: 'bold' },
  closeButton: { alignItems: 'center' },
  addButton: {
    backgroundColor: colors.green200,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  emptyText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    color: colors.gray,
    textAlign: 'center',
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
  },
});

// Danh mục
// const categories = [
//   {
//     id: 1,
//     name: 'Món Mới Phải Thử',
//     image: require('../../assets/images/image_category/image_new_dish.png'),
//   },
//   {
//     id: 2,
//     name: 'Trà trái cây',
//     image: require('../../assets/images/image_category/image_fruit_tea.png'),
//   },
//   {
//     id: 3,
//     name: 'Trà Xanh',
//     image: require('../../assets/images/image_category/image_green_tea.png'),
//   },
//   {
//     id: 4,
//     name: 'Cafe',
//     image: require('../../assets/images/image_category/image_coffee.png'),
//   },
//   {
//     id: 5,
//     name: 'Trà Sữa',
//     image: require('../../assets/images/image_category/image_milk_tea.png'),
//   },
//   {
//     id: 6,
//     name: 'Bánh Ngọt',
//     image: require('../../assets/images/image_category/image_cake.png'),
//   },
//   {
//     id: 7,
//     name: 'Món Ngon',
//     image: require('../../assets/images/image_category/image_delicious_food.png'),
//   },
// ];

// Sản phẩm
const products = [
  {
    id: 1,
    name: 'Trà Xanh Matcha',
    price: 45000,
    categoryId: 3,
    image: require('../../assets/images/imgae_product_combo/product.png'),
  },
  {
    id: 2,
    name: 'Cafe Sữa',
    price: 35000,
    categoryId: 4,
    image: require('../../assets/images/imgae_product_combo/product.png'),
  },
  {
    id: 3,
    name: 'Trà Sữa Trân Châu',
    price: 50000,
    categoryId: 5,
    image: require('../../assets/images/imgae_product_combo/product.png'),
  },
  {
    id: 4,
    name: 'Bánh Ngọt Tiramisu',
    price: 55000,
    categoryId: 6,
    image: require('../../assets/images/imgae_product_combo/product.png'),
  },
  {
    id: 5,
    name: 'Trà Đào Cam Sả',
    price: 48000,
    categoryId: 2,
    image: require('../../assets/images/imgae_product_combo/product.png'),
  },
  {
    id: 6,
    name: 'Bánh Mousse Chanh Leo',
    price: 52000,
    categoryId: 6,
    image: require('../../assets/images/imgae_product_combo/product.png'),
  },
  {
    id: 7,
    name: 'Trà Lài',
    price: 38000,
    categoryId: 3,
    image: require('../../assets/images/imgae_product_combo/product.png'),
  },
  {
    id: 8,
    name: 'Nước Ép Dâu Tây',
    price: 42000,
    categoryId: 2,
    image: require('../../assets/images/imgae_product_combo/product.png'),
    tag: 'new',
  },
  {
    id: 9,
    name: 'Sinh Tố Bơ',
    price: 50000,
    categoryId: 2,
    image: require('../../assets/images/imgae_product_combo/product.png'),
    tag: 'new',
  },
];
