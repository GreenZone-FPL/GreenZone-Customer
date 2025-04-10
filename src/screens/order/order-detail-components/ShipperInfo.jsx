import React from 'react';
import { Pressable, StyleSheet, Text, Image, Linking } from 'react-native';
import { Icon } from 'react-native-paper';
import { Column, NormalText, Row } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';

export const ShipperInfo = ({ messageClick, shipper }) => {
 
  const handleCall = () => {
    if (!shipper?.phoneNumber) return;
    const phoneNumber = `tel:${shipper.phoneNumber}`;
    Linking.openURL(phoneNumber).catch((err) =>
      console.error('Failed to open dialer:', err)
    );
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

      <Row style={styles.iconRow}>
        <Pressable onPress={handleCall}>
          <Icon source="phone-outline" color={colors.black} size={20} />
        </Pressable>
        <Pressable onPress={messageClick}>
          <Icon source="message-outline" color={colors.black} size={20} />
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
});
