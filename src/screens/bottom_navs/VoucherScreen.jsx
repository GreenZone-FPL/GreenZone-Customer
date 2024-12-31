import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import colors from '../../constants/color';

const menuData = [
  {
    category: 'Món Mới Phải Thử',
    items: [
      {
        id: '1',
        name: 'Cà phê sữa đá',
        description:
          'Hương vị truyền thống của cà phê Việt Nam, đậm đà với sữa đặc ngọt ngào.',
        price: '35,000đ',
        image: require('../../assets/images/product.png'),
      },
      {
        id: '2',
        name: 'Americano nóng/lạnh',
        description:
          'Cà phê nguyên chất hòa quyện với nước nóng/lạnh, vị thanh nhẹ.',
        price: '40,000đ',
        image: require('../../assets/images/product.png'),
      },
    ],
  },
  {
    category: 'Trà Trái Cây',
    items: [
      {
        id: '3',
        name: 'Trà đào cam sả',
        description:
          'Trà đào mát lạnh hòa quyện cùng vị cam chua nhẹ và hương sả thơm dịu.',
        price: '45,000đ',
        image: require('../../assets/images/product.png'),
      },
      {
        id: '4',
        name: 'Trà sữa chân trâu đường đen',
        description:
          'Trà sữa béo ngậu kết hợp với trân châu dai mềm, đường đen thơm lừng.',
        price: '50,000đ',
        image: require('../../assets/images/product.png'),
      },
    ],
  },
];

const MenuItem = ({item}) => (
  <View style={styles.menuItem}>
    <Image source={item.image} style={styles.image} />{' '}
    {/* Image source updated */}
    <View style={styles.info}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <TouchableOpacity style={styles.addButton}>
        <Image
          style={styles.imgAddButton}
          source={require('../../assets/images/ic_add_buttom.png')}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const MenuCategory = ({category, items}) => (
  <View style={styles.category}>
    <Text style={styles.categoryTitle}>{category}</Text>
    <FlatList
      data={items}
      renderItem={({item}) => <MenuItem item={item} />}
      keyExtractor={item => item.id}
    />
  </View>
);

const App = () => {
  return (
    <ScrollView style={styles.container}>
      {menuData.map(section => (
        <MenuCategory
          key={section.category}
          category={section.category}
          items={section.items}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  category: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: colors.green500,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.gray900,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.red900,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imgAddButton: {
    height: 20,
    width: 20,
  },
});

export default App;
