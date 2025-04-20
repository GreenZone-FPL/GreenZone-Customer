import React from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { TextFormatter } from '../../utils';
import { Column } from '../containers/Column';
import { NormalText } from '../texts/NormalText';
import { TitleText } from '../texts/TitleText';

const width = Dimensions.get('window').width;

export const ProductsListVertical = ({
  title = 'Món Mới Phải Thử',
  scrollEnabled = false,
  onItemClick,
  onIconClick,
  products,
}) => {
  return (
    <Column style={styles.container}>
      {
        title &&
        <TitleText text={title} />
      }

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
    </Column>
  );
};

const ItemProduct = ({ item, onItemClick, onIconClick }) => {
  return (
    <Pressable style={styles.itemProduct} onPress={onItemClick}>

      <FastImage
        source={{ uri: item.image, priority: FastImage.priority.high }}
        style={styles.itemImage}
        resizeMode={FastImage.resizeMode.cover}
      />

      <Column style={styles.productInfo}>
        <TitleText text={item.name} />

        <NormalText
          style={styles.productPrice}
          text={TextFormatter.formatCurrency(item.originalPrice)} />

      </Column>

      <TouchableOpacity onPress={onIconClick} style={styles.addButton}>
        <Icon source="plus" size={22} color={colors.white} />
      </TouchableOpacity>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  itemProduct: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    gap: 16
  },
  itemImage: {
    width: width / 4.5,
    height: width / 4.5,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  productInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  productPrice: {
    marginTop: GLOBAL_KEYS.PADDING_SMALL,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    color: colors.red900,
  },
  addButton: {
    alignSelf: 'flex-end',
    borderRadius: 20,
    backgroundColor: colors.primary,
    padding: 4,
  },
});
