import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Ani_Success = ({ visible }) => {
  if (!visible) return null;

  return (
    <LottieView
      source={require('../../assets/animations/box_success.json')}
      autoPlay
      loop={false}
      style={styles.lottie}
    />

  );
};

const styles = StyleSheet.create({
  lottie: {
    width: 250,
    height: 250,

  },
});

export default Ani_Success;
