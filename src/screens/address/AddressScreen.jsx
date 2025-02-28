import React, { useState, useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import { Icon } from 'react-native-paper';
import { LightStatusBar, NormalHeader, DialogNotification } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { UserGraph } from '../../layouts/graphs';
import { getUserAddresses, deleteAddress} from '../../axios';


const AddressScreen = (props) => {
  const navigation = props.navigation;
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await getUserAddresses();
      setAddresses(response);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDeletePress = (addressId) => {
    setSelectedAddressId(addressId);
    setIsDialogVisible(true);
  };

  const handleDeleteAddress = async () => {
    if (!selectedAddressId) return;
    try {
      setIsLoading(true);
      const response = await deleteAddress(selectedAddressId)
      if (response?.acknowledged && response?.deletedCount > 0) {
        setAddresses(prevAddresses => prevAddresses.filter(addr => addr._id !== selectedAddressId));
      } else {
        console.warn("Không thể xóa địa chỉ. Phản hồi API không hợp lệ:", response);
      }
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error.response?.data || error.message);
    } finally {
      setIsDialogVisible(false);
      setSelectedAddressId(null);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalHeader title="Địa chỉ đã lưu" onLeftPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <Card icon="plus-circle" title="Thêm địa chỉ" onPress={() => navigation.navigate(UserGraph.NewAddressScreen)} />
      </View>
      <View style={{ height: '60%', margin: 16 }}>
          <FlatList
            data={addresses}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CardLocation
                address={item}
                isOn={selectedAddressId === item._id} // Chỉ bật nếu là địa chỉ đang được chọn
                onEdit={() => navigation.navigate(UserGraph.NewAddressScreen, { address: item })}
                onDelete={() => handleDeletePress(item._id)}
                setIsOn={(newState) => handleToggle(item._id, newState)}
              />
            )}
          />
      </View>

      {/* Dialog Notification */}
      <DialogNotification
        isVisible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        title="Xác nhận xóa"
        textContent="Bạn có chắc chắn muốn xóa địa chỉ này?"
        textHide="Hủy"
        textConfirm="Xóa"
        onConfirm={handleDeleteAddress}
      />
    </SafeAreaView>
  );
};

const Card = ({ icon, title, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Icon source={icon} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.green500} />
    <Text style={styles.cardText}>{title}</Text>
  </Pressable>
);

const CardLocation = ({ address, onEdit, onDelete, isOn, setIsOn }) => (
  <Pressable style={styles.cardLocation} onPress={() => console.log('Clicked on', address.specificAddress)}>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flexDirection: 'row', gap: 16, flex: 2, alignItems: 'center' }}>
        <Icon source={"map-marker"} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.green500} />
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{address.specificAddress}</Text>
          <Text style={styles.location}>
            {address.specificAddress}, {address.ward}, {address.district}, {address.province}
          </Text>
          <Text style={styles.distance}>{address.consigneePhone} {address.consigneeName}</Text>
        </View>
      </View>
      <View style={{ gap: 16 , alignItems: 'center'}}>
        <Pressable onPress={onEdit}>
          <Icon source={"book-edit"} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.green500} />
        </Pressable>
        <Pressable onPress={onDelete}>
          <Icon source={"delete"} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.red800} />
        </Pressable>
      </View>
    </View >
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
    width: '68%'
  },
  distance: {
    color: colors.gray700,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
})
