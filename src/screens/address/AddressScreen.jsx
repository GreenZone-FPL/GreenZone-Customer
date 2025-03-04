import React, { useState, useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native';
import { Icon } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { LightStatusBar, NormalHeader} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { UserGraph } from '../../layouts/graphs';
import { getUserAddresses } from '../../axios';
import NomalLoading from '../../components/animations/NomalLoading';

const AddressScreen = (props) => {
  const navigation = props.navigation;
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showList, setShowList] = useState(false);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      setShowList(false);
      const response = await getUserAddresses();
      setAddresses(response);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setShowList(true);
      }, 2000);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAddresses();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalHeader title="Địa chỉ đã lưu" onLeftPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <Card icon="plus-circle" title="Thêm địa chỉ" onPress={() => navigation.navigate(UserGraph.NewAddressScreen, { address: null })} />
        </View>
     

      <View style={{ height: '60%', margin: 16 }}>
        {showList ? (
          <FlatList
            data={addresses}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CardLocation
                address={item}
                onEdit={() => navigation.navigate(UserGraph.NewAddressScreen, { address: item })}
              />
            )}
          />
        ) : null}
      </View>

      {/* Sử dụng LoadingOverlay */}
      <NomalLoading visible={isLoading} />
    </SafeAreaView>
  );
};

const Card = ({ icon, title, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Icon source={icon} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
    <Text style={styles.cardText}>{title}</Text>
  </Pressable>
);

const CardLocation = ({ address, onEdit }) => (
  <Pressable style={styles.cardLocation} onPress={onEdit}>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flexDirection: 'row', gap: 16, flex: 2, alignItems: 'center' }}>
        <Icon source={"map-marker"} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{address.specificAddress}</Text>
          <Text style={styles.location}>
            {address.specificAddress}, {address.ward}, {address.district}, {address.province}
          </Text>
          <Text style={styles.distance}>{address.consigneePhone} {address.consigneeName}</Text>
        </View>
      </View>
    </View>
  </Pressable>
);


export default AddressScreen

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
  cardLocation: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 8,
  },
  location: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    textAlign: 'justify',
    lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    width: "65%"
  },
  distance: {
    color: colors.gray700,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Chiếm toàn bộ màn hình
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Làm mờ nền
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 150,
    height: 150,
  },
})
