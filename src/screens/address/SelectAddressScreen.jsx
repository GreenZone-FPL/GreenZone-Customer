import React, {useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {getAddresses} from '../../axios';
import {LightStatusBar, NormalHeader, NormalLoading, CustomSearchBar} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {useAppContext} from '../../context/appContext';
import {UserGraph} from '../../layouts/graphs';
import {CartManager} from '../../utils';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';

const GOONG_API_KEY = 'stT3Aahcr8XlLXwHpiLv9fmTtLUQHO94XlrbGe12';
const GOONG_PLACE_API = 'https://rsapi.goong.io/Place/AutoComplete';
const SEARCH_RADIUS = 2000;
const RESULT_LIMIT = 10;
const GOONG_DETAIL_API = 'https://rsapi.goong.io/Place/Detail';

const SelectAddressScreen = ({navigation, route}) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isSearching, setIsSearching] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const {isUpdateOrderInfo} = route.params || false;
  const [loading, setLoading] = useState(false);
  const {cartDispatch} = useAppContext();
  const sessionToken = uuidv4();
  let searchTimeout = null;
  const [locationAvailable, setLocationAvailable] = useState(false);
  const [currentLocation, setCurrenLocation] = useState('');

<<<<<<< HEAD
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const response = await getAddresses();
        setAddresses(response || []);
      } catch (error) {
        console.log('Lỗi lấy địa chỉ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress(); // Gọi ngay khi component mount

    const interval = setInterval(() => {
      fetchAddress();
    }, 2000); // Cập nhật mỗi 2 giây

    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, []);
=======
  useFocusEffect(
    useCallback(() => {
      const fetchAddress = async () => {
        try {
          setLoading(true);
          const response = await getAddresses();
          setAddresses(response || []);
        } catch (error) {
          console.log('Lỗi lấy địa chỉ:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAddress(); // Gọi API khi màn hình được focus
  
    }, [])
  );
>>>>>>> 1d4279cca14e4a0753ca684432f3845ef54ebd9c

  // Lấy vị trí người dùng
  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      if (position.coords) {
        reverseGeocode({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      }
    });
  }, []);

  const reverseGeocode = async ({lat, long}) => {
    const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VI&apikey=Q9zv9fPQ8xwTBc2UqcUkP32bXAR1_ZA-8wLk7tjgRWo`;

    try {
      const res = await axios(api);
      if (res && res.status === 200 && res.data) {
        const items = res.data.items;
        setCurrenLocation(items[0]);
        setLocationAvailable(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onConfirmSearchAddress = async address => {
    if (!address) return;

    try {
      const response = await axios.get(GOONG_DETAIL_API, {
        params: {
          place_id: address.place_id,
          api_key: GOONG_API_KEY,
        },
      });
      const name = response.data.result.name;
      const {lat, lng} = response.data.result.geometry.location;

      const updatedAddress = {
        ...address,
        latitude: lat,
        longitude: lng,
        name,
      };

      setSelectedAddress(updatedAddress);
      const addressFinish = {
        _id: updatedAddress.place_id,
        latitude: String(updatedAddress.latitude),
        longitude: String(updatedAddress.longitude),
        location: updatedAddress.description,
        specificAddress: updatedAddress.name,
        province: updatedAddress.compound.province,
        district: updatedAddress.compound.district,
        ward: updatedAddress.compound.commune,
        isDefault: false,
      };
      if (isUpdateOrderInfo && cartDispatch) {
        CartManager.updateOrderInfo(cartDispatch, {
          shippingAddress: addressFinish.location,
          shippingAddressInfo: addressFinish,
        });
      }

      navigation.goBack();
    } catch (error) {
      console.error('❌ Lỗi khi lấy tọa độ:', error);
    }
  };
<<<<<<< HEAD

=======
  
>>>>>>> 1d4279cca14e4a0753ca684432f3845ef54ebd9c
  // Tìm kiếm
  const handleSearch = async text => {
    setSearchText(text);
    setIsSearching(true);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    if (text.length > 2) {
      searchTimeout = setTimeout(async () => {
        try {
          const response = await axios.get(GOONG_PLACE_API, {
            params: {
              input: text,
              api_key: GOONG_API_KEY,
              location: currentLocation,
              radius: SEARCH_RADIUS,
              limit: RESULT_LIMIT,
              more_compound: true,
              sessiontoken: sessionToken,
            },
          });
          setSearchResults(response.data.predictions || []);
        } catch (error) {
          console.error('Lỗi tìm kiếm địa chỉ:', error);
        }
      }, 500);
    } else {
      setSearchResults([]);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <NormalLoading visible={loading} />

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon source='chevron-left' size={36} color={colors.black} />
        </Pressable>
        <View style={{flex: 1}}>
          <CustomSearchBar 
          placeholder="Tìm kiếm cửa hàng ..."
          searchQuery={searchText}
          setSearchQuery={handleSearch}
          leftIconColor={colors.black}
          onClearIconPress={() => {
            setSearchText('');
            setSearchResults([]);
            setIsSearching(false);
          }}
          leftIcon="magnify"
          rightIcon="close"
          style={{ elevation: 3, backgroundColor: colors.fbBg }}
          onFocus={() => setIsSearching(true)}/>
        </View>

      </View>
      

      <ScrollView style={styles.content}>
<<<<<<< HEAD
        {
          isSearching &&
            searchResults.length > 0 &&
            searchResults.map(result => (
=======
      {isSearching && searchResults.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Địa chỉ tìm kiếm</Text>
            {searchResults.map(result => (
>>>>>>> 1d4279cca14e4a0753ca684432f3845ef54ebd9c
              <CardSearch
                key={result.place_id}
                address={{
                  place_id: result.place_id,
<<<<<<< HEAD
                  specificAddress: [
                    result.terms[1]?.value,
                    result.terms[0]?.value,
                  ].join(' '),
=======
                  specificAddress: [result.terms[1]?.value , result.terms[0]?.value].join(' '),
>>>>>>> 1d4279cca14e4a0753ca684432f3845ef54ebd9c
                  ward: result.terms[2]?.value || '',
                  district: result.terms[3]?.value || '',
                  province: result.terms[4]?.value || '',
                }}
                isSelected={selectedAddress?.place_id === result.place_id}
                onPress={() => {
                  setIsSearching(false);
                  setSearchText(result.description);
                  onConfirmSearchAddress(result);
                }}
              />
<<<<<<< HEAD
            ))
          // ) : addresses.length > 0 ? (
          //   addresses.map(address => (
          //     <Card
          //       address={address}
          //       key={address._id}
          //       isSelected={selectedAddress === address}
          //       onPress={() => setSelectedAddress(address)}
          //     />
          //   ))
          // ) : (
          //   <Text style={styles.emptyText}>Không có địa chỉ nào</Text>
          // )
        }
        {/* Nút Thêm ở góc dưới bên trái */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate(UserGraph.NewAddressScreen)}>
          <Icon source="plus" size={30} color={colors.primary} />
          <Text style={{textAlign: 'center'}}>Thêm địa chỉ mới</Text>
        </TouchableOpacity>
=======
            ))}
          </>
        ) : addresses.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Địa chỉ đã lưu</Text>
            {addresses.map(address => (
              <Card
                address={address}
                key={address._id}
                isSelected={selectedAddress === address}
                onPress={() => setSelectedAddress(address)}
              />
            ))}
          </>
        ) : (
          <Text style={styles.emptyText}>Không có địa chỉ nào</Text>
        )}
      {/* Nút Thêm ở góc dưới bên trái */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(UserGraph.NewAddressScreen)}>
        <Icon source="plus" size={24} color={colors.primary} />
        <Text style={{}}>Thêm địa chỉ mới</Text>
      </TouchableOpacity>
>>>>>>> 1d4279cca14e4a0753ca684432f3845ef54ebd9c
      </ScrollView>

      {/* Nút Xác nhận */}
      {selectedAddress && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => onConfirmAddress(selectedAddress)}>
          <Text style={styles.confirmText}>Xác nhận</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const Card = ({address, isSelected, onPress}) => (
  <Pressable
    style={[styles.card, isSelected && styles.selectedCard]}
    onPress={() => onPress(address)}>
    <View style={{marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: GLOBAL_KEYS.GAP_DEFAULT}}>
      <Icon
        source="google-maps"
        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        color={colors.primary}
      />
      <View style={styles.textContainer}>
        <Text style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE, fontWeight: '500'}}>
          {''}
          {`${address.specificAddress}`}
        </Text>
        <Text style={styles.location}>
          {''}
          {`${address.specificAddress}, ${address.ward}, ${address.district}, ${address.province}`}
        </Text>
        <Text style={styles.location}>{address.consigneePhone}, {address.consigneeName}</Text>
        
      </View>
    </View>
   
  </Pressable>
);
const CardSearch = ({address, isSelected, onPress}) => (
  <Pressable
    style={[styles.card, isSelected && styles.selectedCard]}
<<<<<<< HEAD
    onPress={() => onPress(address)}>
    <Icon
      source="google-maps"
      size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
      color={colors.primary}
    />
    <View style={styles.textContainer}>
      <Text style={styles.location}>
        Địa chỉ:{' '}
        {`${address.specificAddress}, ${address.ward}, ${address.district}, ${address.province}`}
      </Text>
=======
    onPress={() =>  onPress(address)}>
    <View style={{marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: GLOBAL_KEYS.GAP_DEFAULT}}>
      <Icon
        source="google-maps"
        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        color={colors.primary}
      />
      <View style={styles.textContainer}>
      <Text style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE, fontWeight: '500'}}>
          {''}
          {`${address.specificAddress}`}
        </Text>
        <Text style={styles.location}>
          {''}
          {`${address.specificAddress}, ${address.ward}, ${address.district}, ${address.province}`}
        </Text>
      </View>
>>>>>>> 1d4279cca14e4a0753ca684432f3845ef54ebd9c
    </View>
    
  </Pressable>
);

export default SelectAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayBg,
  },
  header:{
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    justifyContent: 'space-between',
    gap: GLOBAL_KEYS.GAP_DEFAULT,

  },
  content: {
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    marginBottom: 5
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  location: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    textAlign: 'justify',
    lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
  },
  textContainer: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    marginTop: 20,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: 8,
    width: '90%',
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmText: {
    color: colors.white,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1.5,
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle:{
    margin: 16,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
  },

});
