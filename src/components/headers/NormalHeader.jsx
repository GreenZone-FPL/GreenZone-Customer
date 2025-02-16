import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import { Icon } from 'react-native-paper'
import PropTypes from 'prop-types'
import { Row } from '../containers/Row';


const NormalHeaderPropTypes = {
  title: PropTypes.string.isRequired,
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  onLeftPress: PropTypes.func,
  onRightPress: PropTypes.func,
  enableRightIcon: PropTypes.bool,
  leftIconColor: PropTypes.string,
  rightIconColor: PropTypes.string,
  style: PropTypes.object,
};

export const  NormalHeader = ({
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
    <Row style={[styles.header, style]}>

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
    </Row>
  );
};


NormalHeader.propTypes = NormalHeaderPropTypes;


const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: 24
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


