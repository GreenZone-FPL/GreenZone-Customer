import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import {colors} from '../../constants';

const ButtonBackground = ({view}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        blurRadius={1}
        style={styles.imageBackground}
        source={require('../../assets/images/bgvoucher.png')}>
        <View style={styles.content}>{view}</View>
      </ImageBackground>
    </View>
  );
};

export default ButtonBackground;

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  imageBackground: {
    padding: 48,
    resizeMode: 'center',
    overflow: 0.1,
    justifyContent: 'flex-start',
  },
  content: {
    // backgroundColor: colors.white,
    // borderRadius: 16,
    // borderWidth: 1,
    // borderColor: colors.gray200,
    // padding: 36,
    // elevation: 5,
  },
});
