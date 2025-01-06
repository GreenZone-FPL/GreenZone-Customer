import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import { Icon } from 'react-native-paper'

const NormalHeader = ({
  title = 'Default Title',
  leftIcon = 'arrow-left',
  rightIcon = 'shopping-outline',
  onLeftPress,
  onRightPress,
  enableRightIcon = false,
  leftIconColor = colors.black,
  rightIconColor = colors.black,
  style
}) => {
  return (
    <View style={[styles.header, style]}>

      <TouchableOpacity onPress={onLeftPress}>
        <Icon source={leftIcon} size={24} color={leftIconColor} />
      </TouchableOpacity>


      <Text style={styles.title}>{title}</Text>


      {enableRightIcon ? (
        <TouchableOpacity onPress={onRightPress}>
          <Icon source={rightIcon} size={24} color={rightIconColor} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholderIcon} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    height: 56,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.black,
    flex: 1,
  },
  placeholderIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
  },
});

export default NormalHeader;
