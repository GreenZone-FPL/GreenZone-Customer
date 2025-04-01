// @ts-ignore
import React from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Column,
  CustomFlatInput,
  NormalLoading,
  NormalText,
  OverlayStatusBar,
  TitleText,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import LabelInput from '../../components/inputs/LabelInput';
import {useRegisterContainer} from '../../containers';

const RegisterScreen: React.FC = () => {
  const {state, dispatch, isValidForm, handleRegister} = useRegisterContainer();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{flex: 1}}
        keyboardShouldPersistTaps="handled">
        <NormalLoading visible={state.loading} />

        <OverlayStatusBar />
        <Column style={styles.content}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
          <TitleText
            text="Xin chào, vui lòng nhập thông tin đăng ký của bạn"
            style={styles.message}
          />

          <LabelInput label="Họ" />
          <CustomFlatInput
            value={state.firstName}
            setValue={(value: string) =>
              dispatch({type: 'SET_VALUE', field: 'firstName', value})
            }
            invalidMessage={state.firstNameError}
            leftIcon="account-circle-outline"
            enableLeftIcon={true}
          />
          <LabelInput label="Tên" required={true} />
          <CustomFlatInput
            value={state.lastName}
            setValue={(value: string) =>
              dispatch({type: 'SET_VALUE', field: 'lastName', value})
            }
            leftIcon="shield-account-outline"
            invalidMessage={state.lastNameError}
            enableLeftIcon={true}
          />

          <TouchableOpacity
            style={[
              styles.button,
              // eslint-disable-next-line react-native/no-inline-styles
              {backgroundColor: isValidForm ? colors.green500 : '#E3E3E5'},
            ]}
            disabled={!isValidForm}
            onPress={handleRegister}>
            <NormalText
              text="Đăng ký"
              style={[
                styles.buttonText,
                // eslint-disable-next-line react-native/no-inline-styles
                {color: isValidForm ? colors.white : '#ACACAE'},
              ]}
            />
          </TouchableOpacity>
        </Column>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
    gap: 12,
    justifyContent: 'center',
  },
  logo: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').width / 1.5,
    alignSelf: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
    fontWeight: '400',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: 16,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '400',
  },
});

export default RegisterScreen;
