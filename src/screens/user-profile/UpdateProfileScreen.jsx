import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import {
  NormalInput,
  NormalHeader,
  NormalLoading,
  NormalText,
  PrimaryButton,
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { AppContext, useAppContext } from '../../context/appContext';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { uploadFile } from '../../axios/modules/file';
import { updateUserProfile } from '../../axios/modules/user';
import { AppAsyncStorage, CartManager } from '../../utils';
import { AuthActionTypes } from '../../reducers';

import LabelInput from '../../components/inputs/LabelInput';

const { width } = Dimensions.get('window');

const UpdateProfileScreen = ({ navigation, route }) => {
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
  const [hasImageChanged, setHasImageChanged] = useState(false); // biến cờ mới

  const {
    updateOrderMessage,
    setUpdateOrderMessage,
    cartDispatch,
    authDispatch,
    authState,
  } = useAppContext();

  const genderOptions = [
    { label: 'Nam', value: 'Nam' },
    { label: 'Nữ', value: 'Nữ' },
    { label: 'Khác', value: 'Khác' },
  ];

  const { isLoggedIn } = useContext(AppContext);
  const { profile } = route.params;

  useEffect(() => {
    setLastName(profile.lastName || '');
    setFirstName(profile.firstName || '');
    setEmail(profile.email || '');
    setDob(profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date());
    setGender(
      profile.gender === 'male'
        ? 'Nam'
        : profile.gender === 'female'
          ? 'Nữ'
          : profile.gender === 'other'
            ? 'Khác'
            : null,
    );
    setAvatar(profile.avatar || '');
    setSelectedImages([]);
    setHasImageChanged(false);
  }, [isLoggedIn]);

  const openCamera = () => {
    const options = { saveToPhotos: true, mediaType: 'photo' };
    launchCamera(options, response => {
      if (response.didCancel || response.errorCode) return;
      const newImage = response?.assets[0]?.uri;
      // Nếu ảnh mới khác với ảnh hiện tại thì mới cập nhật state
      if (newImage && newImage !== avatar) {
        setSelectedImages([newImage]);
        setHasImageChanged(true);
      }
    });
    setImagePickerVisible(false);
  };

  const openImageLibrary = () => {
    const options = { mediaType: 'photo', selectionLimit: 1 };
    launchImageLibrary(options, response => {
      if (response.didCancel || response.errorCode) return;
      const newImage = response.assets?.[0]?.uri;
      if (newImage && newImage !== avatar) {
        setSelectedImages([newImage]);
        setHasImageChanged(true);
      }
    });
    setImagePickerVisible(false);
  };

  const validateEmail = email => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|vn|edu|gov|info|biz)$/;
    return emailRegex.test(email.trim());
  };
  const handleUpdateProfile = async () => {
    if (
      !lastName.trim() ||
      !firstName.trim() ||
      !email.trim() ||
      !dob ||
      !gender
    ) {
      ToastAndroid.show('Vui lòng điền đầy đủ thông tin!', ToastAndroid.SHORT);
      return;
    }

    if (!validateEmail(email)) {
      ToastAndroid.show(
        'Email không hợp lệ! Vui lòng nhập đúng định dạng.',
        ToastAndroid.SHORT,
      );
      return; // Ngăn chặn tiếp tục xử lý nếu email không hợp lệ
    }

    const formattedDob = dob.toISOString().split('T')[0];
    const formattedGender =
      gender === 'Nam' ? 'male' : gender === 'Nữ' ? 'female' : 'other';

    if (
      lastName === profile.lastName &&
      firstName === profile.firstName &&
      email.trim().toLowerCase() === profile.email.toLowerCase() &&
      formattedDob === profile.dateOfBirth &&
      formattedGender === profile.gender &&
      !hasImageChanged
    ) {
      ToastAndroid.show('Không có thay đổi nào!', ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);
      let avatarUrl = avatar || '';
      if (hasImageChanged && selectedImages.length > 0) {
        const uploadedUrl = await uploadFile(selectedImages[0]);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      const profileData = {
        firstName,
        lastName,
        email: email.trim().toLowerCase(),
        dateOfBirth: formattedDob,
        gender: formattedGender,
        avatar: avatarUrl,
      };

      console.log('Dữ liệu gửi lên API:', profileData);

      const result = await updateUserProfile(profileData);

      if (result?._id) {
        setHasImageChanged(false);
        await AppAsyncStorage.storeData(
          AppAsyncStorage.STORAGE_KEYS.user,
          result,
        );
        await authDispatch({
          type: AuthActionTypes.LOGIN,
          payload: {
            needLogin: false,
            needRegister: false,
            isLoggedIn: true,
            lastName: result.lastName,
          },
        });
        await CartManager.updateOrderInfo(cartDispatch, {
          consigneeName: `${result.lastName} ${result.firstName}`,
        });
        ToastAndroid.show('Cập nhật thành công!', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(
        'Lỗi cập nhật hồ sơ:',
        error.response?.data || error.message,
      );
      Alert.alert('Lỗi', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <NormalLoading visible={loading} />
      <ScrollView>
        <NormalHeader
          title="Cập nhật thông tin"
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image
              style={styles.avatarImage}
              source={{
                uri:
                  selectedImages[0] ||
                  avatar ||
                  'https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg',
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
          <NormalInput label="Họ" value={firstName} setValue={setLastName} />
          <NormalInput label="Tên" value={lastName} setValue={setFirstName} required />


          <LabelInput label='Ngày sinh'   style={{ fontSize: 14 }}/>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={styles.dropdown}>
            <Text style={{ fontSize: 14 }}>
              {dob instanceof Date && !isNaN(dob)
                ? dob.toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
                : 'Chọn ngày sinh'}
            </Text>
          </TouchableOpacity>

          <LabelInput label='Giới tính'  style={{ fontSize: 14 }}/>
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
            selectedTextStyle={styles.placeholderText}
            selectedTextProps={styles.placeholderText}
            itemTextStyle={styles.placeholderText}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setGender(item.value);
              setIsFocus(false);
            }}
          />

          <PrimaryButton
            disabled={loading}
            title="Cập nhật tài khoản"
            onPress={handleUpdateProfile}
          />

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
    backgroundColor: colors.white,
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
    padding: 4,
  },
  formContainer: {
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 14
  },

  placeholderText: {
    color: colors.black,
    fontSize: 14,
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
