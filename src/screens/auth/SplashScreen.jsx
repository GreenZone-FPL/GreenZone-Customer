import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { AppGraph } from '../../layouts/graphs';


const SplashScreen = ({navigation}) => {
 

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(AppGraph.MAIN); 
    }, 1000);

   
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SplashScreen</Text>
    </View>
  );
};

export default SplashScreen;

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
