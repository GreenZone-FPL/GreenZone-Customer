import React, {useState, useEffect, useRef} from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  FlatInput,
  LightStatusBar,
  NormalHeader,
  PrimaryButton,
} from '../../components';
import {Icon} from 'react-native-paper';
import SelectLocation from './locations/SelectLocation';
import {colors, GLOBAL_KEYS} from '../../constants';
import axios from 'axios';
import {postAddress} from '../../axios';

const GOONG_API_KEY = 'stT3Aahcr8XlLXwHpiLv9fmTtLUQHO94XlrbGe12';
const GOONG_PLACE_API = 'https://rsapi.goong.io/Place/AutoComplete';
const SEARCH_RADIUS = 2000;
const RESULT_LIMIT = 10;
const GOONG_DETAIL_API = 'https://rsapi.goong.io/Place/Detail';

const NewAddressScreen = props => {
  const {navigation} = props;
  const [consigneeName, setConsigneeName] = useState('');
  const [consigneePhone, setConsigneePhone] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const searchTimeout = useRef(null);

  const [selectedAddress, setSelectedAddress] = useState({
    selectedProvince: null,
    selectedDistrict: null,
    selectedWard: null,
  });

  const handleAddressChange = address => {
    setSelectedAddress(prev => ({
      ...prev,
      ...address,
    }));
  };

  const handleConfirmAddress = () => {
    const {selectedProvince, selectedDistrict, selectedWard} = selectedAddress;
    const fullAddressText = [
      specificAddress,
      selectedWard || '',
      selectedDistrict || '',
      selectedProvince || '',
    ]
      .filter(Boolean)
      .join(', ');

    setSearchText(fullAddressText);
    setIsSearching(true);
    handleSearch(fullAddressText);
    console.log('Địa chỉ đầy đủ:', fullAddressText);
  };

  const fetchPlaceDetails = async placeId => {
    try {
      const response = await axios.get(GOONG_DETAIL_API, {
        params: {
          place_id: placeId,
          api_key: GOONG_API_KEY,
        },
      });
      const location = response.data.result.geometry.location;
      setLatitude(String(location.lat));
      setLongitude(String(location.lng));
      // console.log('Toạ độ đã chọn:', location.lat, location.lng);
    } catch (error) {
      console.error('Lỗi lấy tọa độ:', error);
    }
  };

  const handleSearch = text => {
    setSearchText(text);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    if (text.length > 2) {
      searchTimeout.current = setTimeout(async () => {
        try {
          const response = await axios.get(GOONG_PLACE_API, {
            params: {
              input: text,
              api_key: GOONG_API_KEY,
              radius: SEARCH_RADIUS,
              limit: RESULT_LIMIT,
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

  const handleSaveAddress = async () => {
    try {
      const {selectedProvince, selectedDistrict, selectedWard} =
        selectedAddress;

      const payload = {
        specificAddress,
        ward: selectedWard,
        district: selectedDistrict,
        province: selectedProvince,
        consigneePhone,
        consigneeName,
        latitude: String(latitude),
        longitude: String(longitude),
      };

      const response = await postAddress(payload);
      // console.log('Tạo địa chỉ thành công:', response);

      // Có thể điều hướng người dùng quay lại hoặc hiển thị thông báo
      navigation.goBack(); // hoặc showToast('Lưu thành công');
    } catch (error) {
      console.error('Lỗi khi tạo địa chỉ:', error);
      // showToast('Lưu thất bại, vui lòng thử lại');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title={isSearching ? 'Tìm kiếm địa chỉ' : 'Chọn địa chỉ'}
        onLeftPress={() => {
          if (isSearching) {
            setIsSearching(false);
            setSearchText('');
            setSearchResults([]);
          } else {
            navigation.goBack();
          }
        }}
        rightIcon={isSearching ? 'close' : 'magnify'}
        enableRightIcon={true}
        onRightPress={() => setIsSearching(!isSearching)}
      />

      {isSearching && (
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập địa chỉ..."
          value={searchText}
          onChangeText={handleSearch}
        />
      )}

      {isSearching && searchText.length > 2 && searchResults.length > 0 && (
        <ScrollView style={styles.content}>
          {searchResults.map(result => (
            <CardSearch
              key={result.place_id}
              address={{
                place_id: result.place_id,
                specificAddress: [
                  result.terms[1]?.value,
                  result.terms[0]?.value,
                ].join(' '),
                ward: result.terms[2]?.value || '',
                district: result.terms[3]?.value || '',
                province: result.terms[4]?.value || '',
              }}
              isSelected={searchText === result.description}
              onPress={() => {
                setIsSearching(false);
                setSearchText(result.description);
                setSelectedAddress({
                  selectedProvince: result.terms[4]?.value || '',
                  selectedDistrict: result.terms[3]?.value || '',
                  selectedWard: result.terms[2]?.value || '',
                });
                setSpecificAddress(
                  [result.terms[1]?.value, result.terms[0]?.value].join(' '),
                );
                console.log('Địa chỉ đã chọn:', result.description);
                fetchPlaceDetails(result.place_id);
              }}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.formContainer}>
        <SelectLocation onAddressChange={handleAddressChange} />
        <FlatInput
          label="Địa chỉ cụ thể"
          setValue={setSpecificAddress}
          value={specificAddress}
          placeholder="Ngõ/ngách/..."
          style={{marginBottom: 32}}
        />
        <TouchableOpacity
          style={styles.btnConfirm}
          onPress={handleConfirmAddress}>
          <Text style={{color: colors.primary}}>Xác nhận địa chỉ</Text>
        </TouchableOpacity>
        <FlatInput
          label="Người nhận"
          setValue={setConsigneeName}
          value={consigneeName}
          placeholder="Họ tên"
          style={{marginBottom: 32}}
        />
        <FlatInput
          label="Số điện thoại"
          setValue={setConsigneePhone}
          value={consigneePhone}
          placeholder="(+84)"
          style={{marginBottom: 32}}
        />
        <PrimaryButton title="Lưu" onPress={handleSaveAddress} />
      </View>
    </SafeAreaView>
  );
};

const CardSearch = ({address, isSelected, onPress}) => (
  <Pressable
    style={[styles.card, isSelected && styles.selectedCard]}
    onPress={() => onPress(address)}>
    <Icon
      source="google-maps"
      size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
      color={colors.primary}
    />
    <View style={styles.textContainer}>
      <Text>
        Địa chỉ:{' '}
        {`${address.specificAddress}, ${address.ward}, ${address.district}, ${address.province}`}
      </Text>
    </View>
  </Pressable>
);

export default NewAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  formContainer: {
    flex: 1,
    marginHorizontal: GLOBAL_KEYS.GAP_DEFAULT,
    marginBottom: GLOBAL_KEYS.GAP_DEFAULT,
  },
  location: {
    backgroundColor: colors.white,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomColor: colors.primary,
    borderBottomWidth: 1,
  },
  normalText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  btnConfirm: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    justifyContent: 'center',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    marginBottom: 32,
  },
  dropdown: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderBottomColor: colors.primary,
    borderBottomWidth: 3,
  },
  placeholderText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  dropdownText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  textContainer: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
    gap: 12,
    marginHorizontal: 16,
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  searchInput: {
    height: 40,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});
