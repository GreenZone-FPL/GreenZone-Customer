import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {Column, Row} from '../../components';
import {colors} from '../../constants';
import {SkeletonBox} from '../SkeletonBox';

const {width} = Dimensions.get('window');
export const MerchantListSkeleton = ({numOfRows = 3}) => {
  return (
    <Column style={{gap: 2}}>
      {Array.from({length: numOfRows}).map((_, index) => (
        <MerchantItemSkeleton key={index} />
      ))}
    </Column>
  );
};

export const MerchantItemSkeleton = () => {
  return (
    <Row style={styles.itemVoucher}>
      <SkeletonBox width={width / 5} height={width / 5} borderRadius={width/2} />

      <Column style={{flex: 1, gap: 10}}>
        <SkeletonBox width={150} height={15} />

        <SkeletonBox width={'100%'} height={10} />

        <SkeletonBox width={'100%'} height={10} />
        <SkeletonBox width={60} height={10} />
      </Column>
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    gap: 16,
  },
  itemVoucher: {
    gap: 16,
    marginBottom: 2,
    padding: 16,
  },
  image: {
    width: width / 4.5,
    height: width / 4.5,
    borderRadius: width / 1.5,
    resizeMode: 'cover',
  },
});
