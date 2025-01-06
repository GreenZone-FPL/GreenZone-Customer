import {View, Text, Image, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import NormalHeader from '../../components/headers/NormalHeader';
import colors from '../../constants/color';
import {Icon} from 'react-native-paper';
import GLOBAL_KEYS from '../../constants/global_keys';
import {Dimensions} from 'react-native';
import FlatInput from '../../components/inputs/FlatInput';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import {CustomFlatInput} from '../../components/inputs/FlatInput';

const {width} = Dimensions.get('window');
const UpdateProfileScreen = props => {
  const {navigation} = props;
  const {dob, setDob} = useState('');
  const {sex, setSex} = useState('');

  return (
    <View style={styles.container}>
      <NormalHeader
        title={'Cập nhập thông tin'}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Image
            style={styles.avatarImage}
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/User_icon-cp.png/618px-User_icon-cp.png',
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
        <FlatInput label={'Họ'} />
        <FlatInput label={'Tên'} />
        <FlatInput label={'Email'} />
        <CustomFlatInput label={'Ngày sinh'} value={dob} setValue={setDob} />
        <CustomFlatInput
          label={'Giới tính'}
          value={sex}
          setValue={setSex}
          rightIcon="arrow-down-thin"
        />
        <PrimaryButton title={'Cập nhật tài khoản'} />
      </View>
    </View>
  );
};

const Calendar = () => {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.white,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
