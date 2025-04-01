import React, { useState, useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, FlatList, Alert, Dimensions } from 'react-native';
import { Icon } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { LightStatusBar, NormalHeader, ActionDialog } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { UserGraph } from '../../layouts/graphs';
import { getUserAddresses, deleteAddress } from '../../axios';
import NormalLoading from '../../components/animations/NormalLoading';
import { Swipeable } from 'react-native-gesture-handler';


const AddressScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await getUserAddresses();
      setAddresses(response);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const handleDelete = async () => {
    if (!selectedAddress) return;
    try {
      await deleteAddress(selectedAddress._id);
      setAddresses((prev) => prev.filter((addr) => addr._id !== selectedAddress._id));
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalHeader title="Địa chỉ đã lưu" onLeftPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <Card icon="plus-circle" title="Thêm địa chỉ" onPress={() => navigation.navigate(UserGraph.NewAddressScreen, { address: null })} />
      </View>
      <View style={{ margin: 16 }}>
        {isLoading ? (

          <NormalLoading visible={isLoading} />


        ) : (
          <FlatList
            data={addresses}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CardLocation
                address={item}
                // onEdit={() => navigation.navigate(UserGraph.NewAddressScreen, { address: item })}
                onDelete={() => {
                  setSelectedAddress(item);
                  setShowDeleteDialog(true);
                }}
              />
            )}
          />
        )}
      </View>



      {/* Dialog xác nhận xóa */}
      <ActionDialog
        visible={showDeleteDialog}
        title="Xác nhận xóa"
        content="Bạn có chắc muốn xóa địa chỉ này không?"
        onCancel={() => setShowDeleteDialog(false)}
        onApprove={handleDelete}
        cancelText="Hủy"
        approveText="Xóa"
      />
    </SafeAreaView>
  );
};

const Card = ({ icon, title, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Icon source={icon} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
    <Text style={styles.cardText}>{title}</Text>
  </Pressable>
);

const CardLocation = ({ address, onEdit, onDelete }) => {
  const renderRightActions = () => (
    <Pressable style={styles.deleteButton} onPress={onDelete}>
      <Text style={styles.deleteText}>Xóa</Text>
    </Pressable>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable style={styles.cardLocation} onPress={onEdit}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', gap: 16, flex: 2, alignItems: 'center' }}>
            <Icon source={'map-marker'} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16, width: '50%' }}>{address.specificAddress}</Text>
              <Text style={styles.location}>
                {address.specificAddress}, {address.ward}, {address.district}, {address.province}
              </Text>
              <Text style={styles.distance}>{address.consigneePhone} {address.consigneeName}</Text>
            </View>
          </View>
          <Pressable style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon source={'chevron-double-left'} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.gray200} />
          </Pressable>
        </View>
      </Pressable>
    </Swipeable>
  );
};


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
    width: "58%"
  },
  distance: {
    color: colors.gray700,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  deleteButton: {
    backgroundColor: colors.red800,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 8,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    margin: 16,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
  },
})
