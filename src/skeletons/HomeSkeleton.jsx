import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SkeletonBox } from './SkeletonBox';
import { Column, Row } from '../components';
import { colors } from '../constants';

export const HomeSkeleton = () => {
   return (
    <View style={{margin: 16, gap: 16}}>
        <SkeletonBox width="100%" height={150} borderRadius={12} />
        <SkeletonBox width="100%" height={100} borderRadius={12} />
        <SkeletonBox width="35%" height={18} borderRadius={0} />
        <View style={{flexDirection: 'row', gap: 16}}>
            <SkeletonBox width="45%" height={250} borderRadius={12} />
            <SkeletonBox width="45%" height={250} borderRadius={12} />
            <SkeletonBox width="45%" height={250} borderRadius={12} />
        </View>
    </View> 
  )
}

const styles = StyleSheet.create({})