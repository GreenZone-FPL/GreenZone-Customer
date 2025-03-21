import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  ToastAndroid
} from 'react-native';
import {Icon} from 'react-native-paper';
import {
  CustomFlatInput,
  FlatInput,
  NormalHeader,
  NormalLoading,
  PrimaryButton,
} from '../../components';
import {GLOBAL_KEYS, colors} from '../../constants';
import {AppContext} from '../../context/appContext';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import {NormalText } from '../../components';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { uploadFile } from '../../axios/modules/file';
import { updateUserProfile } from '../../axios/modules/user';

const {width} = Dimensions.get('window');

const UpdateProfileScreen = ({navigation, route}) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [avatar, setAvatar] = useState('');

  const genderOptions = [
    {label: 'Nam', value: 'Nam'},
    {label: 'Nữ', value: 'Nữ'},
    {label: 'Khác', value: 'Khác'},
  ];

  const { isLoggedIn } = useContext(AppContext);
  const { profile } = route.params;

  useEffect(() => {
    setLastName(profile.lastName || '');
    setFirstName(profile.firstName || '');
    setEmail(profile.email || '');
    setDob(profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date());
    setGender(
      profile.gender === 'male' ? 'Nam' :
      profile.gender === 'female' ? 'Nữ' :
      profile.gender === 'other' ? 'Khác' : null
    );
    setAvatar(profile.avatar || '');
  }, [isLoggedIn]);

  const openCamera = () => {
    const options = { saveToPhotos: true, mediaType: 'photo' };
    launchCamera(options, response => {
      if (response.didCancel || response.errorCode) return;
      const newImage = response?.assets[0]?.uri;
      if (newImage) {
        setSelectedImages([newImage]);
        uploadFile(newImage);
      }
    });
    setImagePickerVisible(false);
  };

  const openImageLibrary = () => {
    const options = { mediaType: 'photo', selectionLimit: 1 };
    launchImageLibrary(options, response => {
      if (response.didCancel || response.errorCode) return;
      const newImage = response.assets?.[0]?.uri;
      if (newImage) {
        setSelectedImages([newImage]);
        uploadFile(newImage);
      }
    });
    setImagePickerVisible(false);
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      let avatarUrl = avatar || '';
      if (selectedImages.length > 0 && selectedImages[0] !== avatar) {
        const uploadedUrl = await uploadFile(selectedImages[0]);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      const profileData = {
        firstName,
        lastName,
        email,
        dateOfBirth: dob.toISOString().split('T')[0],
        gender:
          gender === 'Nam' ? 'male' :
          gender === 'Nữ' ? 'female' :
          'other',
        avatar: avatarUrl,
      };
      const result = await updateUserProfile(profileData);
      console.log('Cập nhật thành công:', JSON.stringify(profileData, null, 2));
      ToastAndroid.show('Cập nhật thành công!', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView style={styles.container}>
      <NormalLoading visible={loading} />
      <ScrollView>
        <NormalHeader title="Cập nhật thông tin" onLeftPress={() => navigation.goBack()} />
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
          <Image
            style={styles.avatarImage}
            source={{
              uri: selectedImages[0] || avatar || 'https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg',
            }}
          />
            <TouchableOpacity
              style={styles.cameraIconContainer}
              onPress={() => setImagePickerVisible(true)}>
              <Icon size={16} color={colors.primary} source={'camera'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formContainer}>
          <FlatInput label="Họ" value={lastName} setValue={setLastName} />
          <FlatInput label="Tên" value={firstName} setValue={setFirstName} />
          <FlatInput
            label="Email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity onPress={() => setOpen(true)} style={styles.dropdown}>
            <Text style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT}}>
              {dob instanceof Date && !isNaN(dob)
                ? dob.toLocaleDateString('vi-VN', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })
                : 'Chọn ngày sinh'}
            </Text>
          </TouchableOpacity>

          <DatePicker
            modal
            open={open}
            date={dob}
            mode="date"
            locale="vi"
            title={'Chọn thời gian'}
            confirmText="Xác nhận"
            cancelText="Hủy"
            maximumDate={new Date()}
            onConfirm={selectedDate => {
              setOpen(false);
              setDob(selectedDate);
            }}
            onCancel={() => setOpen(false)}
          />

          <Dropdown
            data={genderOptions}
            labelField="label"
            valueField="value"
            value={gender}
            placeholder="Chọn giới tính"
            placeholderStyle={styles.placeholderText}
            style={styles.dropdown}
            selectedTextStyle={styles.dropdownText}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setGender(item.value);
              setIsFocus(false);
            }}
          />


          <PrimaryButton title="Cập nhật tài khoản" onPress={handleUpdateProfile} />


          <Modal
            visible={isImagePickerVisible}
            animationType="slide"
            transparent={true}>
            <View style={styles.imagePickerOverlay}>
              <View style={styles.imagePickerContainer}>
                <TouchableOpacity style={styles.option} onPress={openCamera}>
                  <NormalText text="Chụp ảnh mới" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.option}
                  onPress={openImageLibrary}>
                  <NormalText text="Chọn ảnh từ thư viện" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => setImagePickerVisible(false)}>
                  <NormalText text="Hủy bỏ" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fbBg,
    gap: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  avatar: {
    backgroundColor: colors.gray700,
    position: 'relative',
    width: width / 3,
    height: width / 3,
    borderRadius: width / 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    resizeMode: 'contain',
  },
  cameraIconContainer: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    end: 0,
    bottom: 0,
    margin: GLOBAL_KEYS.PADDING_SMALL,
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    borderRadius: GLOBAL_KEYS.ICON_SIZE_DEFAULT / 2,
    padding: 4
  },
  formContainer: {
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  dropdown: {
    borderColor: colors.primary,
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
    borderBottomWidth: 1,
    backgroundColor: colors.white,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: colors.black,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  imagePickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  imagePickerContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  option: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
});

export default UpdateProfileScreen;
