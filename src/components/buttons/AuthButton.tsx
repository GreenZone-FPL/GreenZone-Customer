// @ts-ignore
import React from 'react';
import { Dimensions, Pressable, ViewStyle } from 'react-native';
import { colors } from '../../constants';
import { NormalText } from '../texts/NormalText';

const { width } = Dimensions.get('window');

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ title, onPress, style }) => {
  return (
    <Pressable
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
    </Pressable>
  );
};
