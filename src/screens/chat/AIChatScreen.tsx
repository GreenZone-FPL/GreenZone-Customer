import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Keyboard
} from 'react-native';
import { chatAssistant } from '../../axios';
import {
  OverlayStatusBar
} from '../../components';
import { colors } from '../../constants';
import { useHomeContainer } from '../../containers';
import { Toaster } from '../../utils';
import { About, ChatHeader, InputContainer, SuggestedList } from './chat-components';


interface Message {
  id: string,
  type: 'user' | 'ai'
  text: string,
  products: any[]
}
const AIChatScreen: React.FC = () => {
  const navigation = useNavigation()
  const [inputText, setInputText] = useState<string>('Tôi muốn ăn bánh');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList<Message>>(null);

  const { onNavigateProductDetailSheet, onClickAddToCart } = useHomeContainer();

  const handleSend = async (): Promise<void> => {
    try {
      setLoading(true)
      Keyboard.dismiss();
      const query = inputText.trim();
      const userMessage = {
        id: Date.now().toString(),
        type: 'user',
        text: query,
      };

      setMessages((prev: any) => {
        const updated = [...prev, userMessage];
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100); // Đợi một chút để UI render xong
        return updated;
      });

      setInputText('');

      const response = await chatAssistant(query);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text:
          response.length > 0
            ? `Tôi gợi ý các sản phẩm sau cho từ khóa "${query}":`
            : `Không tìm thấy sản phẩm nào phù hợp với "${query}".`,
        products: response,
      };

      setMessages((prev: any) => {
        const updated = [...prev, aiMessage];
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
        return updated;
      });
    
      console.log('response', JSON.stringify(response, null, 3));
    } catch (error: any) {
      Toaster.show(error.toString());
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        text: '⚠️ Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại.',
        products: [],
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false)
    }
  };


  const Message: React.FC<{ item: Message }> = ({ item }) => {
    if (item.type === 'user') {
      return (
        <View style={[styles.bubble, styles.userBubble]}>
          <Text style={styles.userText}>{item.text}</Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.bubble, styles.aiBubble]}>
          <Text style={styles.aiText}>{item.text}</Text>
          {
            item.type === 'ai' && item?.products?.length > 0 && (
              <SuggestedList
                products={item.products}
                onItemClick={onNavigateProductDetailSheet}
                onIconClick={onClickAddToCart}
              />
            )
          }

        </View>
      );
    }
  };

  return (
    <Pressable style={styles.modalContainer} onPress={() => navigation.goBack()}>


      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <Pressable onPress={() => { }} style={{ flex: 1 }}>

          <OverlayStatusBar />
          <ChatHeader />
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <Message item={item} />}
            ListHeaderComponent={
              <About />
            }
            contentContainerStyle={{ padding: 16 }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          />
          {
            loading &&
            <LottieView
              source={require('../../assets/animations/typing.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          }

          <InputContainer
            handleSend={handleSend}
            inputText={inputText}
            setInputText={setInputText}
          />

        </Pressable>

      </KeyboardAvoidingView>
    </Pressable>

  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.overlay,
    flex: 1,
    width: '100%',
    position: 'relative'
  },
  container: {
    width: '100%',
    backgroundColor: colors.white,
    flexDirection: 'column',
    flex: 1,
    borderTopLeftRadius: 40,
    borderBottomRightRadius: 20
  },

  bubble: {
    marginBottom: 16,
    maxWidth: '85%',
    borderWidth: 1,
    borderColor: colors.fbBg
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.lemon,
    padding: 12,
    borderRadius: 16,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.fbBg,
    paddingTop: 12,
    borderRadius: 16,
  },
  userText: { color: colors.white },
  aiText: {
    color: colors.black,
    marginBottom: 8,
    marginHorizontal: 10
  },
  productsWrapper: {
    marginTop: 8,
    maxHeight: 300
  },
  lottie: {
    width: 50,
    height: 50,
    marginHorizontal: 16,
    marginVertical: 4
  }

});

export default AIChatScreen;
