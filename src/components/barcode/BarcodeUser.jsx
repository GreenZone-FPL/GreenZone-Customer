import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import bwipjs from '@bwip-js/react-native';
import {colors, GLOBAL_KEYS} from '../../constants';

const width = Dimensions.get('window').width;

export const BarcodeUser = ({
  hasBackground = true,
  showPoints = false,
  user,
  style,
  onPress = {},
}) => {
  const [barcodeSVG, setBarcodeSVG] = useState(null);

  useEffect(() => {
    const generateBarcode = async () => {
      if (!user?.code) return;
      try {
        const svg = bwipjs.toSVG({
          bcid: 'code128',
          text: user.code,
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

  const BarcodeContent = () => {
    return (
      <View style={styles.barCodeContainer}>
        <Text style={[styles.text]}>
          {user?.firstName} {user?.lastName}
        </Text>
        {showPoints && (
          <Pressable style={styles.content} onPress={onPress}>
            <Text style={[styles.contentText]}>Đổi {user?.seed || 0} Bean</Text>
          </Pressable>
        )}

        {barcodeSVG ? (
          <SvgXml xml={barcodeSVG} width="100%" height="100%" />
        ) : null}
      </View>
    );
  };

  if (user && barcodeSVG) {
    return (
      <View
        style={[
          styles.container,
          {maxHeight: hasBackground ? 160 : 120},
          style,
        ]}>
        {hasBackground ? (
          <ImageBackground
            source={require('../../assets/images/bgvoucher.png')}
            resizeMode="cover"
            style={styles.imageBackground}>
            <BarcodeContent />
          </ImageBackground>
        ) : (
          <BarcodeContent />
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 160,
    justifyContent: 'center',
    width: width - 32,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignSelf: 'center',
  },
  imageBackground: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  barCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.white,
    maxHeight: 120,
    margin: 16,
    padding: 16,
  },
  content: {
    position: 'absolute',
    end: 0,
    top: 8,
  },
  contentText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
    alignSelf: 'flex-start',
    color: colors.yellow700,

    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderLeftWidth: 1,

    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderColor: colors.primary,
    backgroundColor: colors.brown700,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  text: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
    alignSelf: 'flex-start',
    color: colors.black,
    marginTop: 16,
  },
});
