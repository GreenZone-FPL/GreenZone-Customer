import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Column } from '../../components';
import { colors } from '../../constants';
import { SkeletonBox } from '../SkeletonBox';
export const ProductDetailSkeleton = () => {
  return (
    <Column style={styles.container}>
      <SkeletonBox width="100%" height={300} borderRadius={12} />


      <Column style={{ paddingHorizontal: 16, flex: 1, gap: 12 }}>
        <SkeletonBox width="80%" height={25} />
        <SkeletonBox width="40%" height={20} />
        <SkeletonBox width="100%" height={15} />
        <SkeletonBox width="90%" height={15} />
        <SkeletonBox width="95%" height={15} />
      </Column>

      <SkeletonBox width="95%" height={70} style={{ alignSelf: 'center' }} />
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
