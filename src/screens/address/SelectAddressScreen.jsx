import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { LightStatusBar, NormalHeader, NormalLoading } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { getAddresses } from '../../axios';
import { UserGraph } from '../../layouts/graphs';
import { useAppContext } from '../../context/appContext';
import { CartManager } from '../../utils';

const SelectAddressScreen = ({ navigation, route }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { isUpdateOrderInfo } = route.params || false
   const [loading, setLoading] = useState(false);
  const { cartDispatch } = useAppContext()

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true)
        const response = await getAddresses();
        console.log('Dữ liệu API:', response);
        setAddresses(response || []);
      } catch (error) {
        console.error('Lỗi lấy địa chỉ:', error);
      }finally{
        setLoading(false)
      }
    };
    fetchAddress();
  }, []);


  const onConfirmAddress = address => {
    if (isUpdateOrderInfo) {
      console.log('selectedAddress', address)
      if (cartDispatch) {
        CartManager.updateOrderInfo(cartDispatch,
          {
            shippingAddress: address._id,
            shippingAddressInfo: {
              ...address,
              location: `${address.specificAddress}, ${address.ward}, ${address.district}, ${address.province}`
            }
          }
        )
      }
      navigation.goBack()
    } else {
      console.log('selectedAddress', address)
    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
       <NormalLoading visible={loading} />
      <NormalHeader
        title="Chọn địa chỉ"
        onLeftPress={() => navigation.goBack()}
        rightIcon="magnify"
        enableRightIcon={true}
      />

      <ScrollView style={styles.content}>
        {addresses.length > 0 ? (
          addresses.map(address => (
            <Card
              address={address}
              key={address._id}
              isSelected={selectedAddress === address}
              onPress={() => setSelectedAddress(address)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Không có địa chỉ nào</Text>
        )}
      </ScrollView>

      {/* Nút Xác nhận */}
      {selectedAddress && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => onConfirmAddress(selectedAddress)}>
          <Text style={styles.confirmText}>Xác nhận</Text>
        </TouchableOpacity>
      )}

      {/* Nút Thêm ở góc dưới bên trái */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(UserGraph.AddressScreen)}>
        <Icon source="plus" size={30} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Card = ({ address, isSelected, onPress }) => (
  <Pressable
    style={[styles.card, isSelected && styles.selectedCard]}
    onPress={() => onPress(address)}>
    <Icon
      source="google-maps"
      size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
      color={colors.primary}
    />
    <View style={styles.textContainer}>
      <Text style={styles.location}>Người nhận: {address.consigneeName}</Text>
      <Text style={styles.location}>SĐT: {address.consigneePhone}</Text>
      <Text style={styles.location}>
        Địa chỉ: {`${address.specificAddress}, ${address.ward}, ${address.district}, ${address.province}`}
      </Text>
    </View>
  </Pressable>
);

export default SelectAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: GLOBAL_KEYS.GAP_DEFAULT,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
    gap: 12
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  location: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    textAlign: 'justify',
    lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
  },
  textContainer: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    marginTop: 20,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: 8,
    width: '90%',
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmText: {
    color: colors.white,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    bottom: 100,
    right: 16,
  },
});
