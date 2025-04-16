import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import ZegoUIKit from '@zegocloud/zego-uikit-rn';
import React, { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { Icon } from 'react-native-paper';
import { Column, CustomCallButton, NormalText, Row } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';

export const ShipperInfo = (props) => {
  const { messageClick, shipper } = props;
  console.log('shipper', JSON.stringify(shipper, null, 3))
  const navigation = useNavigation()
  useEffect(() => {
    const handleOrientationChange = (orientation) => {
      let orientationValue = 0;
      if (orientation === 'LANDSCAPE-LEFT') orientationValue = 1;
      else if (orientation === 'LANDSCAPE-RIGHT') orientationValue = 3;
      console.log('📱 Orientation:', orientation, orientationValue);
      ZegoUIKit.setAppOrientation(orientationValue);
    };

    Orientation.addOrientationListener(handleOrientationChange);
    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, []);


  const handleCallInvitationPress = (errorCode, errorMessage, errorInvitees) => {
    if (errorCode !== 0) {
      console.log('🚨 Zego call error:', { errorCode, errorMessage, errorInvitees });
    } else {
      console.log('📞 Call invitation sent successfully.');
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
        <CustomCallButton
          userName={`${shipper?.firstName ?? ''} ${shipper?.lastName ?? ''}`.trim()}
          userID={shipper?.phoneNumber ?? ''}
          navigation={navigation}
        />
        {/* <ZegoSendCallInvitationButton
          invitees={[
            {
              userID: shipper?.phoneNumber ?? '',
              userName: `${shipper?.firstName ?? ''} ${shipper?.lastName ?? ''}`.trim()
            }
          ]}
          isVideoCall={false}
          resourceID={"zegouikit_call"}
          showWaitingPageWhenGroupCall={true}
          onPressed={handleCallInvitationPress}
        /> */}

        <Pressable style={styles.iconButton} onPress={messageClick}>
          <Icon
            source="message"
            color={colors.blue600}
            size={20}
          />
        </Pressable>

      </Row>
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
  iconButton: {
    padding: 11,
    borderRadius: 24,
    backgroundColor: colors.fbBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8

  },
});
