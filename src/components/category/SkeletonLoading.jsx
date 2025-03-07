import { StyleSheet, View } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SkeletonLoading = ({ 
  width = 300, 
  height = 200, 
  borderRadius = 8 
}) => {
  return (
    <SkeletonPlaceholder borderRadius={borderRadius}>
      <SkeletonPlaceholder.Item width={width} height={height} />
    </SkeletonPlaceholder>
  );
};

export default SkeletonLoading;

const styles = StyleSheet.create({});