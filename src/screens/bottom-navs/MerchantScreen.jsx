import { StyleSheet, Image, SafeAreaView, Text, View, ScrollView, TouchableOpacity, FlatList, TextInput, SectionList, Dimensions } from 'react-native'
<<<<<<< HEAD
import React, {useState} from 'react'
=======
import React from 'react'
>>>>>>> dai/setup-bottom-navigation
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import HeaderWithbadge from '../../components/headers/HeaderWithBadge'
import { Icon } from 'react-native-paper';
import CustomSearchBar from '../../components/inputs/CustomSearchBar';

// commit again Duong branch
<<<<<<< HEAD


const height = Dimensions.get('window').height
// const { width, height } = Dimensions.get('window')
console.log('Height:' , height)

const MerchantScreen = (props) => {
  const [searchQuery, setsearchQuery] = useState('')

=======
const { width, height } = Dimensions.get('window')

const MerchantScreen = (props) => {
>>>>>>> dai/setup-bottom-navigation
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithbadge title='Cửa hàng' />
      <View style={styles.content}>

        <View style={styles.tool}>

<<<<<<< HEAD
          <CustomSearchBar 
            placeholder="Tìm kiếm..."
            searchQuery={searchQuery}
            setSearchQuery={setsearchQuery}
            onClearIconPress={() => setsearchQuery('')}
            leftIcon="magnify"
            rightIcon="close"
            style={{ flex: 1, elevation: 3}}
           />
=======
       
>>>>>>> dai/setup-bottom-navigation
          <View style={styles.map}>
            <Icon source="google-maps" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
            <Text style={styles.textMap}>
              Bản đồ
            </Text>
          </View>
        </View>

        <View style={styles.mechant1}>
          <Text style={styles.tittle}>
            Cửa hàng gần bạn
          </Text>
          <FlatList
            data={data.slice(0, 1)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <Text style={styles.tittle}>
          Cửa hàng Khác
        </Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>

  )
}

<<<<<<< HEAD
=======

>>>>>>> dai/setup-bottom-navigation
const renderItem = ({ item }) => (
  <TouchableOpacity style={styles.item}>
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
    image: 'https://minio.thecoffeehouse.com/image/admin/store/5b3b04d5fbc68621f3385253_5b3b04d5fbc68621f3385253_nguyen_20duy_20trinh.jpg',
  },
  {
    id: '2',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 1 km',
    image: 'https://minio.thecoffeehouse.com/image/admin/store/5bfe084efbc6865eac59c98a_to_20ngoc_20van.jpg',
  },
  {
    id: '3',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 3 km',
    image: 'https://minio.thecoffeehouse.com/image/admin/store/5d147678696fb3596835615c_new_20city_20.jpg',
  },
  {
    id: '4',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 3.1 km',
    image: 'https://minio.thecoffeehouse.com/image/admin/store/5d147678696fb3596835615c_new_20city_20.jpg',
  },
  {
    id: '5',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 3.3 km',
    image: 'https://minio.thecoffeehouse.com/image/admin/store/5d147678696fb3596835615c_new_20city_20.jpg',
  },
  {
    id: '6',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 3.5 km',
    image: 'https://minio.thecoffeehouse.com/image/admin/store/5d147678696fb3596835615c_new_20city_20.jpg',
  },
  {
    id: '7',
    name: 'GREEN ZONE',
    location: 'HCM Cao Thang',
    distance: 'Cách đây 4 km',
    image: 'https://minio.thecoffeehouse.com/image/admin/store/5d147678696fb3596835615c_new_20city_20.jpg',
  },
];



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  tool: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    justifyContent: 'space-between'
  },
  map: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'flex-end'
  },

  tittle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    marginVertical: 10,
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
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  mechant1: {

  }

})


export default MerchantScreen