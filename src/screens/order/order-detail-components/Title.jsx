import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { colors, GLOBAL_KEYS } from '../../../constants';

export const Title = ({
    title,
    icon,
    titleStyle,
    iconColor = colors.primary,
    iconSize = GLOBAL_KEYS.ICON_SIZE_DEFAULT,
}) => {
    return (
        <View style={styles.titleContainer}>
            {icon && <Icon source={icon} color={iconColor} size={iconSize} />}

            <Text style={[styles.title, titleStyle]}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: GLOBAL_KEYS.GAP_SMALL,
    },
    title: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
        color: colors.lemon,
        fontWeight: '500',
    }
})