import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { getAllProducts } from '../../axios';
import {
  LightStatusBar,
  ProductsListVertical,
  NormalText,
} from '../../components';
import { colors } from '../../constants';
import { useHomeContainer } from '../../containers';

const AIChatScreen = () => {
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <LightStatusBar />
      <FlatList
        data={messages} // chỉ lấy 2 tin nhắn cuối
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      />


      <View style={styles.inputRow}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nhập để tìm kiếm sản phẩm..."
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <NormalText text="Gửi" style={{ color: 'white', fontWeight: '500' }} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
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
