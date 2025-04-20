import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-paper';

import {Row, TitleText} from '../../../components';
import {colors, GLOBAL_KEYS} from '../../../constants';

export const ChatHeader: React.FC = () => {
  const navigation = useNavigation();
  return (
    <Row style={styles.header}>
      <Pressable onPress={() => navigation.goBack()}>
        <Icon source="close" size={24} color={colors.primary} />
      </Pressable>

      <Row>
        <TitleText text="GreenZone Assistant" />
        <Icon source="check-decagram" size={18} color={colors.primary} />
      </Row>

      <View style={styles.placeholderIcon} />
    </Row>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
    color: colors.black,
  },
  placeholderIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
  },
});
