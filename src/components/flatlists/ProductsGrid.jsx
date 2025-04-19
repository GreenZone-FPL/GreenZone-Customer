import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Icon} from 'react-native-paper';
import {colors, GLOBAL_KEYS} from '../../constants';
import {TextFormatter} from '../../utils';
import {Column} from '../containers/Column';
import {Row} from '../containers/Row';

const width = Dimensions.get('window').width;

export const ProductsGrid = ({
  title = 'Món Mới Phải Thử',
  scrollEnabled = false,
  onItemClick,
  onIconClick,
  products,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={products}
        numColumns={2} // Chuyển thành grid 2 cột
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => (
          <ItemProduct
            item={item}
            onItemClick={() => onItemClick(item._id)}
            onIconClick={() => onIconClick(item._id)}
          />
        )}
        contentContainerStyle={styles.flatListContentContainer}
        columnWrapperStyle={styles.columnWrapper} // Thêm style để tạo khoảng cách giữa các cột
        scrollEnabled={scrollEnabled}
      />
    </View>
  );
};

const ItemProduct = ({item, onItemClick, onIconClick}) => {
  return (
    <View style={styles.itemProduct}>
      <TouchableOpacity onPress={onItemClick}>
        <FastImage
          source={{uri: item.image, priority: FastImage.priority.high}}
          style={styles.itemImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>

      <Row
        style={{
          backgroundColor: 'white',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <Column style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>
            {TextFormatter.formatCurrency(item.originalPrice)}
          </Text>
        </Column>

        <TouchableOpacity onPress={onIconClick} style={styles.addButton}>
          <Icon source="plus" size={22} color={colors.white} />
        </TouchableOpacity>
      </Row>
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
    fontSize: 18,
    fontWeight: '500',
    color: colors.black,
  },
  flatListContentContainer: {
    paddingBottom: 16,
    gap: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  itemProduct: {
    width: (width - GLOBAL_KEYS.PADDING_DEFAULT * 3) / 2, // Chia đều 2 cột
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingVertical: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: width / 2.2,
    height: width / 1.8,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  productInfo: {
    marginTop: 8,
    alignItems: 'flex-start',
    width: '65%',
  },
  productName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
    color: colors.black
  },
  productPrice: {
    marginTop: 4,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    color: colors.red900,
  },
  addButton: {
    borderRadius: 20,
    backgroundColor: colors.primary,
    padding: 6,
    marginTop: 8,
  },
});
