import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
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
const QuantityButton = ({
    iconName,
    onPress,
    iconColor,
    iconSize = 18,
    style
}) => (
    <Pressable onPress={onPress}>
        <View style={[styles.circleWrapper, { borderColor: iconColor }, style]}>
            <Feather name={iconName} color={iconColor} size={iconSize} />
        </View>
    </Pressable>
);

QuantityButton.propTypes = QuantityButtonPropTypes

const styles = StyleSheet.create({
    circleWrapper: {
        width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        borderRadius: GLOBAL_KEYS.ICON_SIZE_DEFAULT / 2,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray400,
    }
});
export default QuantityButton