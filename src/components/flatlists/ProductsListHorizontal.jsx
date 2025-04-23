import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { TextFormatter } from '../../utils';
import { Row } from '../containers/Row';

export const ProductsListHorizontal = ({
  title = 'Combo 69K + Freeship',
  onItemClick,
  onIconClick,
  products,
}) => {

  return (
    <View style={styles.container}>
    
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{title}</Text>
          {/* <Text style={styles.timeText}>08:00:00</Text> */}
        </View>
        <FlatList
          data={products}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => {

            return (
              <ItemProduct
                item={item}
                onItemClick={() => onItemClick(item._id)}
                onIconClick={() => onIconClick(item._id)}
              />
            );
          }}
          horizontal={true}
          contentContainerStyle={{
            gap: GLOBAL_KEYS.GAP_DEFAULT,
          }}
          scrollEnabled={true}
        />
    
    </View>
  );
};

const ItemProduct = ({ item, onItemClick, onIconClick }) => {
  return (
    <View style={styles.itemProduct}>
      <TouchableOpacity onPress={onItemClick}>
        <Image source={{ uri: String(item.image) }} style={styles.itemImage} />
      </TouchableOpacity>

      <Text numberOfLines={1} style={styles.productNameText}>
        {item.name}
      </Text>
      <Row style={styles.priceContainer}>
        <Text style={styles.priceText}>
          {TextFormatter.formatCurrency(item.sellingPrice)}
        </Text>
      </Row>

      <TouchableOpacity onPress={onIconClick} style={styles.addButtonContainer}>
        <Icon source="plus" color={colors.primary} size={22} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginBottom: 16
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: colors.earthYellow,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
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
    width: (Dimensions.get('window').width - 48) / 2,
    height: 245,
    resizeMode: 'cover',
    opacity: 0.7,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  priceContainer: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    position: 'absolute',
    end: 0,
    padding: 4,
    flexDirection: 'row',
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  priceText: {
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '700',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  productNameText: {
    position: 'absolute',
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    color: colors.white,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: '20%',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    end: 0,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 4,
  },
});
