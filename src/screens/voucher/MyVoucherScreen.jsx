import React, { useEffect, useState } from 'react';
import {
  Text,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { getAllVoucher } from '../../axios/index';
import {
  Column,
  LightStatusBar,
  NormalHeader,
  NormalText,
  TitleText,
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { VoucherGraph } from '../../layouts/graphs';
import { CartManager, TextFormatter } from '../../utils';
import { CartActionTypes } from '../../reducers';

const { width } = Dimensions.get('window');

const MyVoucherScreen = ({ navigation, route }) => {
  const [vouchers, setVouchers] = useState([]);
  const { cartDispatch } = useAppContext();
  const { isUpdateOrderInfo } = route.params || false;

  const filterByDiscountType = type => {
    const discountTypeMap = {
      1: 'percentage',
      2: 'fixedAmount',
    };

    const discountType = discountTypeMap[type];

    if (!discountType) {
      console.warn('Loại discountType không hợp lệ!');
      return [];
    }

    const filtered = vouchers.filter(
      voucher => voucher.discountType === discountType,
    );
    return filtered;
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await getAllVoucher();
        setVouchers(response);
      } catch (error) {
        console.log('Lỗi khi gọi API Voucher:', error);
      }
    };

    fetchVouchers();
  }, []);

  const onItemPress = item => {
    if (isUpdateOrderInfo) {
      console.log('item Vouher = ', item);
     
      cartDispatch({
        type: CartActionTypes.UPDATE_ORDER_INFO,
        payload: {
          voucher: item._id,
          voucherInfo: item,
        }
      })

      navigation.goBack();
    } else {
      navigation.navigate(VoucherGraph.VoucherDetailSheet, { item });
    }
  };

  return (
    <Column style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Phiếu ưu đãi của tôi"
        onLeftPress={() => navigation.goBack()}
      />

      {vouchers.length > 0 && (
        <TitleText text="Voucher khả dụng" style={{ marginHorizontal: 16 }} />
      )}

      <FlatList
        data={filterByDiscountType(1)}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <ItemVoucher onPress={() => onItemPress(item)} item={item} />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      />
    </Column>
  );
};

const ItemVoucher = ({ onPress, item }) => {
  return (
    <TouchableOpacity style={styles.itemVoucher} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Column>
        <View style={{ maxWidth: width / 2 }}>
          <Text numberOfLines={2} style={{ fontSize: 16, fontWeight: 'bold' }}>
            {`Voucher ${item.name}`}
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
    backgroundColor: colors.fbBg,
    gap: 16,
  },

  itemVoucher: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    gap: 16,
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
});

export default MyVoucherScreen;
