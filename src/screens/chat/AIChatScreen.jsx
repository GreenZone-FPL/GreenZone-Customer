import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import { getAllProducts } from '../../axios';
import {
  Column,
  NormalText,
  OverlayStatusBar,
  ProductsListVertical,
  Row,
  TitleText
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useHomeContainer } from '../../containers';
import { ChatHeader, About, InputContainer } from './chat-components';

const AIChatScreen = () => {
  const navigation = useNavigation()
  const [allProducts, setAllProducts] = useState([]);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const { onNavigateProductDetailSheet, onClickAddToCart } = useHomeContainer();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        const flatList = data.flatMap(category => category.products);
        setAllProducts(flatList);
      } catch (error) {
        console.error('Fetch products failed', error);
      }
    };
    fetchProducts();
  }, []);

  const removeVietnameseTones = str => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  };

  const handleSend = () => {
    const query = inputText.trim();
    if (!query) return;

    const normalizedQuery = removeVietnameseTones(query);
    const filtered = allProducts.filter(item =>
      removeVietnameseTones(item.name).includes(normalizedQuery),
    );

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: query,
    };

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      text:
        filtered.length > 0
          ? `Tôi gợi ý các sản phẩm sau cho từ khóa "${query}":`
          : `Không tìm thấy sản phẩm nào phù hợp với "${query}".`,
      products: filtered,
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
    setFilteredList(filtered);
    setInputText('');
  };

  const renderMessage = ({ item }) => {
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
          {item.products && item.products.length > 0 && (
            <View style={styles.productsWrapper}>
              <ProductsListVertical
                scrollEnabled={false}
                products={filteredList}
                onItemClick={onNavigateProductDetailSheet}
                onIconClick={onClickAddToCart}
              />
            </View>
          )}
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

          <ScrollView style={{ flex: 1 }}>

            <About />

            <FlatList
              data={messages}
              keyExtractor={item => item.id}
              renderItem={renderMessage}
              contentContainerStyle={{ padding: 16 }}
              keyboardShouldPersistTaps="handled"

            />
          </ScrollView>

          <InputContainer handleSend={handleSend} />
         
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },


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
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bubble: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 12,
    borderRadius: 16,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 16,
  },
  userText: { color: '#000' },
  aiText: {
    color: '#333',
    marginBottom: 8
  },
  productsWrapper: {
    marginTop: 8,
    maxHeight: 300
  },

});

export default AIChatScreen;
