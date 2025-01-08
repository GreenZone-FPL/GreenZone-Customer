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
  ScrollView,
} from 'react-native';
import React from 'react';
import ScreenEnum from '../../constants/screenEnum';
import HeaderWithBadge from '../../components/headers/HeaderWithBadge';
import colors from '../../constants/color';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import OverlayStatusBar from '../../components/status-bars/OverlayStatusBar';
import CategoryMenu from '../../components/category/CategoryMenu';
import ProductsComboScreen from '../../components/products/ProductsListHorizontal';
import ProductsNewDishScreen from '../../components/products/ProductsListVertical';
const {width} = Dimensions.get('window');

const HomeScreen = props => {
  const {navigation} = props;

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <LightStatusBar />
        <HeaderWithBadge
          title="Home"
          onBadgePress={() => console.log('Click badge')}
          isHome={true}
        />

        <CategoryMenu />
        <ProductsComboScreen
          onItemClick={() => navigation.navigate('ProductDetailSheet')}
        />
        <ProductsNewDishScreen
          onItemClick={() => navigation.navigate('ProductDetailSheet')}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
});
