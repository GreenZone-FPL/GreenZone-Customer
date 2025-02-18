import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {CustomSearchBar, HeaderWithBadge} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {AppGraph} from '../../layouts/graphs/appGraph';
import {ShoppingGraph} from '../../layouts/graphs';
import Geocoder from 'react-native-geocoding';

const MerchantScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapView, setIsMapView] = useState(false); 


  const handleMerchant = item => {
    navigation.navigate(AppGraph.MerchantDetailSheet, {item});
  };

  const toggleView = () => {
    setIsMapView(!isMapView);
  };
  
  
  // Geocoder.init(process.env.MAP_API_KEY || ''); 
  // useEffect(() => {
  //   Geocoder.from('CVPM+9V Hồ Chí Minh').then(position => {
  //     position && console.log(position.results[0].geometry.location);
  //   });
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBadge title={isMapView ? 'Bản đồ' : 'Cửa hàng'} />

      <View style={styles.content}>
        <View style={styles.tool}>
          <CustomSearchBar
            placeholder="Tìm kiếm..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClearIconPress={() => setSearchQuery('')}
            leftIcon="magnify"
            rightIcon="close"
            style={{flex: 1, elevation: 3}}
          />

          <TouchableOpacity onPress={toggleView}>
            <View style={styles.map}>
              <Icon
                source="google-maps"
                size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                color={colors.primary}
              />
              <Text style={styles.normalText}>
                {isMapView ? 'Cửa hàng' : 'Bản đồ'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {isMapView ? (
          <View style={styles.mapView}>
            <Text style={styles.mapText}>Bản đồ sẽ hiển thị ở đây</Text>
            console.log(process.env.MAP_API_KEY)
          </View>
        ) : (
          <View>
            <View style={styles.mechant1}>
              <Text style={styles.tittle}>Cửa hàng gần bạn</Text>
              <FlatList
                data={data.slice(0, 1)}
                renderItem={({item}) => renderItem({handleMerchant, item})}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <Text style={styles.tittle}>Cửa hàng Khác</Text>
            <FlatList
              data={data}
              renderItem={({item}) => renderItem({handleMerchant, item})}
              keyExtractor={item => item.id}
              scrollEnabled={true}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const renderItem = ({item, handleMerchant}) => (
  <TouchableOpacity onPress={() => handleMerchant(item)} style={styles.item}>
    <Image source={{uri: item.image}} style={styles.imageItem} />
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
    location: 'HCM Cao Thang',
    distance: 'Cách đây 1 km',
    image:
      'https://minio.thecoffeehouse.com/image/admin/store/5bfe084efbc6865eac59c98a_to_20ngoc_20van.jpg',
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
  mapView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  normalText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    marginBottom: 8,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
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
});

export default MerchantScreen;
