import React from 'react';
import {
  Image,
  SafeAreaView,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import ScreenEnum from '../../constants/screenEnum';
import {Icon} from 'react-native-paper';
import colors from '../../constants/color';
const {width} = Dimensions.get('window');

const OrderScreen = props => {
  const {navigation} = props;

  const handleNavigateToProductDetail = () => {
    navigation.navigate(ScreenEnum.ProductDetail);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Body handleNavigateProductDetail={handleNavigateToProductDetail} />
    </SafeAreaView>
  );
};
export default OrderScreen;
const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={require('../../assets/images/ic_category.png')}
          style={styles.icon}
        />
        <TouchableOpacity>
          <Text style={styles.headerTitle}>Danh Mục</Text>
        </TouchableOpacity>
        <Icon source="chevron-down" color={colors.black} size={18} />
      </View>
      <View style={styles.headerRight}>
        <Icon source="magnify" color={colors.gray700} size={24} />
        <Icon source="heart-outline" color={colors.gray700} size={24} />
      </View>
    </View>
  );
};

const Body = ({handleNavigateToProductDetail}) => {
  // Chia dữ liệu thành nhóm
  const groupedCategories = [];
  for (let i = 0; i < categories.length; i += 8) {
    groupedCategories.push(categories.slice(i, i + 8));
  }

  const renderGroup = ({item}) => (
    <View style={styles.groupContainer}>
      {item.map(category => (
        <TouchableOpacity
          key={category.id}
          style={styles.itemContainer}
          onPress={handleNavigateToProductDetail}>
          <View style={styles.itemImageContainer}>
            <Image style={styles.itemImage} source={{uri: category.image}} />
          </View>
          <Text numberOfLines={2} style={styles.itemText}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View>
      <FlatList
        data={groupedCategories}
        renderItem={renderGroup}
        keyExtractor={(_, index) => index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const categories = [
  {
    id: '1',
    name: 'Món mới phải thử',
    image:
      'https://xingfutangvietnam.com/wp-content/uploads/2021/06/tra-sua-tran-chau-e1685431912430.png',
  },
  {
    id: '2',
    name: 'Trà trái cây',
    image:
      'https://gongcha.com.vn/wp-content/uploads/2022/06/Tra-sua-tran-chau-HK.png',
  },
  {
    id: '3',
    name: 'Trà xanh',
    image:
      'https://maycha.com.vn/wp-content/uploads/2023/10/tra-sua-tran-chau-vang-sua.png',
  },
  {
    id: '4',
    name: 'Cà phê',
    image:
      'https://xingfutangvietnam.com/wp-content/uploads/2021/06/tra-sua-tran-chau-e1685431912430.png',
  },
  {
    id: '5',
    name: 'Trà Sữa',
    image:
      'https://xingfutangvietnam.com/wp-content/uploads/2021/06/tra-sua-tran-chau-e1685431912430.png',
  },
  {
    id: '6',
    name: 'Bánh ngọt',
    image:
      'https://xingfutangvietnam.com/wp-content/uploads/2021/06/tra-sua-tran-chau-e1685431912430.png',
  },
  {
    id: '7',
    name: 'Món ngon',
    image:
      'https://xingfutangvietnam.com/wp-content/uploads/2021/06/tra-sua-tran-chau-e1685431912430.png',
  },
];

const styles = StyleSheet.create({
  //OrderScreen
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  //Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
  },
  icon: {
    width: 20,
    height: 20,
  },
  //Item
  groupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - 32,
    gap: 10,
    marginLeft: 16,
  },
  itemContainer: {
    width: width / 4 - 16,
    marginVertical: 10,
    alignItems: 'center',
  },
  itemImageContainer: {
    width: width / 6,
    height: width / 6,
    borderRadius: width / 12,
    backgroundColor: colors.green100,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: width / 12,
  },
  itemText: {
    fontSize: 14,
    fontWeight: 'Regular',
    textAlign: 'center',
    color: colors.black,
  },
});
