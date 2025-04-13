import React, { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import { CustomSearchBar, NormalHeader, LightStatusBar } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { AppGraph } from '../../layouts/graphs/appGraph';
import { UserGraph } from '../../layouts/graphs';

const AddressMerchantScreen = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { navigation } = props;

  const handleMerchant = (item) => {
    navigation.navigate(AppGraph.MerchantDetailSheet, { item: item });
  };

  // Lọc danh sách cửa hàng dựa trên từ khóa tìm kiếm
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <NormalHeader title="Chọn cửa hàng" onLeftPress={() => navigation.goBack()} />
      <LightStatusBar />
      <View style={styles.content}>
        <View style={styles.tool}>
          <CustomSearchBar
            placeholder="Tìm kiếm..."
            searchQuery={searchQuery}
            setSearchQuery={(query) => {
              setSearchQuery(query);
              setIsSearching(query.length > 0);
            }}
            onClearIconPress={() => {
              setSearchQuery('');
              setIsSearching(false);
            }}
            leftIcon="magnify"
            rightIcon="close"
            style={{ flex: 1, elevation: 3 }}
          />
          <TouchableOpacity style={styles.map} onPress={() => navigation.navigate(UserGraph.MapAdressScreen)}>
            <Icon
              source="google-maps"
              size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
              color={colors.primary}
            />
            <Text style={styles.normalText}>Bản đồ</Text>
          </TouchableOpacity>
        </View>

        {isSearching ? (
          // Hiển thị danh sách tìm kiếm khi đang tìm kiếm
          <FlatList
            data={filteredData}
            renderItem={({ item }) => renderItem({ handleMerchant, item })}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
          />
        ) : (
          // Hiển thị danh sách bình thường khi chưa tìm kiếm
          <>
            <View style={styles.merchant1}>
              <Text style={[styles.title, { marginHorizontal: 16 }]}>Cửa hàng gần bạn</Text>
              <FlatList
                data={data.slice(0, 1)}
                renderItem={({ item }) => renderItem({ handleMerchant, item })}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <Text style={[styles.title, { marginHorizontal: 16 }]}>Cửa hàng Khác</Text>
            <FlatList
              data={data}
              renderItem={({ item }) => renderItem({ handleMerchant, item })}
              keyExtractor={(item) => item.id}
              scrollEnabled={true}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};


const renderItem = ({ item, handleMerchant }) => (
  <TouchableOpacity onPress={() => handleMerchant(item)} style={styles.item}>
    <Image source={{ uri: item.image }} style={styles.imageItem} />
    <View style={styles.infoItem}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.distance}>{item.distance}</Text>
    </View>
  </TouchableOpacity>
);

const data = [
  {
    id: '1',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 0,7 km',
    image:
      'https://minio.thecoffeehouse.com/image/admin/store/5b3b04d5fbc68621f3385253_5b3b04d5fbc68621f3385253_nguyen_20duy_20trinh.jpg',
  },
  {
    id: '2',
    name: 'GREEN ZONE',
    location: 'HCM QUAN 12',
    distance: 'Cách đây 1 km',
    image:
      'https://minio.thecoffeehouse.com/image/admin/store/5bfe084efbc6865eac59c98a_to_20ngoc_20van.jpg',
  },
  {
    id: '3',
    name: 'GREEN ZONE',
    location: 'HCM GO VAP',
    distance: 'Cách đây 3 km',
    image:
      'https://minio.thecoffeehouse.com/image/admin/store/5d147678696fb3596835615c_new_20city_20.jpg',
  },
  {
    id: '4',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 3.1 km',
    image:
      'https://minio.thecoffeehouse.com/image/admin/store/5d147678696fb3596835615c_new_20city_20.jpg',
  },
  {
    id: '5',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 3.3 km',
    image:
      'https://minio.thecoffeehouse.com/image/admin/store/5d147678696fb3596835615c_new_20city_20.jpg',
  },
  {
    id: '6',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 3.5 km',
    image:
      'https://minio.thecoffeehouse.com/image/admin/store/5d147678696fb3596835615c_new_20city_20.jpg',
  },
  {
    id: '7',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 4 km',
    image:
      'https://minio.thecoffeehouse.com/image/admin/store/5d147678696fb3596835615c_new_20city_20.jpg',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  tool: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    justifyContent: 'space-between',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  map: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'flex-end',
  },

  tittle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  distance: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    color: colors.gray400,
  },
  location: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray850,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    color: colors.black,
  },
  infoItem: {
    flex: 1,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  imageItem: {
    width: 80,
    height: 80,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    marginRight: GLOBAL_KEYS.PADDING_DEFAULT,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    marginBottom: 8,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  normalText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black
  }
});

export default AddressMerchantScreen

