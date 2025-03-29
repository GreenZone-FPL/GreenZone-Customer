import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import Feather from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';


const QuantityButtonPropTypes = {
    iconName: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    iconColor: PropTypes.string,
    iconSize: PropTypes.number,
    style: PropTypes.object
}


/**
 * Usage Example
 *  <QuantityButton
         iconName="plus"
         onPress={() => {}}
         iconColor={colors.primary}
    />
 */
export const QuantityButton = ({
    iconName,
    onPress,
    iconColor,
    iconSize = 18,
    style,
    backgroundColor = colors.fbBg
}) => (

    <Pressable onPress={onPress} style={[styles.circleWrapper, { backgroundColor: backgroundColor }, style]}>
        <Feather name={iconName} color={iconColor} size={iconSize} />
    </Pressable>

);

QuantityButton.propTypes = QuantityButtonPropTypes

const styles = StyleSheet.create({
    circleWrapper: {
        borderRadius: 20,
        backgroundColor: colors.fbBg,
        justifyContent: 'center',
        padding: 6,
        alignItems: 'center',

    }
});
