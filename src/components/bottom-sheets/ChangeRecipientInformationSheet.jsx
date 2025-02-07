import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import {FlatInput, OverlayStatusBar, PrimaryButton} from '../../components';
import {GLOBAL_KEYS, colors} from '../../constants';
import {Icon} from 'react-native-paper';

const ChangeRecipientInformationSheet = ({navigation}) => {
  const [name, setName] = useState('Phong Nguyen');
  const [phone, setPhone] = useState('0936887373');

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <OverlayStatusBar />
        <View style={styles.goBackContainer}>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}>
            <Icon
              source="close"
              color={colors.gray700}
              size={GLOBAL_KEYS.ICON_SIZE_SMALL}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Tên người nhận</Text>
          <FlatInput label={''} value={name} setValue={setName} />
          <Text style={styles.label}>Số điện thoại</Text>
          <FlatInput label={''} value={phone} setValue={setPhone} />
          <PrimaryButton title={'Cập nhật'} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
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
    fontWeight: 'bold',
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

export default ChangeRecipientInformationSheet;
