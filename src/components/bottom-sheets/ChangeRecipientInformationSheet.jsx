import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {
  FlatInput,
  NormalHeader,
  OverlayStatusBar,
  PrimaryButton,
} from '../../components';
import {GLOBAL_KEYS, colors} from '../../constants';

const ChangeRecipientInformationSheet = ({navigation}) => {
  const [name, setName] = useState('Phong Nguyen');
  const [phone, setPhone] = useState('0936887373');

  return (
    <View style={styles.container}>
      <OverlayStatusBar />
      <NormalHeader
        title="Người nhận"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.label}>Tên người nhận</Text>
        <FlatInput label={''} value={name} setValue={setName} />
        <Text style={styles.label}>Số điện thoại</Text>
        <FlatInput label={''} value={phone} setValue={setPhone} />
        <PrimaryButton title={'Cập nhật'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  contentContainer: {
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  label: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
  },
});

export default ChangeRecipientInformationSheet;
