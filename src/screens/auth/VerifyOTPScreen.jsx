import React from 'react';
import {StatusBar, StyleSheet, Text} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {
  Column,
  NormalLoading,
  NormalText,
  OverlayStatusBar,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {IconButton} from 'react-native-paper';
import {useVerifyOTPContainer} from '../../containers';

const VerifyOTPScreen = ({route}) => {
  const {expired, phoneNumber} = route.params;
  const {navigation, setCode, timeLeft, loading, formatTime} =
    useVerifyOTPContainer(expired, phoneNumber);

  return (
    <Column style={styles.container}>
      <IconButton
        icon="close"
        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        iconColor={colors.black}
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      />
      <OverlayStatusBar />
      <Column style={styles.content}>
        <NormalLoading visible={loading} />
        <Text style={styles.title}>Xác thực OTP</Text>
        <NormalText text={` Mã xác thực đã được gửi đến ${phoneNumber}`} />

        <OtpInput autoFocus={false} numberOfDigits={6} onTextChange={setCode} />

        {timeLeft > 0 ? (
          <NormalText text={`  Mã OTP hết hạn sau ${formatTime(timeLeft)}`} />
        ) : (
          <NormalText text="OTP đã hết hạn" style={{color: colors.red900}} />
        )}
      </Column>
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.overlay,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: StatusBar.currentHeight,
    right: GLOBAL_KEYS.PADDING_DEFAULT,
    zIndex: 1,
    backgroundColor: colors.gray200,
  },
  content: {
    marginTop: StatusBar.height,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 20,
    flex: 1,
  },
  title: {fontSize: 28, fontWeight: 'bold', color: colors.black},
});

export default VerifyOTPScreen;
