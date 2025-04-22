export type RegisterRequest = {
  firstName: string;
  lastName: string;
};

export type RegisterFormProps = {
  firstName: string;
  lastName: string;
  firstNameError: string;
  lastNameError: string;
  loading: boolean;
};

export type RegisterAction = {
  type: 'SET_VALUE' | 'SET_ERROR' | 'SET_LOADING';
  field: keyof RegisterFormProps;
  value: boolean | string;
};
