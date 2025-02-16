import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import { FlatInput, CustomFlatInput, NormalHeader, PrimaryButton } from '../../components';
import { GLOBAL_KEYS, colors } from '../../constants';

const { width } = Dimensions.get('window');
const UpdateProfileScreen = props => {
  const { navigation } = props;
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <NormalHeader
          title={'Cập nhập thông tin'}
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image
              style={styles.avatarImage}
              source={{
                uri: 'https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg',
              }}
            />
            <View style={styles.cameraIconContainer}>
              <Icon
                source="camera"
                color={colors.primary}
                size={GLOBAL_KEYS.ICON_SIZE_SMALL}
              />
            </View>
          </View>
        </View>
        <View style={styles.formContainer}>
          <FlatInput label={'Họ'} value={lastName} setValue={setLastName} />
          <FlatInput label={'Tên'} value={firstName} setValue={setFirstName} />
          <FlatInput label={'Email'} value={email} setValue={setEmail} />
          <CustomFlatInput label={'Ngày sinh'} value={dob} setValue={setDob} />
          <CustomFlatInput
            label={'Giới tính'}
            value={gender}
            setValue={setGender}
            rightIcon="arrow-down-drop-circle-outline"
          />
          <PrimaryButton title={'Cập nhật tài khoản'} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.fbBg,
    gap: 16
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: GLOBAL_KEYS.PADDING_DEFAULT
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
  },
  formContainer: {
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
});

export default UpdateProfileScreen;
