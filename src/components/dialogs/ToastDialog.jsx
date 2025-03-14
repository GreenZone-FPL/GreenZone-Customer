import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Animated
} from 'react-native';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';

const ToastDialog = ({ isVisible, onHide, icon, title, iconColor }) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (isVisible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => onHide());
            }, 1500);
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <Modal transparent={true} animationType="fade" visible={isVisible}>
            <View style={styles.container}>
                <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
                    <Icon
                        source={icon}
                        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                        color={iconColor} // Màu thay đổi theo trạng thái
                    />
                    <Text style={styles.text}>{title}</Text>
                </Animated.View>
            </View>
        </Modal>
    );
};

ToastDialog.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    iconColor: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 10,
    },
    text: {
        color: colors.black,
        marginLeft: 10,
        fontWeight: 'bold'
    },
});

export default ToastDialog;
