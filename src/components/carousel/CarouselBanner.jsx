import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import {colors} from '../../constants';

const carouselWidth = Dimensions.get('window').width;

const CarouselBanner = ({onPress}) => {
  const data = [
    {id: 1, image: require('../../assets/banners/banner1.png')},
    {id: 2, image: require('../../assets/banners/banner2.png')},
    {id: 3, image: require('../../assets/banners/banner3.png')},
  ];

  const [selectIndex, setSelectIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  // Tự động chuyển ảnh mỗi 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectIndex(prevIndex => (prevIndex + 1) % data.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [data.length]);

  // Animation chuyển slide
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: -selectIndex * carouselWidth,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [selectIndex]);

  return (
    <Pressable onPress={onPress} style={styles.carousel}>
      <Animated.View
        style={[
          styles.carouselRow,
          {
            transform: [{translateX}],
          },
        ]}>
        {data.map(item => (
          <View key={item.id} style={styles.carouselItem}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </Animated.View>
      <View style={styles.dotContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === selectIndex && styles.selectDot]}
          />
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  carousel: {
    width: carouselWidth - 32,
    height: 150,
    overflow: 'hidden',
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  carouselRow: {
    flexDirection: 'row',
    width: carouselWidth,
  },
  carouselItem: {
    width: carouselWidth,
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  selectDot: {
    backgroundColor: '#333',
  },
});

export default CarouselBanner;
