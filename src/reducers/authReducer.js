export const AuthActionTypes = {
  LOGIN: 'LOGIN',
  LOGIN_SESSION_EXPIRED: 'LOGIN_SESSION_EXPIRED',
  REGISTER: 'REGISTER',
  LOGOUT: 'LOGOUT',
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
};

export const authInitialState = {
  isLoggedIn: false,
  message: '',
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return { ...state, isLoggedIn: true, message: '' };

    case AuthActionTypes.LOGIN_SESSION_EXPIRED:
      return { ...state, isLoggedIn: false, message: action.payload || 'Phiên đăng nhập hết hạn' };

    case AuthActionTypes.REGISTER:
      return { ...state, isLoggedIn: false, message: '' };

    case AuthActionTypes.LOGOUT:
      return { ...state, isLoggedIn: false, message: '' };

    case AuthActionTypes.CLEAR_MESSAGE:
      return { ...state, message: '' };

    default:
      return state;
  }
}