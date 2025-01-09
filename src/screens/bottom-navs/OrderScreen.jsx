import {StyleSheet, Image, SafeAreaView} from 'react-native';
import React from 'react';


const OrderScreen = props => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/bottom_order.jpg')}
        style={{width: '100%', height: '100%', resizeMode: 'cover'}}
      />
    </SafeAreaView>
  );
};

export default OrderScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
