import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { TextFormatter } from '../../utils';

export const ProductsListHorizontal = ({
  onItemClick,
  onIconClick,
  products
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Combo 69K + Freeship</Text>
          <Text style={styles.timeText}>08:00:00</Text>
        </View>
        <FlatList
          data={products}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => (
            <ItemProduct
              item={item}
              onItemClick={() => onItemClick(item._id)}
              onIconClick={() => onIconClick(item._id)}
            />
          )}
          horizontal={true}
          contentContainerStyle={{
            gap: GLOBAL_KEYS.GAP_DEFAULT,
          }}
          scrollEnabled={true}
        />
      </View>
    </View>
  );
};

const ItemProduct = ({ item, onItemClick, onIconClick }) => {

  return (
    <View style={styles.itemProduct}>
      <TouchableOpacity onPress={onItemClick}>
        <Image
          source={{ uri: String(item.image) }}
          style={styles.itemImage} />
      </TouchableOpacity>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>
          {TextFormatter.formatCurrency(item.sellingPrice)}
        </Text>
      </View>
      <Text numberOfLines={4} style={styles.productNameText}>
        {item.name}
      </Text>
      <TouchableOpacity
        onPress={onIconClick}
        style={styles.addButtonContainer}
      >
        <Icon
          source="plus"
          color={colors.primary}
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        />
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  headerContainer: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: colors.black,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
  },
  timeText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    color: colors.primary,
    marginLeft: GLOBAL_KEYS.PADDING_DEFAULT,
  },

  itemProduct: {
    backgroundColor: colors.black,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    flex: 1,
  },
  itemImage: {
    width: 157,
    height: 235,
    resizeMode: 'cover',
    opacity: 0.6,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  priceContainer: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    position: 'absolute',
    end: 0,
    padding: 4,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  priceText: {
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  productNameText: {
    color: colors.white,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: '20%',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    end: 0,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.white,
  },
});
