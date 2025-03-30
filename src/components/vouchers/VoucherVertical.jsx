import React, {useEffect, useState} from 'react';
import {
  Text,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import {getAllVoucher} from '../../axios/index';
import {Column, NormalText} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {useAppContext} from '../../context/appContext';
import {VoucherGraph} from '../../layouts/graphs';
import {AppAsyncStorage, CartManager, TextFormatter} from '../../utils';

const {width} = Dimensions.get('window');

const VoucherVertical = ({navigation, route}) => {
  const [vouchers, setVouchers] = useState([]);
  const {cartDispatch} = useAppContext();
  const {isUpdateOrderInfo} = route.params || false;

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        if (await AppAsyncStorage.isTokenValid()) {
          const response = await getAllVoucher();
          setVouchers(response);
        }
      } catch (error) {
        console.log('Lỗi khi gọi API Voucher:', error);
      }
    };

    fetchVouchers();
  }, []);

  const onItemPress = item => {
    if (isUpdateOrderInfo) {
      console.log('item Vouher = ', item);
      if (cartDispatch) {
        CartManager.updateOrderInfo(cartDispatch, {
          voucher: item._id,
          voucherInfo: item,
        });
      }

      navigation.goBack();
    } else {
      navigation.navigate(VoucherGraph.VoucherDetailSheet, {item});
    }
  };

  return (
    <Column style={styles.container}>
      <FlatList
        data={vouchers}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => (
          <ItemVoucher onPress={() => onItemPress(item)} item={item} />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{gap: 16}}
      />
    </Column>
  );
};

const ItemVoucher = ({onPress, item}) => {
  return (
    <TouchableOpacity style={styles.itemVoucher} onPress={onPress}>
      <Image source={{uri: item.image}} style={styles.itemImage} />
      <Column>
        <View style={{maxWidth: width / 2}}>
          <Text numberOfLines={2} style={{fontSize: 16, fontWeight: 'bold'}}>
            {`${item.name}`}
          </Text>
        </View>

        <NormalText
          text={`Hết hạn ${TextFormatter.formatDateSimple(item.endDate)}`}
        />
      </Column>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },

  itemVoucher: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    resizeMode: 'cover',
  },
  itemImage: {
    width: width / 4.5,
    height: width / 4.5,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    resizeMode: 'cover',
  },
});

export default VoucherVertical;
