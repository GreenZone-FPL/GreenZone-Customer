import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import { NormalHeader, LightStatusBar, NormalText, PrimaryButton, DualTextRow } from '../../components';

const { height, width } = Dimensions.get('window');

const NotificationScreen = (props) => {
  const navigation = props.navigation;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true); 
  };

  const closeModal = () => {
    setSelectedItem(null); 
    setModalVisible(false); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Thông báo"
        rightIcon="check-all"
        enableRightIcon={true}
        onLeftPress={() => navigation.goBack()}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            item={item}
            handleItemPress={handleItemPress}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />

      {selectedItem && (
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedItem.image }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedItem.title}</Text>
              <NormalText text={selectedItem.message}/>
              <PrimaryButton title="Đã xem" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const Card = ({ item, handleItemPress }) => {
  return (
    <TouchableOpacity
      onPress={() => handleItemPress(item)}
      style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <DualTextRow leftText={item.title} rightText={item.date} leftTextStyle={styles.title} />
        <NormalText text={item.message} />
      </View>
    </TouchableOpacity>
  );
};

const data = [
  {
    id: '1',
    title: 'Chào bạn mới',
    date: '14/1',
    message: 'Lần đầu đến với GreenZone, mong bạn có thật nhiều niềm vui nhé!',
    image: 'https://retaildesignblog.net/wp-content/uploads/2018/04/The-Coffee-House-Signature-by-BODC-Ho-Chi-Minh-City-Vietnam-720x480.jpg',
  },
  {
    id: '2',
    title: 'Ưu đãi khi sử dụng voucher',
    date: '16/1',
    message: 'Voucher Greenzone, Mã Giảm Giá The Coffee House 2025',
    image: 'https://voucherbox.vn/wp-content/uploads/2023/07/Voucher-The-Coffee-House-Mua-1-Tang-1-1.jpg',
  },
];

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  listContainer: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  image: {
    width: width / 8,
    height: width / 8,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
  },
  date: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray850,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  modalImage: {
    width: '100%',
    height: height / 4,
    resizeMode: 'cover',
  },
  modalTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
  },
});
