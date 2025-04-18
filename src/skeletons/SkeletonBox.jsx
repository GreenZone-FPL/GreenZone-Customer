import { MotiView } from 'moti';
import React from 'react';

export const SkeletonBox = ({ width, height, borderRadius = 8, style = {} }) => (
  <MotiView
    from={{ opacity: 0.3 }}
    animate={{ opacity: 1 }}
    transition={{
      loop: true,
      type: 'timing',
      duration: 700,
      delay: 100,
    }}
    style={[
      {
        width,
        height,
        backgroundColor: '#e1e9ee',
        borderRadius,
        marginBottom: 12,
      },
      style,
    ]}
  />
);

