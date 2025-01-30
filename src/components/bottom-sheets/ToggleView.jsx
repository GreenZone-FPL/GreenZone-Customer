import React, { useCallback } from "react";
import { View, Text, Image, Button, StyleSheet, LayoutAnimation, UIManager, Platform } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";

// Kích hoạt LayoutAnimation trên Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ToggleView = () => {
  const isVertical = useSharedValue(0); // 0 = Horizontal, 1 = Vertical

  const toggleLayout = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Mượt UI khi thay đổi layout
    isVertical.value = isVertical.value === 0 ? 1 : 0;
  }, []);

  // Animation cho container (đổi flexDirection & alignItems)
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    flexDirection: isVertical.value ? "column" : "row",
    alignItems: "center", // Canh giữa cho cả ảnh và text
    justifyContent: "center", // Canh giữa các phần tử theo chiều dọc
    overflow: "hidden", // Đảm bảo phần tử không bị tràn
  }));

  // Animation cho hình ảnh
  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(isVertical.value ? 0 : -30, { damping: 15, stiffness: 120 }) },
      { translateY: withSpring(isVertical.value ? -20 : 0, { damping: 15, stiffness: 120 }) },
      { scale: withSpring(isVertical.value ? 1.1 : 1, { damping: 15, stiffness: 120 }) },
    ],
    opacity: withSpring(isVertical.value ? 1 : 0.9),
  }));

  // Animation cho text
  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(isVertical.value ? 0 : 30, { damping: 15, stiffness: 120 }) },
      { translateY: withSpring(isVertical.value ? 20 : 0, { damping: 15, stiffness: 120 }) },
    ],
    opacity: withSpring(isVertical.value ? 1 : 0.9),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, containerAnimatedStyle]}>
        <Animated.Image
          source={{ uri: "https://www.odtap.com/wp-content/uploads/2018/10/food-delivery.jpg" }}
          style={[styles.image, imageAnimatedStyle]}
        />
        <Animated.Text style={[styles.text, textAnimatedStyle]}>
          Hello, React Native!
        </Animated.Text>
      </Animated.View>
      <Button title="Toggle Layout" onPress={toggleLayout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#ddd",
    padding: 40, // Tăng padding để tạo không gian thoải mái
    borderRadius: 10,
    alignItems: "center", // Đảm bảo ảnh và text canh giữa
    justifyContent: "center", // Canh giữa theo chiều dọc
    flexWrap: "wrap", // Cho phép các phần tử con tự wrap khi cần
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10, // Thêm marginBottom để có khoảng cách giữa ảnh và text
  },
  text: {
    fontSize: 18,
    textAlign: "center", // Căn giữa văn bản nếu cần
  },
});

export default ToggleView;
