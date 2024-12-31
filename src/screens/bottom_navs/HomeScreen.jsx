import { Image, SafeAreaView, View, Text, Button, FlatList, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import ScreenEnum from '../../constants/screenEnum';
import HeaderWithBadge from '../../components/headers/HeaderWithBadge';
import colors from '../../constants/color';
import LightStatusBar from '../../components/status_bars/LightStatusBar';


const { width } = Dimensions.get('window');

const HomeScreen = props => {
  const { navigation } = props;

  const handleNavigateToProductDetail = () => {
    navigation.navigate(ScreenEnum.ProductDetail);
  };

  return (
    <SafeAreaView style={styles.container}>

      <LightStatusBar />
      <HeaderWithBadge
        title="Home"
        onBadgePress={() => console.log('Click badge')}
        isHome={true}
      />

      <Button title='Open Modal' onPress={() => navigation.navigate("CustomModal")} />

    </SafeAreaView>
  );
};

export default HomeScreen;



const Body = ({ handleNavigateToProductDetail }) => {
  return (
    <View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleNavigateToProductDetail()}>
            <Item item={item} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const Item = ({ item }) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemImageContainer}>
      <Image style={styles.itemImage} source={{ uri: item.image }} />
    </View>
    <Text numberOfLines={2} style={styles.itemText}>
      {item.name}
    </Text>
  </View>
);

const categories = [
  {
    id: '1',
    name: 'Trà Sữa Trái Cây',
    image:
      'https://xingfutangvietnam.com/wp-content/uploads/2021/06/tra-sua-tran-chau-e1685431912430.png',
  },
  {
    id: '2',
    name: 'GongCha',
    image:
      'https://gongcha.com.vn/wp-content/uploads/2022/06/Tra-sua-tran-chau-HK.png',
  },
  {
    id: '3',
    name: 'MayCha',
    image:
      'https://maycha.com.vn/wp-content/uploads/2023/10/tra-sua-tran-chau-vang-sua.png',
  },
  {
    id: '4',
    name: 'Sữa Tươi',
    image:
      'https://xingfutangvietnam.com/wp-content/uploads/2021/06/tra-sua-tran-chau-e1685431912430.png',
  },
  {
    id: '5',
    name: 'Trà Sữa Trái Cây 2',
    image:
      'https://xingfutangvietnam.com/wp-content/uploads/2021/06/tra-sua-tran-chau-e1685431912430.png',
  },
  {
    id: '6',
    name: 'GongCha',
    image:
      'https://xingfutangvietnam.com/wp-content/uploads/2021/06/tra-sua-tran-chau-e1685431912430.png',
  },
  {
    id: '7',
    name: 'Trà Sữa Trái Cây',
    image:
      'https://xingfutangvietnam.com/wp-content/uploads/2021/06/tra-sua-tran-chau-e1685431912430.png',
  },
];

const styles = StyleSheet.create({
  //HomeScreen
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white
  },
  //Header
  header: {
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
    marginRight: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconSmall: {
    width: 10,
    height: 10,
  },
  iconMarginRight: {
    marginRight: 10,
  },
  //Item
  itemContainer: {
    flexDirection: 'column',
    width: (width / 10) * 2,
    alignItems: 'center',
  },
  itemImageContainer: {
    width: width / 10,
    height: width / 10,
    borderRadius: 50,
    backgroundColor: 'gray',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
