import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import { Column, FlatInput, OverlayStatusBar, PrimaryButton } from '../../components';
import { GLOBAL_KEYS, colors } from '../../constants';
import { Icon } from 'react-native-paper';

const RecipientInfoSheet = ({ navigation }) => {
  const [name, setName] = useState('Phong Nguyen');
  const [phoneNumber, setPhoneNumber] = useState('0936887373');

  return (
    <Column style={styles.container}>
      <Column style={styles.contentContainer}>

        <OverlayStatusBar />

        <View style={styles.goBackContainer}>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon
              source="close"
              color={colors.gray700}
              size={GLOBAL_KEYS.ICON_SIZE_SMALL}
            />
          </TouchableOpacity>
        </View>

        <Column style={styles.content}>
          <Text style={styles.label}>Tên người nhận</Text>
          <FlatInput label={''} value={name} setValue={setName} />
          <Text style={styles.label}>Số điện thoại</Text>
          <FlatInput label={''} value={phoneNumber} setValue={setPhoneNumber} />
          <PrimaryButton

            title={'Cập nhật'}
            onPress={() => {
              navigation.setParams({ name, phoneNumber });
              navigation.goBack();
            }} />


        </Column>


      </Column>
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.fbBg,
    marginTop: StatusBar.currentHeight,
    borderTopRightRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderTopLeftRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  goBackContainer: {
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  content: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  label: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  goBackButton: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
    backgroundColor: colors.green100,
    alignItems: 'center',
    justifyContent: 'center',
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    position: 'absolute',
    end: 0,
  },
});

export default RecipientInfoSheet;
