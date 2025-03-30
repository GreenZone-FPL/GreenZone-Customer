import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {MainGraph} from '../../layouts/graphs';
const SplashScreen2 = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: MainGraph.graphName}],
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={{alignSelf: 'center', resizeMode: 'contain', marginRight: 20}}
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
});
