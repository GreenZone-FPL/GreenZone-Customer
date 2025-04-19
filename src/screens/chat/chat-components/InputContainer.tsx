import React from 'react';
import { Image, Pressable, StyleSheet, TextInput } from 'react-native';
import { Icon } from 'react-native-paper';

import { Row } from '../../../components';
import { colors, GLOBAL_KEYS } from '../../../constants';

interface InputContainerProps {
  handleSend: () => Promise<void>;
}
export const InputContainer: React.FC<InputContainerProps> = ({handleSend}) => {

  const [inputText, setInputText] = React.useState('');
  return (
    <Row style={styles.inputRow}>
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder="Nhắn tin"
        returnKeyType="send"
        style={styles.input}
      />
      <Pressable onPress={handleSend}>
        {inputText.length === 0 ? (
          <Image
            source={require('../../../assets/images/star_light.png')}
            style={{width: 28, height: 28}}
            resizeMode="cover"
          />
        ) : (
          <Icon source="send" size={24} color={colors.primary} />
        )}
      </Pressable>
    </Row>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    height: 40,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
