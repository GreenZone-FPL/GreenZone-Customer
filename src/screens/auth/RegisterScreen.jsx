import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState, useEffect} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Icon} from 'react-native-paper';
import {
  Column,
  Row,
  CustomFlatInput,
  NormalText,
  TitleText,
  Ani_ModalLoading,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';

import {AppAsyncStorage, Toaster} from '../../utils';
import {register} from '../../axios';
import {AppGraph} from '../../layouts/graphs';
import {baseURL} from '../../axios/axiosInstance';
import {useAppContext} from '../../context/appContext';
import {AuthActionTypes} from '../../reducers';
const RegisterScreen = ({navigation}) => {
  const [firstName, setFirstName] = useState('Bui');
  const [lastName, setLastName] = useState('Ngoc Dai');
  const [email, setEmail] = useState('dai@gmail.com');
  const [dateOfBirth, setDateOfBirth] = useState('2025-02-15');
  const [gender, setGender] = useState('Nam');
  const [avatar, setAvatar] = useState(null);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const {authDispatch} = useAppContext();

  const onSelectDate = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShow(false); // Ẩn picker nếu người dùng hủy
      return;
    }

    const currentDate = selectedDate || new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    setShow(false);
    setDateOfBirth(formattedDate);
  };

  const openImagePicker = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Image Picker Error', response.errorMessage);
      } else {
        setAvatar(response.assets[0].uri); // Lưu URI của hình ảnh
      }
    });
  };

  const validateForm = () => {
    let valid = true;
    if (!firstName) {
      setFirstNameError('Họ không được để trống');
      valid = false;
    } else {
      setFirstNameError('');
    }

    if (!lastName) {
      setLastNameError('Tên không được để trống');
      valid = false;
    } else {
      setLastNameError('');
    }

    if (!email) {
      setEmailError('Email không được để trống');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!dateOfBirth) {
      setDateOfBirthError('Ngày sinh không được để trống');
      valid = false;
    } else {
      setDateOfBirthError('');
    }

    if (!gender) {
      setGenderError('Giới tính không được để trống');
      valid = false;
    } else {
      setGenderError('');
    }

    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      let avatarUrl = '';

      // Nếu có avatar, tiến hành upload
      // if (avatar) {
      //   console.log("Uploading avatar...");
      //   const file = {
      //     uri: avatar,
      //     type: "image/jpeg",
      //     name: "avatar.jpg",
      //   };

      //   // Gọi API upload file
      //   const uploadResult = await uploadFileAPI(file);
      //   console.log('uploadResult', uploadResult.url)

      //   // Kiểm tra nếu upload thất bại
      //   if (uploadResult) {
      //     avatarUrl = uploadResult.url; // Lấy URL avatar từ kết quả upload
      //   } else {
      //     console.log("Upload avatar failed, proceeding without avatar.");
      //   }
      // }

      // Chuyển đổi giới tính
      const genderValue = gender === 'Nam' ? 'male' : 'female';

      // Tạo request
      const request = {
        firstName,
        lastName,
        email,
        dateOfBirth,
        gender: genderValue,
        avatar: '', // Nếu không có avatar thì truyền giá trị rỗng
      };

      // Gọi API đăng ký
      const result = await register(request);
      console.log('User registered:', result);

      Toaster.show('Đăng ký tài khoản thành công');
      // navigation.navigate(AppGraph.MAIN)
      authDispatch({type: AuthActionTypes.LOGIN});
    } catch (error) {
      console.log('Registration failed:', error);
      Toaster.show(error.message);
      authDispatch({type: AuthActionTypes.LOGIN});
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.innerContainer}
        keyboardShouldPersistTaps="handled">
        <Ani_ModalLoading loading={loading} />
        <Image
          source={require('../../assets/images/register_bg.png')}
          style={{width: '100%', height: 200}}
        />

        <Column style={styles.formContainer}>
          <TitleText text="GREEN ZONE" style={styles.title} />
          <Row style={{justifyContent: 'space-between'}}>
            <TitleText text="ĐĂNG KÝ TÀI KHOẢN" />

            {/* <TouchableOpacity
              onPress={() => navigation.navigate(AppGraph.MAIN)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TitleText text='Bỏ qua' style={{ color: colors.red900, fontWeight: '400' }} />
              <Icon
                source="chevron-right-circle"
                color={colors.red900}
                size={20}
              />
            </TouchableOpacity> */}
          </Row>

          <CustomFlatInput
            label="Họ"
            placeholder="Ví dụ: Nguyễn"
            value={firstName}
            setValue={setFirstName}
            message={firstNameError}
          />

          <CustomFlatInput
            label="Tên"
            placeholder="Ví dụ: Văn A"
            value={lastName}
            setValue={setLastName}
            message={lastNameError}
          />

          <CustomFlatInput
            label="Email"
            placeholder="Ví dụ: abc@gmail.com"
            value={email}
            keyboardType="email-address"
            setValue={setEmail}
            message={emailError}
          />

          <CustomFlatInput
            label="Ngày sinh"
            placeholder="Nhập ngày sinh"
            value={dateOfBirth}
            setValue={setDateOfBirth}
            onRightPress={() => setShow(true)}
            editable={false} // Không cho nhập trực tiếp
            message={dateOfBirthError}
            rightIcon="calendar-text"
            enableRightIcon
          />

          <CustomFlatInput
            label="Giới tính"
            placeholder="Chọn giới tính"
            value={gender}
            setValue={setGender}
            editable={false} // Không cho nhập trực tiếp
            message={genderError}
            enableRightIcon
            rightIcon="chevron-down-circle"
            onRightPress={() => setModalVisible(true)}
          />

          <DialogGender
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSelect={gender => {
              setGender(gender);
              setModalVisible(false);
            }}
          />

          <NormalText
            text="Upload avatar (Không bắt buộc)"
            style={{color: colors.primary}}
          />
          <Avatar uri={avatar} onPress={openImagePicker} />

          <RegisterButton onPress={handleRegister} title="ĐĂNG KÝ" />
        </Column>

        {show ? (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
            mode="date"
            display="default"
            onChange={onSelectDate}
          />
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const RegisterButton = ({title = 'Đăng ký', onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: colors.primary}]}
      onPress={onPress}>
      <View style={{width: 35, height: 35}}></View>
      <Text style={styles.buttonText}>{title}</Text>
      <Icon source="arrow-right-circle" color={colors.white} size={35} />
    </TouchableOpacity>
  );
};

