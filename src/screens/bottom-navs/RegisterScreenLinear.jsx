import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Modal,
  Text
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Avatar } from 'react-native-paper';
import { CustomFlatInput, NormalText, PrimaryButton, TitleText } from '../../components';
import { colors } from '../../constants';

const RegisterScreenLinear = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    setShow(Platform.OS === 'ios' ? true : false);
    setDateOfBirth(formattedDate);
  };

  const openImagePicker = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Image Picker Error', response.errorMessage);
        } else {
          setAvatar(response.assets[0].uri); // Lưu URI của hình ảnh
        }
      }
    );
  };

  return (
    <LinearGradient
      colors={[colors.green100, colors.white]} // Gradient từ xanh đậm đến nhạt
      style={styles.background}
    >
      <ScrollView
        contentContainerStyle={styles.innerContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../../assets/images/register_bg.png')}
          style={{ width: '100%', height: 200 }}
        />

        <View style={styles.formContainer}>
          <TitleText text='GREEN ZONE' style={styles.title} />
          <TitleText text='ĐĂNG KÝ TÀI KHOẢN' />

          <CustomFlatInput
            label="Họ"
            placeholder="Nhập họ"
            value={firstName}
            setValue={setFirstName}
            message={firstNameError}
          />

          <CustomFlatInput
            label="Tên"
            placeholder="Nhập tên"
            value={lastName}
            setValue={setLastName}
            message={lastNameError}
          />

          <CustomFlatInput
            label="Email"
            placeholder="Nhập email"
            value={email}
            keyboardType='email-address'
            setValue={setEmail}
            message={emailError}
          />

          <CustomFlatInput
            label="Ngày sinh"
            placeholder="Nhập ngày sinh"
            value={dateOfBirth}
            setValue={setDateOfBirth}
            onRightPress={() => setShow(true)}
            message={dateOfBirthError}
            enableRightIcon={true}
          />

          {/* Giới tính */}
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <CustomFlatInput
              label="Giới tính"
              placeholder="Chọn giới tính"
              value={gender}
              setValue={setGender}
              editable={false} // Không cho nhập trực tiếp
              message={genderError}
            />
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Chọn giới tính</Text>
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => { setGender('Nam'); setModalVisible(false); }}
                >
                  <Text style={styles.optionText}>Nam</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => { setGender('Nữ'); setModalVisible(false); }}
                >
                  <Text style={styles.optionText}>Nữ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <NormalText text='Upload avatar (Không bắt buộc)' />
          <TouchableOpacity onPress={openImagePicker}>
            {avatar ? (
              <Avatar.Image
                size={80}
                source={{ uri: avatar }}
                style={styles.avatar}
                onPress={openImagePicker}
              />
            ) : (
              <Avatar.Icon
                size={80}
                icon="image"
                color={colors.gray700}
                style={styles.avatar}
              />
            )}
          </TouchableOpacity>

          <PrimaryButton title='ĐĂNG KÝ' />
        </View>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flexGrow: 1,
    padding: 16,
    // backgroundColor: colors.white,
  },
  formContainer: {
    paddingBottom: 30, // Đảm bảo không bị cắt ở cuối
    gap: 16
  },
  title: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  avatar: {
    alignSelf: 'center',
    backgroundColor: colors.gray200,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  option: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    color: 'red',
  },
});

export default RegisterScreenLinear;
