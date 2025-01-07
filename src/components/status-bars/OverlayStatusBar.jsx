import React from 'react';
import { StatusBar } from 'react-native';
import colors from '../../constants/color';

const OverlayStatusBar = () => (
  <StatusBar
    animated={true}
    backgroundColor={colors.overlay}
    hidden={false}
    barStyle="dark-content"
  />
);

export default OverlayStatusBar
