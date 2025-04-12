import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';
import { GLOBAL_KEYS, colors } from '../../constants';
import { TextFormatter } from '../../utils/textFormatter';

const IconWithBadgePropTypes = {
    quantity: PropTypes.number,
    onPress: PropTypes.func,
};

export const IconWithBadge = ({ quantity = 10, onPress }) => {
    return (
        <View style={styles.container}>
            <Pressable onPress={onPress} style={styles.button}>
                <Feather name="bell" style={styles.icon} />
            </Pressable>
            {
                (quantity < GLOBAL_KEYS.MAX_QUANTITY &&
                    quantity > GLOBAL_KEYS.MIN_QUANTITY) &&
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{TextFormatter.formatQuantity(quantity)}</Text>
                </View>
            }


        </View>
    );
};

IconWithBadge.propTypes = IconWithBadgePropTypes;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    button: {
        padding: GLOBAL_KEYS.PADDING_SMALL,
        borderRadius: 20,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: colors.fbBg
    },
    icon: {
        fontSize: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        color: colors.primary,
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: colors.red800,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    badgeText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
});
