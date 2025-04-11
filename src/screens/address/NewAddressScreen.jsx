import React, {useState, useEffect, useRef} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ToastAndroid,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import {
  FlatInput,
  LightStatusBar,
  NormalHeader,
  NormalText,
  PrimaryButton,
  CustomSearchBar,
  OverlayStatusBar,
  EmptyView,
  NormalInput,
} from '../../components';
import {Icon} from 'react-native-paper';
import {colors, GLOBAL_KEYS} from '../../constants';
import axios from 'axios';
import {postAddress} from '../../axios';
import LabelInput from '../../components/inputs/LabelInput';
import { Toaster } from '../../utils';
const {width, height} = Dimensions.get('window');

const GOONG_API_KEY = 'stT3Aahcr8XlLXwHpiLv9fmTtLUQHO94XlrbGe12';
const GOONG_PLACE_API = 'https://rsapi.goong.io/Place/AutoComplete';
const SEARCH_RADIUS = 2000;
const RESULT_LIMIT = 8;
const GOONG_DETAIL_API = 'https://rsapi.goong.io/Place/Detail';

const NewAddressScreen = props => {
  const {navigation} = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [locationDetail, setLocationDetail] = useState({});
  const [loading, setLoading] = useState(false);
  

  const [consigneeName, setConsigneeName] = useState('');
   const [nameMessage, setNameMessage] = useState('');
  const [consigneePhone, setConsigneePhone] = useState('');
   const [phoneNumberMessage, setPhoneNumberMessage] = useState('');

   const [addressMessage, setAddressMessage] = useState('');
  // console.log(locationDetail);
  const validateForm = () => {
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    let valid = true
    if (selectedAddress.trim() === '') {
      setAddressMessage('Trường này không được để trống');
      valid = false
    }
    if (consigneeName.trim() === '') {
      setNameMessage('Trường này không được để trống');
      valid = false
    }
    if (consigneePhone.trim() === '' || !phoneRegex.test(consigneePhone.trim())) {
      setPhoneNumberMessage('Vui lòng nhập số điện thoại hợp lệ (10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09)');
      valid = false
    }

    return valid;
  }

  const handleSaveAddress = async () => {
    console.log('bam nut')
    if (validateForm()) {
      const payload = {
        specificAddress: locationDetail.specificAddress,
          ward: locationDetail.commune,
          district: locationDetail.district,
          province: locationDetail.province,
          consigneePhone: consigneeName ,
        consigneeName : consigneePhone,
        latitude: String(locationDetail.lat),
        longitude: String(locationDetail.lng),
      };
      console.log('Tạo địa chỉ thành công:', JSON.stringify(payload, null, 2));
      try {
        setLoading(true)
        const response = await postAddress(payload);
        Toaster.show('Lưu thành công!');
        navigation.goBack();
      } catch (error) {
        console.error('Lỗi khi tạo địa chỉ:', error);
        Toaster.show('Vui lòng điền đầy đủ thông tin!');

      }
      finally{setLoading(false)}
    }
  };
  return (
    <View style={{backgroundColor: colors.white}}>
      <LightStatusBar />
      <NormalHeader
        title="Thêm địa chỉ mới"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={{margin: 16, gap: 16}}>
        <LabelInput label={'Địa chỉ của bạn'} required={true} style={{fontSize: 14}}/>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.btnAddress} disabled={loading}>
          <Text style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT}}>
            {selectedAddress}
          </Text>
        </TouchableOpacity>
        {addressMessage && <Text style={styles.errorText}>{addressMessage}</Text>}
        <NormalInput
          required
          label="Người nhận"
          setValue={text => {
            if (nameMessage) {
              setNameMessage('')
            }
            setConsigneeName(text);
          }}
          value={consigneeName}
          placeholder=""
          invalidMessage={nameMessage}
          
        />
        <NormalInput
          required
          label="Số điện thoại"
          setValue={text => {
            if (phoneNumberMessage) {
              setPhoneNumberMessage('');
            }
            setConsigneePhone(text);
          }}
          value={consigneePhone}
          placeholder=""
          invalidMessage={phoneNumberMessage}
        />

        <PrimaryButton title="Lưu" onPress={handleSaveAddress} />
      </View>

      <ModalAddress
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectAddress={(addressText, detail) => {
          setSelectedAddress(addressText);
          setLocationDetail(detail);
          setModalVisible(false);
          setAddressMessage('')
        }}
      />
    </View>
  );
};

const ModalAddress = ({visible, onClose, onSelectAddress}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchTimeout = useRef(null);

  const fetchPlaceDetails = async (placeId, description) => {
    try {
      const response = await axios.get(GOONG_DETAIL_API, {
        params: {
          place_id: placeId,
          api_key: GOONG_API_KEY,
        },
      });
      const location = response.data.result.geometry.location;
      const address = response.data.result.compound;
      const specificAddress = response.data.result.name
      const detail = {
        specificAddress: specificAddress,
        commune: address.commune,
        district: address.district,
        province: address.province,
        lat: location.lat,
        lng: location.lng,
      };
      onSelectAddress(description, detail);
    } catch (error) {
      console.error('Lỗi lấy tọa độ:', error);
    }
  };

  const handleSearch = text => {
    setQuery(text);
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
          setSuggestions(response.data.predictions || []);
        } catch (error) {
          console.error('Lỗi tìm kiếm địa chỉ:', error);
        }
      }, 500);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <Modal visible={visible} animationType="none" transparent={true}>
      <OverlayStatusBar />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: 'center',
        }}>
        <View
          style={{
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 10,
            height: height / 1.5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.green100,
              borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
              paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL,
              height: 50,
            }}>
            <Icon
              source="magnify"
              size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
              color={colors.primary}
            />
            <TextInput
              placeholder="Tìm kiếm địa chỉ"
              value={query}
              onChangeText={handleSearch}
              style={{flex: 1}}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Icon
                  source="close"
                  size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>

          {suggestions.length > 0 ? (
            <FlatList
              data={suggestions}
              keyExtractor={item => item.place_id}
              renderItem={({item}) => (
                <CardSearch
                  description={item.description}
                  secondaryText={item.structured_formatting?.secondary_text}
                  onPress={() =>
                    fetchPlaceDetails(item.place_id, item.description)

                  }
                />
              )}
            />
          ) : (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <EmptyView />
            </View>
          )}

          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 10,
              backgroundColor: colors.white,
              padding: 16,
              borderRadius: 8,
              elevation: 1.5,
              borderColor: colors.fbBg,
              borderWidth: 1,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: colors.primary,
              }}>
              Đóng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const CardSearch = ({description, secondaryText, onPress}) => (
  <Pressable
    onPress={onPress}
    style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 16}}>
    <Icon
      source="google-maps"
      size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
      color={colors.primary}
    />
    <View style={{marginHorizontal: 10}}>
      <Text style={{fontWeight: '500', fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE}}>
        {description}
      </Text>
      {secondaryText && (
        <Text
          style={{
            color: colors.gray400,
            fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
          }}>
          {secondaryText}
        </Text>
      )}
    </View>
  </Pressable>
);

export default NewAddressScreen;

const styles = StyleSheet.create({
  btnAddress: {
    fontSize: 14,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
    errorText: {
      marginTop: 4,
      color: colors.red800,
      fontSize: 12,
    },
});
