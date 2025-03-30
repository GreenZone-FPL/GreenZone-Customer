import React from 'react';
import {View, StyleSheet, ImageBackground, Dimensions} from 'react-native';
import {colors, GLOBAL_KEYS} from '../../constants';

import Barcodebwipjs from './BarcodeBwipjs';
const width = Dimensions.get('window').width;

export const BarcodeUser = ({setIsData}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/bgvoucher.png')}
        resizeMode="cover"
        style={styles.imageBackground}>
        {/* Mã vạch */}
        <View style={styles.barCode}>
          <Barcodebwipjs setIsData={setIsData} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
    justifyContent: 'center',
    opacity: 0.9,
  },
  barCode: {
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignItems: 'center',
    margin: 16,
    backgroundColor: colors.white,
  },
});

export default BarcodeUser;
