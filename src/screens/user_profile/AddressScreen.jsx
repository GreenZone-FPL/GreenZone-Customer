import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import NormalHeader from '../../components/headers/NormalHeader';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import ScreenEnum from '../../constants/screenEnum';


const AddressScreen = (props) => {
  const navigation = props.navigation
  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalHeader title='Địa chỉ đã lưu'
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Card
          icon="plus-circle"
          title="Thêm địa chỉ công ty"
          onPress={() => navigation.navigate(ScreenEnum.NewAddressScreen)}
        />
        <Card
          icon="plus-circle"
          title="Thêm địa chỉ nhà"
          onPress={() => navigation.navigate(ScreenEnum.NewAddressScreen)}
        />
        <Card
          icon="plus-circle"
          title="Thêm địa chỉ mới"
          onPress={() => navigation.navigate(ScreenEnum.NewAddressScreen)}
        />
      </View>

    </SafeAreaView>
  )
}

const Card = ({ icon, title, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Icon source={icon} size={28} color={colors.green500} />
    <Text style={styles.cardText}>{title}</Text>
  </Pressable>
);

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
    gap: 16
  },
  content: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: 16
  },
  card: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
})