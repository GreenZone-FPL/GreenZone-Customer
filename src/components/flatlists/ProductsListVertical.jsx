import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { TextFormatter } from '../../utils';

const width = Dimensions.get('window').width;

export const ProductsListVertical = ({
  title = "Món Mới Phải Thử",
  scrollEnabled = false,
  onItemClick,
  onIconClick,
  products
}) => {



  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products}

        maxToRenderPerBatch={10}
        windowSize={5}
        nestedScrollEnabled
        initialNumToRender={10}

        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <ItemProduct
            item={item}
            onItemClick={() => onItemClick(item._id)}
            onIconClick={() => onIconClick(item._id)}
          />
        )}
        contentContainerStyle={{ gap: 16 }}
        scrollEnabled={scrollEnabled}
      />
    </View>
  );
};

const ItemProduct = ({ item, onItemClick, onIconClick }) => {


  return (
    <View style={styles.itemProduct}>
      <TouchableOpacity onPress={onItemClick}>

        <FastImage
          source={{ uri: item.image, priority: FastImage.priority.high }}
          style={styles.itemImage}
          resizeMode={FastImage.resizeMode.cover}
        />


      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
          {TextFormatter.formatCurrency(item.originalPrice)}
          {/* {item.originalPrice.toLocaleString('vi-VN')}đ */}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onIconClick}
        style={styles.addButton}>
        <Icon
          source="plus"
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
          color={colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    gap: GLOBAL_KEYS.GAP_DEFAULT,

  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
    color: colors.black,
  },

  flatListContentContainer: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  itemProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  itemImage: {
    width: width / 4.5,
    height: width / 4.5,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  productInfo: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  productName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  productPrice: {
    marginTop: GLOBAL_KEYS.PADDING_SMALL,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.red900,
  },
  addButton: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.primary,
    position: 'absolute',
    end: 0,
    bottom: 0,
  }

});


