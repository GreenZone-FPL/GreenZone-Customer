import { useNavigation } from '@react-navigation/native';
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import ZegoUIKit, { ZegoToast, ZegoToastType } from '@zegocloud/zego-uikit-rn';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { IconButton } from 'react-native-paper';
import { Column, NormalText, Row } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { AppAsyncStorage } from '../../../utils';
import { onUserLoginZego } from '../../../zego/common';
import { useAppContext } from '../../../context/appContext';
import { useAppContainer } from '../../../containers';

export const ShipperInfo = (props) => {
  const { messageClick, shipper } = props;
  const navigation = useNavigation();
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [isToastVisable, setIsToastVisable] = useState(false);
  const [toastExtendedData, setToastExtendedData] = useState({});
  const toastInvisableTimeoutRef = useRef(null);
  const { onLogout } = useAppContainer()

  console.log('📦 Shipper Info:', JSON.stringify(shipper, null, 2));

  const getUserInfo = async () => {
    try {
      const phoneNumber = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.phoneNumber);
      const lastName = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.lastName);
      if (!phoneNumber) return undefined;
      return { phoneNumber, lastName };
    } catch (e) {
      return undefined;
    }
  };

  const resetToastInvisableTimeout = () => {
    clearTimeout(toastInvisableTimeoutRef.current);
    toastInvisableTimeoutRef.current = setTimeout(() => {
      setIsToastVisable(false);
    }, 3000);
  };

  useEffect(() => {
    Orientation.addOrientationListener((orientation) => {
      let orientationValue = 0;
      if (orientation === 'PORTRAIT') orientationValue = 0;
      else if (orientation === 'LANDSCAPE-LEFT') orientationValue = 1;
      else if (orientation === 'LANDSCAPE-RIGHT') orientationValue = 3;
      console.log('📱 Orientation:', orientation, orientationValue);
      ZegoUIKit.setAppOrientation(orientationValue);
    });

    getUserInfo().then((info) => {
      if (info) {
        setUserPhoneNumber(info.phoneNumber);
        onUserLoginZego(info.phoneNumber, info.lastName, props);
      } else {
        onLogout()
      }
    });
  }, []);

  const handleCallInvitationPress = (errorCode, errorMessage, errorInvitees) => {
    console.log('📞 invitees used in call:', [shipper?.phoneNumber]);
    if (errorCode === 0) {
      clearTimeout(toastInvisableTimeoutRef.current);
      setIsToastVisable(false);
    } else {
      console.log('🚨 Zego call error:', { errorCode, errorMessage, errorInvitees });
      setIsToastVisable(true);
      setToastExtendedData({
        type: ZegoToastType.error,
        text: `error: ${errorCode}\n\n${errorMessage}`,
      });
      resetToastInvisableTimeout();
    }
  };

  return (
    <Row style={styles.container}>
      <Image
        style={styles.avatar}
        source={
          shipper?.avatar
            ? { uri: shipper.avatar }
            : require('../../../assets/images/helmet.png')
        }
      />

      <Column style={styles.infoContainer}>
        <NormalText text="Nhân viên giao hàng" style={styles.titleText} />
        <Text style={styles.nameText}>
          {shipper?.firstName
            ? `${shipper.firstName} ${shipper.lastName}`
            : 'Đang chuẩn bị ...'}
        </Text>
        <NormalText text={`Điện thoại: ${shipper.phoneNumber}`} />
      </Column>

      <Row>
        <ZegoSendCallInvitationButton
          invitees={[
            {
              userID: shipper?.phoneNumber,
              userName: 'user_' + shipper?.phoneNumber
            }
          ]}
          isVideoCall={false}
          resourceID={"zegouikit_call"}
          showWaitingPageWhenGroupCall={true}
          onPressed={handleCallInvitationPress}
        />

        <IconButton
          icon="message"
          iconColor={colors.blue600}
          size={20}
          containerColor={colors.fbBg}
          style={{ padding: 8 }}
          onPress={messageClick}
          // loading={true}
        />
      </Row>

      <ZegoToast
        visable={isToastVisable}
        type={toastExtendedData.type}
        text={toastExtendedData.text}
      />
    </Row>
  );
};


const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
    backgroundColor: colors.white,
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
  },
  infoContainer: {
    flex: 1,
  },
  titleText: {
    fontWeight: '500',
  },
  nameText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.yellow700,
    fontWeight: '500',
  },
  iconRow: {
    gap: 24,
  },
});
