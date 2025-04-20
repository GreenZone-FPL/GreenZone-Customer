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
  Keyboard,
  SafeAreaView
} from 'react-native';
import { chatAssistant } from '../../axios';
import {
  Column,
  NormalText,
  OverlayStatusBar
} from '../../components';
import { colors } from '../../constants';
import { useHomeContainer } from '../../containers';
import { Toaster } from '../../utils';
import { About, ChatHeader, InputContainer, SuggestedList } from './chat-components';
import moment from 'moment';

interface Message {
  id: string,
  type: 'user' | 'ai'
  text: string,
  products: any[],
  timestamp: number
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
        timestamp: Date.now(),
      };

      setMessages((prev: any) => {
        const updated = [...prev, userMessage];
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100); // Đợi một chút để UI render xong
        return updated;
      });

      setInputText('');

      const response = responses

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text:
          response.length > 0
            ? `Tôi gợi ý các sản phẩm sau cho từ khóa "${query}":`
            : `Không tìm thấy sản phẩm nào phù hợp với "${query}".`,
        products: response,
        timestamp: Date.now(),
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
        text: 'Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại.',
        products: [],
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false)
    }
  };


  const Message: React.FC<{ item: Message }> = ({ item }) => {
    // const formattedTime = new Date(item.timestamp).toLocaleTimeString()
    const formattedTime = moment(item.timestamp).utcOffset(7).format('HH:mm')
    if (item.type === 'user') {
      return (
        <Column style={[styles.bubble, styles.userBubble]}>
          <Text style={styles.userText}>{item.text}</Text>
          <Text style={styles.timestamp}>{formattedTime}</Text>
        </Column>

      );
    } else {
      return (
        <Column style={[styles.bubble, styles.aiBubble]}>
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
        </Column>
      );
    }
  };

  return (
    <SafeAreaView style={styles.modalContainer}>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >


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
          contentContainerStyle={{ gap: 16, padding: 16 }}
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

      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

const responses =  [
  {
     "_id": "67adfd23145c78765a8f8ad3",
     "name": "Tiramisu",
     "description": "Món bánh ngọt nổi tiếng của Ý với lớp kem mascarpone béo mịn, hòa quyện cùng vị đắng nhẹ của cà phê và cacao. Tiramisu có kết cấu mềm mịn, tan ngay trong miệng, mang lại cảm giác ngọt ngào đầy tinh tế.",
     "image": "https://greenzone.motcaiweb.io.vn/uploads/0127b909-8615-4728-ae4d-d26fe573c1aa.jpg",
     "originalPrice": 29000,
     "sellingPrice": 29000,
     "createdAt": "2025-02-13T14:09:39.467Z",
     "updatedAt": "2025-02-28T03:25:21.801Z",
     "__v": 0
  },
  {
     "_id": "67adfdbe145c78765a8f8ad8",
     "name": "Cheesecake",
     "description": "Bánh cheesecake với lớp phô mai béo ngậy, kết hợp cùng đế bánh quy giòn thơm. Vị chua nhẹ từ phô mai cân bằng với độ ngọt dịu, tạo nên một món tráng miệng hấp dẫn, thích hợp cho mọi dịp.",
     "image": "https://greenzone.motcaiweb.io.vn/uploads/729852db-66e6-43a8-9388-b483773e0b12.jpg",
     "originalPrice": 29000,
     "sellingPrice": 29000,
     "createdAt": "2025-02-13T14:12:14.350Z",
     "updatedAt": "2025-02-28T03:25:41.796Z",
     "__v": 0
  },
  {
     "_id": "67adfe1f145c78765a8f8add",
     "name": "Brownie",
     "description": "Bánh brownie đậm vị chocolate với kết cấu mềm dẻo và lớp vỏ hơi giòn. Khi ăn, bạn sẽ cảm nhận được sự hòa quyện hoàn hảo giữa độ đắng nhẹ của cacao và vị ngọt quyến rũ của đường, tạo nên trải nghiệm cực kỳ thú vị.",
     "image": "https://greenzone.motcaiweb.io.vn/uploads/4b6fdf84-29c2-4635-82f3-a197bbcfcbc8.webp",
     "originalPrice": 29000,
     "sellingPrice": 29000,
     "createdAt": "2025-02-13T14:13:51.383Z",
     "updatedAt": "2025-02-28T03:25:58.080Z",
     "__v": 0
  },
  {
     "_id": "67adfeaa145c78765a8f8ae2",
     "name": "Choux Cream",
     "description": "Bánh su kem với lớp vỏ mềm dai, bên trong là nhân kem béo ngậy, mát lạnh. Mỗi miếng cắn đều mang lại cảm giác ngọt dịu, tan chảy trong miệng, thích hợp để thưởng thức cùng trà hoặc cà phê.",
     "image": "https://greenzone.motcaiweb.io.vn/uploads/dddf79b6-7ca9-4b02-8316-cc901b940438.jpg",
     "originalPrice": 29000,
     "sellingPrice": 29000,
     "createdAt": "2025-02-13T14:16:10.613Z",
     "updatedAt": "2025-02-28T03:26:20.891Z",
     "__v": 0
  },
  {
     "_id": "67ae032a145c78765a8f8af4",
     "name": "Bánh Mì Que Pate",
     "description": "Những chiếc bánh mì que giòn tan, nhân pate béo ngậy kết hợp với chút bơ và ớt cay nhẹ, tạo nên một món ăn nhẹ đơn giản nhưng đậm đà hương vị, thích hợp để ăn cùng cà phê đen hoặc trà nóng.",
     "image": "https://greenzone.motcaiweb.io.vn/uploads/7b254e18-9145-4f33-abbc-8cb67866710d.jpg",
     "originalPrice": 27000,
     "sellingPrice": 27000,
     "createdAt": "2025-02-13T14:35:22.716Z",
     "updatedAt": "2025-02-28T03:28:22.372Z",
     "__v": 0
  }
]

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
    borderTopRightRadius: 40
  },

  bubble: {
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    gap: 3
  },
  userText: {
    color: colors.white,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timestamp: {
    fontSize: 10,
    color: colors.black,
    textAlign: 'right',
    marginRight: 12
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.fbBg,
    paddingTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.fbBg
  },

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
