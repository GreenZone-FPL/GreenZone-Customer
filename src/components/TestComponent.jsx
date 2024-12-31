import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button } from 'react-native';
import CustomSearchBar from './inputs/CustomSearchBar';
import HeaderWithBadge from './headers/HeaderWithBadge';
import colors from '../constants/color';

const TestComponent = () => {


  const [searchQuery, setSearchQuery] = useState('');
  return (
    <SafeAreaView style={styles.container}>

      <HeaderWithBadge title="Test Component" isHome={true} />


      <View style={styles.containerContent}>

        <CustomSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Tìm kiếm sản phẩm"
        />





        

      </View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  containerContent: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: 16,
    gap: 16
  }
});

export default TestComponent;