const Avatar = ({uri, size = 100, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.avatarContainer,
          {width: size, height: size, borderRadius: size / 2},
        ]}>
        {uri ? (
          <Image
            source={{uri}}
            style={[
              styles.avatar,
              {width: size - 6, height: size - 6, borderRadius: (size - 6) / 2},
            ]}
          />
        ) : (
          <Image
            source={require('../../assets/images/default_image.png')}
            style={[
              styles.avatar,
              {width: size - 6, height: size - 6, borderRadius: (size - 6) / 2},
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const DialogGender = ({visible, onClose, onSelect}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Column style={styles.modalContainer}>
        <Column style={styles.modalContent}>
          <TitleText text="Chọn giới tính" style={{fontSize: 16}} />

          <TouchableOpacity
            style={styles.option}
            onPress={() => onSelect('Nam')}>
            <NormalText text="Nam" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => onSelect('Nữ')}>
            <NormalText text="Nữ" />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.option} onPress={() => onSelect('Không xác định')}>
            <NormalText text='Không xác định' />
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <NormalText text="Hủy" style={{color: colors.red800}} />
          </TouchableOpacity>
        </Column>
      </Column>
    </Modal>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: colors.fbBg,
  },
  formContainer: {
    paddingBottom: 30, // Đảm bảo không bị cắt ở cuối
    gap: 16,
  },
  title: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  avatarContainer: {
    borderWidth: 3,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  avatar: {
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  option: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
  },
  cancelButton: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
