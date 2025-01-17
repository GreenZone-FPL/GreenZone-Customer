import React from 'react';
import { SafeAreaView, Text, View, Image, Pressable, StyleSheet } from 'react-native';
import { Row } from '../containers/Row'; // Giả sử Row là component của bạn
import { GLOBAL_KEYS } from '../../constants';
import { TitleText } from '../texts/TitleText';
import { colors } from '../../constants';
import { Column } from '../containers/Column';
export const CategoryService = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Row style={{ padding: 16, flexWrap: 'wrap' }}>
        {services.map((service) => (
          <CardUtility
            key={service.id}
            title={service.title}
            image={service.image}
            onPress={service.onPress}
          />
        ))}
      </Row>
    </View>
  );
};

// Component Card Utility
const CardUtility = ({ image, title, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Column>
      <Image source={image} style={styles.cardImage} />
      <TitleText text={title} style={styles.textTitle}/>
    </Column>
  </Pressable>
);

const services = [
  {
    id: 1,
    title: 'Giao hàng',
    image: require('../../assets/images/image-Service/ic_delivery.png'), // Hình ảnh nội bộ
    onPress: () => console.log('Giao hàng pressed'),
  },
  {
    id: 2,
    title: 'Mang đi',
    image: require('../../assets/images/image-Service/ic_take_away.png'), // Hình ảnh nội bộ // URL cho hình ảnh
    onPress: () => console.log('Mang đi pressed'),
  },
  {
    id: 3,
    title: 'Voucher',
    image: require('../../assets/images/image-Service/voucher.png'), // Hình ảnh nội bộ // URL cho hình ảnh
    onPress: () => console.log('Cà phê hạt rang pressed'),
  },
  {
    id: 4,
    title: 'Đổi Xu',
    image: require('../../assets/images/image-Service/coin.png'), // Hình ảnh nội bộ
    onPress: () => console.log('Đổi Bean Xu'),
  },
];

export default CategoryService;

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginHorizontal: 16,
    gap: GLOBAL_KEYS.GAP_DEFAULT, 
    justifyContent: 'center'
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "22%", // Adjust width as necessary
    marginHorizontal: 2, // Adjust spacing between cards
  },
  cardImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  textTitle:{
    justifyContent: 'center',
    alignItems: 'center',
  }
});
