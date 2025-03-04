import React from "react";
import { View, StyleSheet } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";

const Skeleton = ({
  width = "100%",
  height = 50,
  borderRadius = 8,
  color = "#E1E9EE",
  highlightColor = "#F8F9FA",
}) => {
  return (
    <ShimmerPlaceholder
      style={[styles.skeleton, { width, height, borderRadius }]}
      shimmerColors={[color, highlightColor, color]}
      LinearGradientComponent={LinearGradient}
      autoRun={true}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    marginVertical: 5,
  },
});

export default Skeleton;

