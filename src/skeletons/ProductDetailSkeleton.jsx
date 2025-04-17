import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SkeletonBox } from './SkeletonBox';
import { Column } from '../components';
import { colors } from '../constants';
export const ProductDetailSkeleton = () => {
  return (
    <Column style={styles.container}>
      <SkeletonBox width="100%" height={300} borderRadius={12} />
      <Column style={{ paddingHorizontal: 16, flex: 1 }}>
        <SkeletonBox width="80%" height={25} />
        <SkeletonBox width="40%" height={20} />
        <SkeletonBox width="100%" height={15} />
        <SkeletonBox width="90%" height={15} />
        <SkeletonBox width="95%" height={15} />
      </Column>

      <SkeletonBox width="95%" height={70} style={{alignSelf: 'center'}} />
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: StatusBar.currentHeight + 40,


  },
});
