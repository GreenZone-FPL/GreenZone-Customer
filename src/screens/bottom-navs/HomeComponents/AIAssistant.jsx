import React, { useRef } from 'react';
import { Animated, Image, StyleSheet, PanResponder, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppGraph } from '../../../layouts/graphs';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_WIDTH = 60; // Hoặc kích thước thực của hình ảnh robot
const IMAGE_HEIGHT = 60; // Hoặc kích thước thực của hình ảnh robot

// Khởi tạo vị trí ban đầu
const INITIAL_X = SCREEN_WIDTH - 70;
const INITIAL_Y = SCREEN_HEIGHT - 200;

export const AIAssistant = () => {
  const navigation = useNavigation();
  const pan = useRef(new Animated.ValueXY({ x: INITIAL_X, y: INITIAL_Y })).current;

  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Chỉ bắt drag khi di chuyển đủ xa (ví dụ: 5px)
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })

  ).current;

  return (
    <Animated.View style={[styles.chat, pan.getLayout()]} {...panResponder.panHandlers}>
      <Pressable onPress={() => navigation.navigate(AppGraph.AIChatScreen)}>
        <Image source={require('../../../assets/images/robot.png')} style={styles.imageRobot} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chat: {
    position: 'absolute',
    zIndex: 10,
    elevation: 10, // Android shadow
  },
  imageRobot: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
  },
});


