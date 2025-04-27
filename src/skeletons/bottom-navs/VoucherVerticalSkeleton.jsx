import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Column, Row } from '../../components';
import { colors } from '../../constants';
import { SkeletonBox } from '../SkeletonBox';

const { width } = Dimensions.get('window');
export const VoucherVerticalSkeleton = () => {
  return (
    <Column style={styles.container}>
      <SkeletonBox width={100} height={24} borderRadius={20} />
      <VoucherItemSkeleton />
      <VoucherItemSkeleton />
      <VoucherItemSkeleton />
    </Column>
  );
};

const VoucherItemSkeleton = () => {
  return (
    <Row style={styles.itemVoucher}>
      <SkeletonBox width={width / 5.5} height={width / 5.5} borderRadius={width / 1.5} />

      <Column style={{ flex: 1, gap: 16 }}>
        <SkeletonBox width={150} height={15} />
        <Row>
          <SkeletonBox width={24} height={24} borderRadius={20} />
          <SkeletonBox width={50} height={15} />
        </Row>

        <SkeletonBox width={170} height={12} />
      </Column>

    </Row>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    gap: 16

  },
  itemVoucher: {
    gap: 16,
    marginBottom: 2
  },
  image: {
    width: width / 5.5,
    height: width / 5.5,
    borderRadius: width / 1.5,
    resizeMode: 'cover',
  }
});
