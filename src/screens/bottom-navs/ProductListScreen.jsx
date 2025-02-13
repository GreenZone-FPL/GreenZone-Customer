import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import { getAllProductsAPI } from '../../axios'; // Import API thật

const ProductListScreen = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);  // Thêm trạng thái loading để kiểm soát hiển thị trong khi lấy dữ liệu

  useEffect(() => {
    // Gọi API thật để lấy dữ liệu
    const fetchData = async () => {
      try {
        const response = await getAllProductsAPI(); // Gọi API để lấy sản phẩm
        // Lấy tất cả sản phẩm từ mỗi danh mục, giới hạn 10 sản phẩm
        const allProducts = response.flatMap(category => category.products).slice(0, 10);
        setFeaturedProducts(allProducts);  // Lưu danh sách sản phẩm vào state
        setLoading(false); // Đã tải xong
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Dừng trạng thái loading dù có lỗi
      }
    };
    
    fetchData();
  }, []);

  // Nếu dữ liệu đang được tải, hiển thị một thông báo
  if (loading) {
    return <Text>Loading...</Text>;
  }

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.sellingPrice || item.originalPrice}</Text>
    </View>
  );

  return (
    // Bọc FlatList trong ScrollView để có thể cuộn
    <ScrollView contentContainerStyle={styles.scrollView}>
      <FlatList
        data={featuredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.name}
        // Hiển thị theo chiều dọc
        vertical={true}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingBottom: 10, // Đảm bảo có không gian ở dưới cùng để cuộn
  },
  productContainer: {
    margin: 10,
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ProductListScreen;
