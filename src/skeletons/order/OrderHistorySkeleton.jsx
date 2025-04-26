import React from 'react';
import { StyleSheet } from 'react-native';
import { Column, Row } from '../../components';
import { colors } from '../../constants';
import { SkeletonBox } from '../SkeletonBox';
export const OrderHistorySkeleton = () => {
  return (
    <Column style={styles.container}>
      <OrderItemSkeleton />
      <OrderItemSkeleton />
      <OrderItemSkeleton />
    </Column>
  );
};

const OrderItemSkeleton = () => {
  return (
    <Column style={styles.itemContainer}>
      <Row>
        <SkeletonBox width={30} height={30} borderRadius={20} />
        <Row style={{ flex: 1 }}>
          <Column style={{ flex: 1, gap: 10 }}>
            <SkeletonBox width={100} height={12} />
            <SkeletonBox width={100} height={12} />
            <SkeletonBox width={100} height={12} />
          </Column>


          <Column style={{ justifyContent: 'flex-end', gap: 16 }}>
            <SkeletonBox width={100} height={12} />
            <SkeletonBox width={100} height={12} />
          </Column>
        </Row>
      </Row>
    </Column>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // gap: 16
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16
  }
});
