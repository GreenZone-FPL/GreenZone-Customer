import {
  RegisterAction,
  RegisterFormProps,
  RegisterRequest,
} from '../../type/register';
import {useEffect, useReducer, useState} from 'react';
import {Keyboard} from 'react-native';
import {register} from '../../axios';
import {useAppContext} from '../../context/appContext';
import {Toaster} from '../../utils';
import {AuthActionTypes} from '../../reducers';

export const useRegisterContainer = () => {
  const initialState: RegisterFormProps = {
    firstName: '',
    lastName: '',
    firstNameError: '',
    lastNameError: '',
    loading: false,
  };

  const reducer = (
    state: RegisterFormProps,
    action: RegisterAction,
  ): RegisterFormProps => {
    switch (action.type) {
      case 'SET_VALUE':
        return {...state, [action.field]: action.value};
      case 'SET_ERROR':
        return {...state, [action.field + 'Error']: action.value};
      case 'SET_LOADING':
        return {...state, loading: action.value as boolean};
      default:
        return state;
    }
  };
  const [isValidForm, setIsValidForm] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);
  const {authDispatch} = useAppContext();
  useEffect(() => {
    setIsValidForm(
      state.firstName.trim() !== '' && state.lastName.trim() !== '',
    );
  }, [state.firstName, state.lastName]);

  const validateForm = () => {
    let valid = true;

    if (!state.lastName.trim()) {
      dispatch({
        type: 'SET_ERROR',
        field: 'lastName',
        value: 'Trường này không được để trống',
      });
      valid = false;
    }

    if (!state.firstName.trim()) {
      dispatch({
        type: 'SET_ERROR',
        field: 'firstName',
        value: 'Trường này không được để trống',
      });
      valid = false;
    }
    return valid;
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }
    dispatch({type: 'SET_LOADING', field: 'loading', value: true});
    Keyboard.dismiss();

    try {
      const request: RegisterRequest = {
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
          payload: {
            needLogin: false,
            needRegister: false,
            lastName: state.lastName,
            isLoggedIn: true,
          },
        });
      }

      console.log('User registered:', JSON.stringify(result.data, null, 2));
      Toaster.show('Đăng ký thành công!');
    } catch (error) {
      console.log('Registration failed:', error);
      Toaster.show(error.message);
      authDispatch({type: AuthActionTypes.LOGIN});
    } finally {
      dispatch({type: 'SET_LOADING', field: 'loading', value: false});
    }
  };

  return {
    state,
    dispatch,
    isValidForm,
    initialState,
    reducer,
    handleRegister,
  };
};
