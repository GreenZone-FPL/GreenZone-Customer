import React, {useEffect, useReducer, useState} from 'react';
import {Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity,} from 'react-native';
import {Column, CustomFlatInput, NormalLoading, NormalText, OverlayStatusBar, TitleText,} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {Toaster} from '../../utils';
import LabelInput from "../../components/inputs/LabelInput";
import {useAppContext} from "../../context/appContext";
import {AuthActionTypes} from "../../reducers";
import {register} from "../../axios";

const initialState = {
  firstName: '',
  lastName: '',
  firstNameError: '',
  lastNameError: '',
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_VALUE':
      return {...state, [action.field]: action.value};
    case 'SET_ERROR':
      return {...state, [action.field + 'Error']: action.value};
    case 'SET_LOADING':
      return {...state, loading: action.value};
    default:
      return state;
  }
};
const RegisterScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isValidForm, setIsValidForm] = useState(false);

  const {authState, authDispatch} = useAppContext();

  useEffect(() => {
    setIsValidForm(state.firstName.trim() !== '' && state.lastName.trim() !== '');
  }, [state.firstName, state.lastName]);

  const validateForm = () => {
    let valid = true;

    if (!state.lastName.trim()) {
      dispatch({type: 'SET_ERROR', field: 'lastName', value: 'Trường này không được để trống'});
      valid = false;
    }

    if (!state.firstName.trim()) {
      dispatch({type: 'SET_ERROR', field: 'firstName', value: 'Trường này không được để trống'});
      valid = false;
    }
    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    dispatch({type: 'SET_LOADING', value: true});
    Keyboard.dismiss();

    try {
      const request = {
        firstName: state.firstName,
        lastName: state.lastName,
      };


      // Gọi API đăng ký
      const result = await register(request);
      console.log('User registered:', JSON.stringify(result, null, 2));
      if (result) {
        Toaster.show('Đăng ký tài khoản thành công');
        authDispatch({
          type: AuthActionTypes.LOGIN,
          payload: {needLogin: false, needRegister: false, lastName: state.lastName, isLoggedIn: true}
        });
      }

      console.log('User registered:', JSON.stringify(result.data, null, 2));
      Toaster.show('Đăng ký thành công!');
    } catch (error) {
      console.log('Registration failed:', error);
      Toaster.show(error.message);
      authDispatch({type: AuthActionTypes.LOGIN});
    } finally {
      dispatch({type: 'SET_LOADING', value: false});
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flex: 1}} keyboardShouldPersistTaps="handled">
        <NormalLoading visible={state.loading}/>

        <OverlayStatusBar/>
        <Column style={styles.content}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo}/>
          <TitleText text="Xin chào, vui lòng nhập thông tin đăng ký của bạn" style={styles.message}/>

          <LabelInput label="Họ"/>
          <CustomFlatInput
            value={state.firstName}
            setValue={(value) => dispatch({type: 'SET_VALUE', field: 'firstName', value})}
            invalidMessage={state.firstNameError}
            leftIcon="account-circle-outline"
            enableLeftIcon={true}
          />
          <LabelInput label="Tên" required={true}/>
          <CustomFlatInput
            value={state.lastName}
            setValue={(value) => dispatch({type: 'SET_VALUE', field: 'lastName', value})}
            leftIcon="shield-account-outline"
            invalidMessage={state.lastNameError}
            enableLeftIcon={true}
          />

          <TouchableOpacity
            style={[styles.button, {backgroundColor: isValidForm ? colors.green500 : '#E3E3E5'}]}
            disabled={!isValidForm}
            onPress={handleRegister}
          >
            <NormalText text="Đăng ký" style={[styles.buttonText, {color: isValidForm ? colors.white : '#ACACAE'}]}/>
          </TouchableOpacity>
        </Column>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;


const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
    gap: 12,
    justifyContent: 'center'
  },
  logo: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').width / 1.5,
    alignSelf: 'center'
  },
  message: {
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
    fontWeight: '400'
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: 16,
    backgroundColor: colors.primary
  },
  buttonText: {
    color: colors.white,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '400',
  },
});

export default RegisterScreen;
