import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {SvgXml} from 'react-native-svg';
import bwipjs from '@bwip-js/react-native';
import {colors, GLOBAL_KEYS} from '../../constants';
import {getProfile} from '../../axios/index';
import {useAppContext} from '../../context/appContext';
import NormalLoading from '../animations/NormalLoading';

const width = Dimensions.get('window').width;

const Barcodebwipjs = ({isHome}) => {
  const [barcodeSVG, setBarcodeSVG] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  // Lấy profile

  const feathProfile = async () => {
    setLoading(true);
    try {
      const response = await getProfile();

      setUser(response);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
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
          text: user?.code ? user?.code : 'new',
          scale: 15,
          height: 4,
          includetext: true,
          textsize: GLOBAL_KEYS.TEXT_SIZE_SMALL - 4,
          textyoffset: GLOBAL_KEYS.PADDING_SMALL - 4,
          padding: 0,
          margin: 0,
          textfont: 'Helvetica',
        });
        setBarcodeSVG(svg);
      } catch (e) {
        console.error('Lỗi khi tạo mã vạch:', e);
      }
    };

    generateBarcode();
  }, [user]);

  return (
    <View style={styles.container}>
      {loading ? (
        <NormalLoading visible={loading} />
      ) : (
        <View
          style={{
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
          {user?.firstName && (
            <Text
              style={[
                styles.text,
                {color: isHome ? colors.white : colors.primary},
              ]}>
              {user?.firstName + ' ' + user?.lastName}
            </Text>
          )}
          {barcodeSVG && <SvgXml xml={barcodeSVG} width="100%" height="100%" />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 120,
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
    marginTop: 16,
    alignSelf: 'flex-start',
  },
});

export default Barcodebwipjs;
