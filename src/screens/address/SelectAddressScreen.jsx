import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Icon, IconButton } from 'react-native-paper';
import { getAddresses } from '../../axios';
import { Column, CustomSearchBar, NormalLoading, NormalText, PrimaryButton, TitleText } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { UserGraph } from '../../layouts/graphs';
import { CartManager, Toaster } from '../../utils';

import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const GOONG_API_KEY = 'stT3Aahcr8XlLXwHpiLv9fmTtLUQHO94XlrbGe12';
const GOONG_PLACE_API = 'https://rsapi.goong.io/Place/AutoComplete';
const SEARCH_RADIUS = 2000;
const RESULT_LIMIT = 10;
const GOONG_DETAIL_API = 'https://rsapi.goong.io/Place/Detail';

const SelectAddressScreen = ({ navigation, route }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isSearching, setIsSearching] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { isUpdateOrderInfo } = route.params || false;
  const [loading, setLoading] = useState(false);
  const { cartDispatch } = useAppContext();
  const sessionToken = uuidv4();
  let searchTimeout = null;
  const [locationAvailable, setLocationAvailable] = useState(false);
  const [currentLocation, setCurrenLocation] = useState('');

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

  const reverseGeocode = async ({ lat, long }) => {
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
      const { lat, lng } = response.data.result.geometry.location;

      const updatedAddress = {
        ...address,
        latitude: lat,
        longitude: lng,
        name,
      };

      setSelectedAddress(updatedAddress);
      const addressFinish = {
        location: updatedAddress.description,
        latitude: String(updatedAddress.latitude),
        longitude: String(updatedAddress.longitude),
      };
      if (isUpdateOrderInfo && cartDispatch) {

        CartManager.updateOrderInfo(cartDispatch, {
          shippingAddressInfo: addressFinish,
        });
        navigation.goBack();
      }


    } catch (error) {
      console.error('❌ Lỗi khi lấy tọa độ:', error);
    }
  };
  const onConfirmAddress = async address => {
    navigation.goBack();
    try {
      const addressFinish = {
        location: `${address.specificAddress}, ${address.ward}, ${address.district}, ${address.province}`,
        latitude: address.latitude,
        longitude: address.longitude,
        consigneeName: address.consigneeName,
        consigneePhone: address.consigneePhone,
      };

      if (isUpdateOrderInfo && cartDispatch) {
        CartManager.updateOrderInfo(cartDispatch, {
          shippingAddressInfo: addressFinish,
          consigneeName: addressFinish.consigneeName,
          consigneePhone: addressFinish.consigneePhone,
        });
      }
    } catch (error) {
      console.log('error', error)
      Toaster.show('Lỗi chọn địa chỉ')
    }
  
    

   
   
  };
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

          console.log(
            'response.data.predictions',
            JSON.stringify(response.data.predictions, null, 2),
          );
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
          <Icon source="arrow-left" size={24} color={colors.black} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <CustomSearchBar
            placeholder="Tìm kiếm địa chỉ ..."
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
            style={{ backgroundColor: colors.fbBg }}
            onFocus={() => setIsSearching(true)} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {isSearching && searchResults.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Địa chỉ tìm kiếm</Text>
            {searchResults.map(result => (
              <CardSearch
                key={result.place_id}
                address={{
                  place_id: result.place_id,
                  specificAddress: [result.terms[1]?.value, result.terms[0]?.value].join(' '),
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
                onPress={() => {
                  if (selectedAddress?._id === address._id) {
                    setSelectedAddress(null);
                  } else {
                    setSelectedAddress(address);
                  }
                }}
              />
            ))}
          </>
        ) : (
          <Text style={styles.emptyText}>Bạn chưa tạo mới địa chỉ nào</Text>
        )}

        <Pressable
          style={styles.fab}
          onPress={() => navigation.navigate(UserGraph.NewAddressScreen)}>
          <Icon source="plus" size={24} color={colors.primary} />
          <NormalText text='Thêm địa chỉ mới' />

        </Pressable>
      </ScrollView>

      {/* Nút Xác nhận */}
      {selectedAddress && (
        <PrimaryButton
          title='Xác nhận'
          style={{ margin: 16 }}
          onPress={() => onConfirmAddress(selectedAddress)} />
      )}
    </SafeAreaView>
  );
};

const Card = ({ address, isSelected, onPress }) => (
  <Pressable
    style={[styles.card]}
    onPress={() => onPress(address)}>
    <IconButton
      icon='google-maps'
      size={24}
      iconColor={isSelected ? colors.white : colors.green500}
      containerColor={isSelected ? colors.lemon : colors.white}
    />

    <Column style={styles.textContainer}>

      <TitleText text={`${address.specificAddress}`} />
      <NormalText
        style={{ fontWeight: '500', color: colors.earthYellow }}
        text={`${address.consigneeName} - ${address.consigneePhone}`} />
      <NormalText
        style={{ color: colors.gray850 }}
        text={`${address.specificAddress}, ${address.ward}, ${address.district}, ${address.province}`} />

    </Column>

  </Pressable>
);
const CardSearch = ({ address, isSelected, onPress }) => (
  <Pressable
    style={[styles.card, isSelected && styles.selectedCard]}
    onPress={() => onPress(address)}>

    <Icon
      source="google-maps"
      size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
      color={colors.primary}
    />
    <Column style={styles.textContainer}>

      <TitleText text={`${address.specificAddress}`} />
      <NormalText
        style={{ color: colors.gray850 }}
        text={`${address.specificAddress}, ${address.ward}, ${address.district}, ${address.province}`} />
    </Column>

  </Pressable>
);

export default SelectAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    justifyContent: 'space-between',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  content: {
    backgroundColor: colors.fbBg,
    flex: 1
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    marginBottom: 5,
    gap: 8


  },
  selectedCard: {
    backgroundColor: colors.yellow300,

  },
  location: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    textAlign: 'justify',
    lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    color: colors.black,
  },
  textContainer: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    color: colors.black,
    margin: 20,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1.5,
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    margin: 16,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
    color: colors.gray850
  },
});
