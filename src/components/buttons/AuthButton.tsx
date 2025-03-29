import React from 'react';
import { Pressable, ViewStyle, TextStyle } from 'react-native';
import { NormalText } from '../texts/NormalText';
import { Icon } from 'react-native-paper';
import { colors } from '../../constants';

interface AuthButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    titleStyle?: TextStyle;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ title, onPress, style, titleStyle }) => {
    return (
        <Pressable
            style={[{
                marginHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                marginBottom: title === 'Đăng nhập' ? 10 : 0
            }, style]}
            onPress={onPress}
        >
            <NormalText text={title} style={[{ color: colors.primary, fontWeight: '600', textAlign: 'right' }, titleStyle]} />
            <Icon source={'lead-pencil'} color={colors.primary} size={18} />
        </Pressable>
    );
};


