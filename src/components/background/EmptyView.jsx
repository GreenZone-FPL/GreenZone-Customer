import { StyleSheet, Text, View , Image, Dimensions} from 'react-native'
import React from 'react'

const {width, height} = Dimensions.get('window');

export const EmptyView = () => (
  <View style={styles.emptyContainer}>
    <Image
      style={styles.emptyImage}
      resizeMode="cover"
      source={require('../../assets/images/logo.png')}
    />
  </View>
);

const styles = StyleSheet.create({
    emptyContainer: { justifyContent: 'center', alignItems: 'center' },
    emptyImage: { width: width / 2, height: width / 2 },
})