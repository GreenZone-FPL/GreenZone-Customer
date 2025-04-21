import React from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Icon, IconButton } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../../constants';
import { TextFormatter } from '../../../utils';
import { TitleText, NormalText, Column, Row } from '../../../components';

const width = Dimensions.get('window').width;
type SuggestedListProps = {
  onItemClick: (id: string) => void,
  onIconClick: (id: string) => void,
  products: any[]
}

export const SuggestedList: React.FC<SuggestedListProps> = ({ onItemClick, onIconClick, products }) => {
  return (

    <FlatList
      data={products}
      renderItem={({ item: product }) => {
        return <ItemProduct
          key={product._id}
          item={product}
          onItemClick={() => onItemClick(product._id)}
          onIconClick={() => onIconClick(product._id)}
        />
      }}
      contentContainerStyle={{maxHeight: 500}}
    />
    // <Column style={styles.container}>
    //   {
    //     products.map((product: any) => {
    //       return (
    //         <ItemProduct
    //           key={product._id}
    //           item={product}
    //           onItemClick={() => onItemClick(product._id)}
    //           onIconClick={() => onIconClick(product._id)}
    //         />
    //       )
    //     })
    //   }
    // </Column>
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
          text={TextFormatter.formatCurrency(item.originalPrice)}
        />
      </Column>

      <TouchableOpacity onPress={onIconClick} style={styles.addButton}>
        <Icon source="plus" size={22} color={colors.white} />
      </TouchableOpacity>

    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 5,
    maxHeight: 500
  },
  itemProduct: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: colors.white,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    resizeMode: 'cover'
  },

  productInfo: {
    flexDirection: 'column',
    flex: 1,
    paddingVertical: 8
  },
  productPrice: {
    marginTop: GLOBAL_KEYS.PADDING_SMALL,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    color: colors.red900,
  },
  addButton: {
    alignSelf: 'flex-end',
    borderRadius: 6,
    backgroundColor: colors.primary,
    margin: 8,
    // padding: 4
  },
});
