import React from 'react';
import { Dimensions, StatusBar, StyleSheet } from 'react-native';
import { Column, Row } from '../../components';
import { colors } from '../../constants';
import { SkeletonBox } from '../SkeletonBox';
const width = Dimensions.get('window').width
export const ProductDetailSkeleton = () => {
  return (
    <Column style={styles.container}>
      <SkeletonBox width={width} height={width / 1.2} borderRadius={12} />


      <Column style={styles.detailContainer}>
        <ProductInfoSkeleton />

        <RadioGroupSkeleton />
      </Column>

      <FooterSkeleton />
    </Column>
  );
};

const FooterSkeleton = () => {
  return (
    <Row style={styles.footer}>
      <Row style={{ alignItems: 'flex-end' }}>

        <SkeletonBox width={40} height={40} borderRadius={20} />
        <SkeletonBox width={35} height={3} borderRadius={20} />
        <SkeletonBox width={40} height={40} borderRadius={20} />
      </Row>

      <SkeletonBox width="45%" height={45} borderRadius={30} style={{ flex: 1 }} />
    </Row >
  )
}


const RadioGroupSkeleton = () => {
  return (
    <Column style={{ gap: 16 }}>
      <SkeletonBox width="20%" height={20} />
      <RadioSkeleton />
      <RadioSkeleton />
    </Column>
  )
}

const RadioSkeleton = () => {
  return (
    <Row style={styles.spaceBetween}>
      <Row>
        <SkeletonBox width={24} height={24} borderRadius={20} />
        <SkeletonBox width={60} height={10} />
      </Row>
      <SkeletonBox width="15%" height={10} />
    </Row>
  )
}

const ProductInfoSkeleton = () => {
  return (
    <Column style={{ gap: 10 }}>
      <Row style={styles.spaceBetween}>
        <SkeletonBox width="80%" height={20} />
        <SkeletonBox width={30} height={30} borderRadius={20} />

      </Row>

      <SkeletonBox width="100%" height={10} />
      <SkeletonBox width="90%" height={10} />
      <SkeletonBox width="15%" height={10} />
    </Column>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: 16,
    justifyContent: 'center'
  },
  detailContainer: {
    padding: 16, flex: 1, gap: 24 
  },
  footer: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    gap: 24
  },
  spaceBetween: {
    justifyContent: 'space-between',
    gap: 24
  }
});
