export const AuthActionTypes = {
  LOGIN: 'LOGIN',
  LOGIN_SESSION_EXPIRED: 'LOGIN_SESSION_EXPIRED',
  REGISTER: 'REGISTER',
  LOGOUT: 'LOGOUT',
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
};

export const authInitialState = {
  message: '',
  needAuthen: false
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return {...state, message: '', needAuthen: false,  ...action.payload};

    case AuthActionTypes.LOGIN_SESSION_EXPIRED:
      return {
        ...state,
        ...action.payload,
       

      };

    case AuthActionTypes.REGISTER:
      return {...state, message: '',  ...action.payload};

    case AuthActionTypes.LOGOUT:
      return {...state, message: '', needAuthen: false, ...action.payload};

    case AuthActionTypes.CLEAR_MESSAGE:
      return {...state, message: ''};

    default:
      return state;
  }
};
