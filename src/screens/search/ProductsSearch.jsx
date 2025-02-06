import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {Icon} from 'react-native-paper';
import {CustomSearchBar, LightStatusBar, Row, Column} from '../../components';
import {GLOBAL_KEYS, colors} from '../../constants';
import {TextFormatter} from '../../utils';
import {ShoppingGraph} from '../../layouts/graphs';
import ChangeRecipientInformationSheet from '../../components/bottom-sheets/ChangeRecipientInformationSheet';

const {width} = Dimensions.get('window');

const ProductsSearch = props => {
  const {navigation} = props;

  const [searchQuery, setsearchQuery] = useState('');

  const [filteredProducts, setFilteredProducts] = useState(productsFavorite);

  const handleSearch = query => {
    setsearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(productsFavorite);
    } else {
      const filtered = productsFavorite.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  };

  const navigateProductDetail = id => {
    navigation.navigate(ShoppingGraph.ProductDetailSheet, {id});
  };

  return (
    <View style={styles.content}>
      <LightStatusBar />
      <Row style={{padding: GLOBAL_KEYS.PADDING_DEFAULT}}>
        <CustomSearchBar
          placeholder="Tìm kiếm..."
          searchQuery={searchQuery}
          setSearchQuery={handleSearch}
          onClearIconPress={() => setsearchQuery('')}
          leftIcon="magnify"
          rightIcon="close"
          style={{flex: 1, elevation: 3}}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={styles.canerText}>Huỷ</Text>
        </TouchableOpacity>
      </Row>
      <Body
        navigateProductDetail={navigateProductDetail}
        filteredProducts={filteredProducts}
      />

      <ChangeRecipientInformationSheet />
    </View>
  );
};
const Body = ({navigateProductDetail, filteredProducts}) => {
  return (
    <View style={styles.flatListContent}>
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <Item item={item} navigateProductDetail={navigateProductDetail} />
        )}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const Item = ({item, navigateProductDetail}) => {
  return (
    <Row style={styles.itemContainer}>
      <View style={styles.imageWrapper}>
        <Image source={{uri: item.image}} style={styles.itemImage} />
        {item.discount > 0 && (
          <Text style={styles.discountBadge}>
            {TextFormatter.formatCurrency((item.discount * item.price) / 100)}
          </Text>
        )}
      </View>
      <Column>
        <Text style={styles.itemName}>{item.name}</Text>
        <Row>
          {item.discount > 0 && (
            <Text
              style={[styles.itemPrice, {textDecorationLine: 'line-through'}]}>
              {TextFormatter.formatCurrency(item.price)}
            </Text>
          )}
          <Text style={[styles.itemPrice, {fontWeight: 'bold'}]}>
            {TextFormatter.formatCurrency(
              item.price - (item.discount * item.price) / 100,
            )}
          </Text>
        </Row>
      </Column>
      <TouchableOpacity
        onPress={() => navigateProductDetail(item.id)}
        style={styles.addButton}>
        <Icon
          source="plus"
          color={colors.white}
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        />
      </TouchableOpacity>
    </Row>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.white,
    flex: 1,
  },
  canerText: {
    padding: GLOBAL_KEYS.PADDING_SMALL,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    color: colors.primary,
  },
  flatListContainer: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  flatListContent: {
    backgroundColor: colors.grayBg,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    flex: 1,
  },
  itemContainer: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    elevation: 1.7,
  },
  imageWrapper: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  itemImage: {
    width: width / 5,
    height: width / 5,
    resizeMode: 'cover',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  discountBadge: {
    position: 'absolute',
    backgroundColor: colors.primary,
    paddingLeft: GLOBAL_KEYS.PADDING_SMALL,
    paddingRight: GLOBAL_KEYS.PADDING_SMALL,
    textAlign: 'center',
    borderTopRightRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderBottomLeftRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    end: 0,
    top: GLOBAL_KEYS.PADDING_SMALL,
    color: colors.white,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    elevation: 5,
    fontWeight: '500',
  },
  itemName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '400',
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
    position: 'absolute',
    end: GLOBAL_KEYS.PADDING_DEFAULT,
    bottom: GLOBAL_KEYS.PADDING_DEFAULT,
  },
});

const productsFavorite = [
  {
    id: '1',
    name: 'Combo 2 Trà Sữa Trân Châu Hoàng Kim',
    image:
      'https://thuytinhluminarc.com/wp-content/uploads/2022/08/Hinh-anh-nhung-ly-tra-sua-dep-3-1.jpg',
    price: 69000,
    discount: 10,
  },
  {
    id: '2',
    name: 'Combo 5 Olong Tea',
    image:
      'https://i.pinimg.com/736x/30/e2/4a/30e24a9f2fc4ca01b9b969b9aed83cad.jpg',
    price: 79000,
    discount: 15,
  },
  {
    id: '3',
    name: 'Combo 4 Olong Tea',
    image: 'https://ambalgvn.org.vn/wp-content/uploads/anh-tra-sua-478.jpg',
    price: 79000,
    discount: 5,
  },
  {
    id: '4',
    name: 'Combo 3 macao Tea',
    image: 'https://ambalgvn.org.vn/wp-content/uploads/anh-tra-sua-478.jpg',
    price: 79000,
    discount: 0,
  },
];

export default ProductsSearch;
