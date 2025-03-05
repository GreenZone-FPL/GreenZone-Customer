import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const FillingJuiceLoading = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LottieView
        source={require('../../assets/animations/loadingdrink.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Nền mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
});

export default FillingJuiceLoading;
