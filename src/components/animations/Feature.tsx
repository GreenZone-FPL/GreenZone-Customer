import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { GLOBAL_KEYS } from '../../constants';
import { Column } from '../containers/Column';
import { NormalText } from '../texts/NormalText';

interface FeatureProps {
  message: string;
  animationSize: number;
}
export const Feature: React.FC<FeatureProps> = ({
  message = 'Tính năng đang phát triển',
  animationSize = Dimensions.get('window').width,
}) => {
  return (
    <Column style={styles.container}>
      <LottieView
        source={require('../../assets/animations/thinking.json')}
        autoPlay
        loop
        style={[
          styles.animation,
          {width: animationSize, height: animationSize},
        ]}
      />
   
      <NormalText text={message} style={styles.message} />
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
  },
  animation: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  message: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
  },
});
