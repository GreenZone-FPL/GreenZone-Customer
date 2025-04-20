import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SkeletonBox } from './SkeletonBox';
import { Column, Row } from '../components';

export const HomeSkeleton = () => {
   return (
    <Column style={{margin: 16, gap: 16}}>
        <SkeletonBox width="100%" height={150} borderRadius={12} />
        <SkeletonBox width="100%" height={100} borderRadius={12} />
        <SkeletonBox width="35%" height={18} borderRadius={0} />
        <Row style={{flexDirection: 'row', gap: 16}}>
            <SkeletonBox width="45%" height={250} borderRadius={12} />
            <SkeletonBox width="45%" height={250} borderRadius={12} />
            <SkeletonBox width="45%" height={250} borderRadius={12} />
        </Row>
    </Column> 
  )
}

const styles = StyleSheet.create({})