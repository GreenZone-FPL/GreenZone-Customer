import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { Row } from '../containers/Row'; // Giả sử Row là component của bạn
import { GLOBAL_KEYS } from '../../constants';
import { TitleText } from '../texts/TitleText';
import { colors } from '../../constants';
export const CategoryService = ({ navigation }) => {
  return (
      <Row style={styles.container}>
        {services.map((service) => (
          <CardUtility
            key={service.id}
            title={service.title}
            image={service.image}
            onPress={service.onPress}
          />
        ))}
      </Row>
  );
};

const CardUtility = ({ image, title, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.cardImage} />
      <TitleText text={title} style={styles.textTitle}/>
  </Pressable>
);

const services = [
  {
    id: 1,
    title: 'Giao hàng',
    image: require('../../assets/images/image-Service/ic_delivery.png'),
    onPress: () => console.log('Giao hàng pressed'),
  },
  {
    id: 2,
    title: 'Mang đi',
    image: require('../../assets/images/image-Service/ic_take_away.png'),
    onPress: () => console.log('Mang đi pressed'),
  },
  {
    id: 3,
    title: 'Voucher',
    image: require('../../assets/images/image-Service/voucher.png'), 
    onPress: () => console.log('Cà phê hạt rang pressed'),
  },
  {
    id: 4,
    title: 'Đổi Xu',
    image: require('../../assets/images/image-Service/coin.png'), 
    onPress: () => console.log('Đổi Bean Xu'),
  },
];

export default CategoryService;

const styles = StyleSheet.create({
  container: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginHorizontal: 16,
    gap: GLOBAL_KEYS.GAP_DEFAULT, 
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    justifyContent: 'space-around'
  },
  card: {
    alignItems: 'center',
    justifyContent: 'space-around',
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
