import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {SvgXml} from 'react-native-svg';
import bwipjs from '@bwip-js/react-native';
import {GLOBAL_KEYS} from '../../constants';

const width = Dimensions.get('window').width;

const BarcodeBwipjs = () => {
  const [barcodeSVG, setBarcodeSVG] = useState(null);

  const [text, setText] = useState('0912345678');

  useEffect(() => {
    const generateBarcode = async () => {
      try {
        const svg = await bwipjs.toSVG({
          bcid: 'code128',
          text: text,
          scale: 1,
          height: 5,
          includetext: true,
          textsize: GLOBAL_KEYS.TEXT_SIZE_SMALL - 4,
          textyoffset: GLOBAL_KEYS.PADDING_SMALL - 4,
        });
        setBarcodeSVG(svg);
      } catch (e) {
        console.error('Lỗi khi tạo mã vạch:', e);
      }
    };

    generateBarcode();
  }, []);

  return (
    <View style={styles.container}>
      {barcodeSVG && <SvgXml xml={barcodeSVG} width="100%" height="100%" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - GLOBAL_KEYS.PADDING_DEFAULT * 2,
    height: width / 7,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
});

export default BarcodeBwipjs;
