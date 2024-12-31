import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Badge } from 'react-native-paper';
import colors from '../../constants/color';

const IconWithBadge = (props) => {
    const { onPress } = props
    return (
        <Pressable
            onPress={onPress}
            style={styles.container}>
            <View style={styles.button}>
                <Feather name="bell" style={styles.icon} size={24}/>
            </View>
            <Badge style={styles.badge}>13</Badge>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 44,
        height: 44,
        position: 'relative',
        justifyContent: 'center',
    },
    button: {
       padding: 10,
        borderRadius: 20,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    icon: {
        fontSize: 24,
        color: colors.primary,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.red800,
        color: colors.white,
        lineHeight: 16,
    },
});

export default IconWithBadge;
