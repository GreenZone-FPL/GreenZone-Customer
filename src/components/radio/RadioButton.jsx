import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/global_keys';

const RadioButton = ({
    label,
    selected,
    additionalInfo,
    onPress,
}) => {
    const radioColor = selected ? colors.primary : colors.gray700
    const textColor = selected ? colors.primary : colors.black

    return (

        <Pressable style={styles.radioContainer} onPress={onPress}>
            <View style={[styles.outerCircle, { borderColor: radioColor }]}>
                {selected && <View style={styles.innerCircle} />}
            </View>

            <Text style={[styles.label, { color: textColor }]}>
                {label}
            </Text>

            {/* Thông tin thêm */}

            {additionalInfo && (
                <Text style={[styles.additionalInfo, { color: textColor }]}>
                    {additionalInfo}
                </Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    },
    outerCircle: {
        width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        borderRadius: GLOBAL_KEYS.ICON_SIZE_DEFAULT / 2,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: GLOBAL_KEYS.PADDING_SMALL,
    },
    innerCircle: {
        width: GLOBAL_KEYS.ICON_SIZE_DEFAULT / 2,
        height: GLOBAL_KEYS.ICON_SIZE_DEFAULT / 2,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        backgroundColor: colors.primary,
    },
    label: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        flex: 1
    },
    additionalInfo: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    },
});

export default RadioButton;
