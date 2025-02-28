import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import {LightStatusBar, NormalHeader} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {getAllVoucher} from '../../axios/index';
import {CartManager, TextFormatter} from '../../utils';
import {useAppContext} from '../../context/appContext';

const {width} = Dimensions.get('window');

const MyVoucherScreen = ({navigation}) => {
  const [vouchers, setVouchers] = useState([]);
  const {cartDispatch} = useAppContext();

  const fetchVouchers = async () => {
    try {
      const response = await getAllVoucher();
      setVouchers(response);
    } catch (error) {
      console.log('Lỗi khi gọi API Voucher:', error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Phiếu ưu đãi của tôi"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bodyContainer}>
          {vouchers.length > 0 && (
            <Text style={styles.bodyHeader}>Voucher khả dụng</Text>
          )}
          <FlatList
            data={vouchers}
            keyExtractor={item => item._id.toString()}
            renderItem={({item}) => (
              <ItemVoucher
                goBack={() => navigation.goBack()}
                cartDispatch={cartDispatch}
                item={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const ItemVoucher = ({item, cartDispatch, goBack}) => {
  return (
    <Pressable
      style={styles.itemVoucher}
      onPress={() => {
        if (cartDispatch) {
          CartManager.updateOrderInfo(cartDispatch, {voucher: item._id});
        }
        goBack();
      }}>
      <Image source={{uri: item.image}} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>Voucher {item.name}</Text>
        <Text style={styles.itemTime}>
          Hết hạn {TextFormatter.formatDateSimple(item.endDate)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  bodyHeader: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
    color: colors.black,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  itemVoucher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  itemImage: {
    width: width / 4.5,
    height: width / 4.5,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    resizeMode: 'cover',
  },
  itemDetails: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  itemTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '600',
    color: colors.black,
  },
  itemTime: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '400',
  },
});

export default MyVoucherScreen;
