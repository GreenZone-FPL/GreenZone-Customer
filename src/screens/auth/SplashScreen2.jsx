import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import {BottomGraph, MainGraph} from '../../layouts/graphs';

const { width, height } = Dimensions.get('window')
const SplashScreen2 = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: BottomGraph.graphName}],
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={{ alignSelf: 'center', resizeMode: 'contain', marginRight: 20, width: width / 1.2 }}
        source={require('../../assets/images/logo.png')}
      />
    </View>
  );
};

export default SplashScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
})
