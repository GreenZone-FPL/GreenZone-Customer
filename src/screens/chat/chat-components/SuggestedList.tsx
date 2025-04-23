import React from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Icon} from 'react-native-paper';
import {Column, NormalText, TitleText} from '../../../components';
import {GLOBAL_KEYS, colors} from '../../../constants';
import {TextFormatter} from '../../../utils';

const width = Dimensions.get('window').width;
type SuggestedListProps = {
  onItemClick: (id: string) => void;
  onIconClick: (id: string) => void;
  products: any[];
};

export const SuggestedList: React.FC<SuggestedListProps> = ({
  onItemClick,
  onIconClick,
  products,
}) => {
  return (
    <Column>
      {products.map((product: any) => {
        return (
          <ItemProduct
            key={product._id}
            item={product}
            onItemClick={() => onItemClick(product._id)}
            onIconClick={() => onIconClick(product._id)}
          />
        );
      })}
    </Column>
    // <FlatList
    //   data={products}
    //   renderItem={({item: product}) => {
    //     return (
    //       <ItemProduct
    //         item={product}
    //         onItemClick={() => onItemClick(product._id)}
    //         onIconClick={() => onIconClick(product._id)}
    //       />
    //     );
    //   }}
    //   contentContainerStyle={{gap: 4}}
    // />
  );
};

const ItemProduct = ({item, onItemClick, onIconClick}) => {
  return (
    <Pressable style={styles.itemProduct} onPress={onItemClick}>
      <FastImage
        source={{uri: item.image, priority: FastImage.priority.high}}
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

      <Pressable onPress={onIconClick} style={styles.addButton}>
        <Icon source="plus" size={20} color={colors.primary} />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 5,
    maxHeight: 500,
  },
  itemProduct: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: colors.white,
    marginBottom: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    resizeMode: 'cover',
  },

  productInfo: {
    flexDirection: 'column',
    flex: 1,
    paddingVertical: 8,
  },
  productPrice: {
    marginTop: GLOBAL_KEYS.PADDING_SMALL,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    color: colors.red900,
  },
  addButton: {
    alignSelf: 'flex-end',
    borderRadius: 20,
    backgroundColor: colors.green100,
    margin: 8,
    padding: 6,
  },
});
