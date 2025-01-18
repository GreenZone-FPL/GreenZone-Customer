import {ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, GLOBAL_KEYS} from '../../constants';

export const IndicatorSmall = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator
        size={GLOBAL_KEYS.ICON_SIZE_SMALL}
        color={colors.primary}
      />
    </SafeAreaView>
  );
};

export const IndicatorDeffault = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator
        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        color={colors.primary}
      />
    </SafeAreaView>
  );
};

export const IndicatorLarge = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator
        size={GLOBAL_KEYS.ICON_SIZE_LARGE}
        color={colors.primary}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
});
