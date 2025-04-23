import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DualTextRow, NormalText } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { Title } from './Title';
import moment from 'moment';

export const RecipientInfo = ({ detail }) => {
  const {
    deliveryMethod,
    owner,
    consigneeName,
    consigneePhone,
    shippingAddress,
  } = detail;

  // Nếu là pickup hoặc các thông tin giao hàng bị null, thì lấy thông tin owner
  const recipientName =
    deliveryMethod === 'pickup' || !consigneeName
      ? `${owner.lastName} ${owner.firstName}`
      : consigneeName;

  const recipientPhone =
    deliveryMethod === 'pickup' || !consigneePhone
      ? owner.phoneNumber
      : consigneePhone;

  const recipientAddress =
    deliveryMethod !== 'pickup' && shippingAddress
      ? shippingAddress
      : 'Không có địa chỉ giao hàng';

  return (
    <View
      style={[
        styles.areaContainer,
        { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
      ]}>
      <Title title="Người nhận" />
      <NormalText
        text={[recipientName, recipientPhone].join(' - ')}
        style={{ color: colors.blue600, fontWeight: '500' }}
      />

      {deliveryMethod !== 'pickup' && (
        <Text style={styles.normalText}>{recipientAddress}</Text>
      )}

      <DualTextRow
        style={{ marginVertical: 0 }}
        leftText={`Thời gian dự kiến nhận hàng`}
        // rightText={new Date(detail.fulfillmentDateTime).toLocaleString('vi-VN')}
        rightText={moment(detail.fulfillmentDateTime).utcOffset(7).format('HH:mm - DD/MM/YYYY')}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  areaContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    marginBottom: 5,
  },

  normalText: {
    lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    marginRight: 4,
  },
})
