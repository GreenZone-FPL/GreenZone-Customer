import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {LightStatusBar, NormalHeader} from '../../components';
import {Row} from '../../components';
import {Icon} from 'react-native-paper';
import {GLOBAL_KEYS, colors} from '../../constants';

const SettingScreen = props => {
  const {navigation} = props;
  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader title="Cài đặt" onLeftPress={() => navigation.goBack()} />
      <View style={styles.itemContainer}>
        <Item iconName="bell" title="Nhận thông báo" notification={true} />
        <Item iconName="link-variant" title="Liên kết tài khoản" />
        <Item iconName="alert-circle-outline" title="Về chúng tôi" />
      </View>
      <Text style={styles.versionText}>Phiên bản 18.06</Text>
    </View>
  );
};

const Item = ({iconName, title, notification}) => {
  return (
    <View style={styles.item}>
      <Row style={styles.row}>
        <Row style={styles.rowContent}>
          <Icon source={iconName} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} />
          <Text style={styles.itemText}>{title}</Text>
        </Row>
        {notification ? (
          <NotificationToggle />
        ) : (
          <View style={styles.arrowIconContainer}>
            <Icon
              source="arrow-right-thin"
              size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
            />
          </View>
        )}
      </Row>
    </View>
  );
};

const NotificationToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <TouchableOpacity
      onPress={() => toggleSwitch()}
      style={[
        styles.toggleButton,
        {backgroundColor: isEnabled ? colors.primary : colors.gray200},
      ]}>
      <View
        style={[
          styles.toggleCircle,
          {
            backgroundColor: isEnabled ? colors.primary : colors.white,
            zIndex: isEnabled ? 1 : 10,
          },
        ]}
      />
      <View
        style={[
          styles.toggleCircle1,
          {
            backgroundColor: isEnabled ? colors.white : colors.gray200,
            zIndex: 4,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grayBg,
  },
  itemContainer: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  row: {
    backgroundColor: colors.white,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  rowContent: {
    width: '80%',
  },
  itemText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DFAULT,
    fontWeight: '500',
  },
  arrowIconContainer: {
    position: 'absolute',
    end: 0,
  },
  versionText: {
    textAlign: 'center',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    color: colors.gray700,
  },
  toggleButton: {
    flexDirection: 'row',
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT * 2.5,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT * 1.5,
    borderRadius: GLOBAL_KEYS.ICON_SIZE_DEFAULT * 1.5,
    overflow: 'hidden',
  },
  toggleCircle: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT * 1.5 - 4,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT * 1.5 - 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 3,
    start: 2,
    top: 2,
    bottom: 2,
  },
  toggleCircle1: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT * 1.5 - 4,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT * 1.5 - 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 3,
    end: 6,
    top: 2,
    bottom: 2,
  },
});

export default SettingScreen;
