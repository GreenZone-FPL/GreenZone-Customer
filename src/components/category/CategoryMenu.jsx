import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { GLOBAL_KEYS, colors } from '../../constants';
import Skeleton from '../../components/category/Skeleton';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const CategoryMenu = props => {

  const { categories, loading, onCategorySelect } = props
 
  return (
    <View style={styles.container}>
      {loading ? (
        <FlatList
          data={Array(8).fill({})} // Tạo danh sách giả có 8 phần tử để hiển thị skeleton
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => (
            <Skeleton height={80} width={'23%'} borderRadius={8} />
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
              onPress={() => onCategorySelect(item)}
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


