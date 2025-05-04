import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  Image,
  Easing,
} from 'react-native';
import {colors} from '../../constants';
import {OverlayStatusBar} from '../status-bars/OverlayStatusBar';
import {IconButton} from 'react-native-paper';

const {width} = Dimensions.get('window');
const carouselWidth = width - 64;

const VoucherPopup = ({onPress}) => {
  const [showVoucherPopup, setShowVoucherPopup] = useState(true);

  const closePopup = () => setShowVoucherPopup(false);

  return (
    <Modal visible={showVoucherPopup} animationType="slide" transparent={true}>
      <OverlayStatusBar />
      <Pressable style={styles.body} onPress={closePopup}>
        <Pressable onPress={onPress} style={styles.modalContent}>
          <View style={styles.closeButton}>
            <IconButton
              icon="close"
              size={24}
              onPress={closePopup}
              color={colors.primary}
            />
          </View>
          <MyCarousel />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const MyCarousel = () => {
  const data = [
    {id: 1, image: require('../../assets/banners/banner1.png')},
    {id: 2, image: require('../../assets/banners/banner2.png')},
  ];

  const [selectIndex, setSelectIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  // Cập nhật selectIndex mỗi 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectIndex(prevIndex => (prevIndex + 1) % data.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [data.length]);

  // Animation: chuyển đổi translateX của container chứa tất cả ảnh
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: -selectIndex * carouselWidth,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [selectIndex, translateX]);

  return (
    <View style={styles.carousel}>
      <Animated.View
        style={[
          styles.carouselRow,
          {
            transform: [{translateX}],
          },
        ]}>
        {data.map(item => (
          <View key={item.id} style={styles.carouselItem}>
            <Image source={item.image} style={styles.image} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: carouselWidth,
    height: carouselWidth,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: colors.overlay,
    borderRadius: 24,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carousel: {
    width: carouselWidth,
    height: carouselWidth,
  },
  carouselRow: {
    flexDirection: 'row',
    width: carouselWidth * 2,
    height: carouselWidth,
  },
  carouselItem: {
    width: carouselWidth,
    height: carouselWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  dotContainer: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: colors.overlay,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  selectDot: {
    backgroundColor: colors.primary,
  },
});

export default VoucherPopup;
