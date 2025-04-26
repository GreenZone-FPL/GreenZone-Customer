// src/components/QrCodeVoucher.js
import React from 'react';
import {Dimensions, StyleSheet, View, TouchableOpacity} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {colors, GLOBAL_KEYS} from '../../constants';
import {SkeletonBox} from '../../skeletons';

const width = Dimensions.get('window').width;

export const QrCodeVoucher = ({
  voucherCode,
  hasBackground = true,
  style,
  onPress = () => {},
}) => {
  const QrContent = () => {
    return (
      <View style={styles.qrContainer}>
        {voucherCode && (
          <View style={styles.qrWrapper}>
            <QRCode
              value={voucherCode}
              size={180}
              backgroundColor="transparent"
              color={colors.black}
            />
          </View>
        )}
      </View>
    );
  };

  if (voucherCode) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.container,
          {maxHeight: hasBackground ? 200 : 160},
          style,
        ]}>
        <QrContent />
      </TouchableOpacity>
    );
  }

  return <SkeletonBox width="100%" height={150} borderRadius={12} />;
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
    justifyContent: 'center',
    width: width - 32,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignSelf: 'center',
  },
  qrContainer: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingVertical: 16,
    paddingHorizontal: 24,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  qrWrapper: {
    paddingTop: 20,
  },
});
