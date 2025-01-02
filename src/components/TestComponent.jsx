import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import colors from '../constants/color';
import FlatInput from './inputs/FlatInput';
import OutlineInput from './inputs/OutlineInput';
import GLOBAL_KEYS from '../constants/global_keys';


const TestComponent = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const validateInputs = () => {
    const newErrors = {
      fullname: fullname.trim() === '' ? 'Fullname is required' : '',
      email: email.trim() === '' ? 'Email is required' : '',
      password: password.trim() === '' ? 'Password is required' : '',
    };
    setErrors(newErrors);
  };

  return (
    <View style={styles.container}>
      <FlatInput
        label="Fullname"
        value={fullname}
        setValue={(value) => {
          setErrors((prev) => ({ ...prev, fullname: '' }));
          setFullname(value);
        }}
        message={errors.fullname}
      />
      <FlatInput
        label="Email"
        value={email}
        setValue={(value) => {
          setErrors((prev) => ({ ...prev, email: '' }));
          setEmail(value);
        }}
        message={errors.email}
      />
      <FlatInput
        label="Password"
        value={password}
        setValue={(value) => {
          setErrors((prev) => ({ ...prev, password: '' }));
          setPassword(value);
        }}
        message={errors.password}
        secureTextEntry
        isPasswordVisible={isPasswordVisible}
        setIsPasswordVisible={setIsPasswordVisible}
      />
      <Button title="Validate" onPress={validateInputs} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
});

export default TestComponent;
