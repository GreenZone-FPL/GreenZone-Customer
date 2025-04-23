import React from 'react';
import { Column, LightStatusBar, Row } from '../components';
import { SkeletonBox } from './SkeletonBox';

export const HomeSkeleton = () => {
  return (
    <Column style={{ margin: 16, gap: 16 }}>
      <LightStatusBar />
      <SkeletonBox width="100%" height={150} borderRadius={12} />
      <SkeletonBox width="100%" height={100} borderRadius={12} />
      <SkeletonBox width="35%" height={18} borderRadius={0} />
      <Row style={{ gap: 16 }}>
        <SkeletonBox width="45%" height={250} borderRadius={12} />
        <SkeletonBox width="45%" height={250} borderRadius={12} />
        <SkeletonBox width="45%" height={250} borderRadius={12} />
      </Row>
    </Column>
  )
}

