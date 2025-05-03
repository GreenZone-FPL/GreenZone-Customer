import LottieView from 'lottie-react-native';
import React, {useRef, useState} from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {chatAssistant} from '../../axios';
import {OverlayStatusBar} from '../../components';
import {colors} from '../../constants';
import {IMessage} from '../../type-interface'
import {Toaster} from '../../utils';
import {
  About,
  ChatHeader,
  InputContainer,
  MessageView,
} from './chat-components';

const AIChatScreen: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const flatListRef = useRef<FlatList<IMessage>>(null);

  const handleSend = async (): Promise<void> => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      const query = inputText.trim();
      const userMessage = {
        id: Date.now().toString(),
        type: 'user',
        text: query,
        products: [],
        timestamp: Date.now(),
      };

      setMessages((prev: any) => [...prev, userMessage]);

      setInputText('');

      // const response = fakeResponsesProducts
      const response = await chatAssistant(query);

      const aiMessage: IMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text:
          response.length > 0
            ? `Tôi gợi ý các sản phẩm sau cho từ khóa "${query}":`
            : `Không tìm thấy sản phẩm nào phù hợp với "${query}".`,
        products: response,
        timestamp: Date.now(),
      };

      setMessages((prev: any) => [...prev, aiMessage]);


    } catch (error: any) {
      Toaster.show(error.toString());
      const errorMessage: IMessage = {
        id: Date.now().toString(),
        type: 'ai',
        text: 'Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại.',
        products: [],
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.modalContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ios: 'padding', android: undefined})}>
        <OverlayStatusBar />
        <ChatHeader />
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({item}) => <MessageView item={item} />}
          ListHeaderComponent={
            <About
              handleSuggestionPress={suggestion => setInputText(suggestion)}
            />
          }
          contentContainerStyle={{gap: 16, padding: 16}}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          onContentSizeChange={() => {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100); // delay 1 chút để tránh scroll quá sớm khi chưa render xong
          }}
          
        />

        {loading && (
          <LottieView
            source={require('../../assets/animations/typing.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        )}

        <InputContainer
          handleSend={handleSend}
          inputText={inputText}
          setInputText={setInputText}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.overlay,
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  container: {
    width: '100%',
    backgroundColor: colors.white,
    flexDirection: 'column',
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  productsWrapper: {
    marginTop: 8,
    maxHeight: 300,
  },
  lottie: {
    width: 50,
    height: 50,
    marginHorizontal: 16,
    marginVertical: 4,
  },
});

export default AIChatScreen;
