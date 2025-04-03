import React from 'react';
import { Pressable, ViewStyle, TextStyle, Dimensions, TouchableOpacity } from 'react-native';
import { NormalText } from '../texts/NormalText';
import { colors } from '../../constants';

const { width } = Dimensions.get('window');

interface AuthButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle
}

export const AuthButton: React.FC<AuthButtonProps> = ({ title, onPress, style }) => {
    return (
        <TouchableOpacity
            style={[
                {
                    width: width / 3,
                    backgroundColor: colors.primary,
                    paddingVertical: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 16,
                    alignSelf: 'center',
                },
                style,
            ]}
            onPress={onPress}
        >
            <NormalText
                text={title}
                style={
                    { color: 'white', fontWeight: '600', textAlign: 'center' }
                }
            />
        </TouchableOpacity>
    );
};
