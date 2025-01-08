import {
  Image,
  SafeAreaView,
  View,
  Text,
  Button,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import ScreenEnum from '../../constants/screenEnum';
import HeaderWithBadge from '../../components/headers/HeaderWithBadge';
import colors from '../../constants/color';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import CategoryMenu from '../../components/category/CategoryMenu';

const {width} = Dimensions.get('window');

const HomeScreen = props => {


  const {navigation} = props;

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <HeaderWithBadge
        title="Home"
        onBadgePress={() => {
          navigation.navigate('ProductDetailSheet')
        }}
        isHome={true}
      />
      <Button title='Checkout Screen' onPress={() => navigation.navigate(ScreenEnum.CheckoutScreen)}/>

      <CategoryMenu />

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white
  }

});
