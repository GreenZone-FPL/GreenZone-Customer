import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {SvgXml} from 'react-native-svg';
import bwipjs from '@bwip-js/react-native';
import {GLOBAL_KEYS} from '../../constants';
import {getProfile} from '../../axios/index';
import {Ani_ModalLoading} from '../animations/Ani_ModalLoading';
import {useAppContext} from '../../context/appContext';

const width = Dimensions.get('window').width;

const Barcodebwipjs = () => {
  const [barcodeSVG, setBarcodeSVG] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState();
  const {authState} = useAppContext();

  // Lấy profile
  const feathProfile = async () => {
    // setLoading(true);
    try {
      const reponse = await getProfile();
      setText(reponse.code);
    } catch (error) {
      console.log('error', error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    feathProfile();
  }, []);

  useEffect(() => {
    const generateBarcode = async () => {
      try {
        const svg = await bwipjs.toSVG({
          bcid: 'code128',
          text: text ? text : 'Login or create a new account',
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
  }, [text]);

  return (
    <View style={styles.container}>
      {barcodeSVG && <SvgXml xml={barcodeSVG} width="100%" height="100%" />}
      <Ani_ModalLoading loading={loading} />
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

export default Barcodebwipjs;
