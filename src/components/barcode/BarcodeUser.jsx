import bwipjs from '@bwip-js/react-native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { SeedText } from '../texts/SeedText';
import { SkeletonBox } from '../../skeletons';


const width = Dimensions.get('window').width;

export const BarcodeUser = ({
  hasBackground = true,
  showPoints = false,
  style,
  onPress = () => { },
}) => {
  const [barcodeSVG, setBarcodeSVG] = useState(null);
  const { user } = useAppContext()

  useEffect(() => {
    if (!user?.code) return;



    const generateBarcode = async () => {
      try {
        const svg = bwipjs.toSVG({
          bcid: 'code128',
          text: user.code,
          scale: 15,
          height: 4,
          includetext: true,
          textsize: GLOBAL_KEYS.TEXT_SIZE_SMALL - 2,
          textyoffset: GLOBAL_KEYS.PADDING_SMALL - 4,
          padding: 0,
          margin: 0,
          textfont: 'Arial',
        });

        setBarcodeSVG(svg);
      } catch (e) {
        console.error('Lỗi khi tạo mã vạch:', e);
      }
    };

    generateBarcode();

    return () => {

    };
  }, [user?.code]);


  const BarcodeContent = () => {
    return (
      <View style={styles.barCodeContainer}>
        <Text style={styles.nameText} numberOfLines={1} ellipsizeMode="tail">
          {user?.firstName} {user?.lastName}
        </Text>

        {showPoints && (
          <Pressable style={styles.pointsBadge} onPress={onPress}>
            <SeedText point={user?.seed} textStyle={{ color: colors.white }} enableImage={true} />
          </Pressable>
        )}

        {barcodeSVG && (
          <View style={styles.barcodeWrapper}>
            <SvgXml xml={barcodeSVG} width="100%" height="100%" />
          </View>
        )}
      </View>
    );
  };

  if (user && barcodeSVG) {
    return (
      <View
        style={[
          styles.container,
          { maxHeight: hasBackground ? 160 : 120 },
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

  return <SkeletonBox width="100%" height={150} borderRadius={12} />
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
    overflow: 'hidden',
  },
  barCodeContainer: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingVertical: 16,
    paddingHorizontal: 24,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12, // Optional: if RN version supports
  },
  nameText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
    color: colors.black,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  pointsBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.green500,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  pointsText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
    color: colors.primary,
    maxWidth: 80,
  },
  barcodeWrapper: {
    width: '100%',
    height: 50,
    marginTop: 12,
  },
});
