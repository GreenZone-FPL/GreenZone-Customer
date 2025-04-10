import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { GLOBAL_KEYS, colors } from '../../constants';
import PropTypes from 'prop-types';

const DualTextRowPropTypes = {
  leftText: PropTypes.string,
  rightText: PropTypes.string,
  leftTextStyle: PropTypes.object,
  rightTextStyle: PropTypes.object,
  onRightPress: PropTypes.func,
  onLeftPress: PropTypes.func,
  style: PropTypes.object,
};

/**
 * Component DualTextRow hiển thị 2 đoạn text (trái và phải) trong một hàng ngang.
 */
export const DualTextRow = ({
  leftText,
  rightText,
  leftTextStyle = {},
  rightTextStyle = {},
  onRightPress,
  onLeftPress,
  style,
}) => {
  return (
    <View style={[styles.row, style]}>
      <Pressable onPress={onLeftPress} style={{ flex: 1 }}>
        <Text style={[styles.normalText, { textAlign: 'left' }, leftTextStyle]}>
          {leftText}
        </Text>
      </Pressable>

      <Pressable onPress={onRightPress} style={{ flex: 1 }}>
        <Text style={[styles.normalText, { textAlign: 'right' }, rightTextStyle]}>
          {rightText}
        </Text>
      </Pressable>
    </View>
  );
};

DualTextRow.propTypes = DualTextRowPropTypes;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  normalText: {
    lineHeight: 20,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '400',
  },
});
