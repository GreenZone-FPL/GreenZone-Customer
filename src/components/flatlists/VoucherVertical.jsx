import React, { useEffect, useState } from 'react';
import moment from 'moment/moment';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Column, NormalText, Row, TitleText } from '../index';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { VoucherGraph } from '../../layouts/graphs';
import { CartManager, TextFormatter, Toaster } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import { changeBeans } from '../../axios';

const { width } = Dimensions.get('window');

export const VoucherVertical = ({
  route,
  vouchers,
  type,
  setChangePoint = false,
}) => {
  const navigation = useNavigation();
  const { cartDispatch } = useAppContext();
  const { isUpdateOrderInfo } = route.params || false;
  const { isChangeBeans } = route.params || false;
  const [validVouchers, setValidVouchers] = useState([]);
  // PERCENTAGE = 'percentage',
  // FIXED_AMOUNT = 'fixedAmount',

  // check voucher
  useEffect(() => {
    const checkVoucher = () => {
      const now = new Date();

      const isVouchers = vouchers.filter(voucher => {
        const start = new Date(voucher.startDate);
        const end = new Date(voucher.endDate);

        return start <= now && end >= now;
      });

      return setValidVouchers(isVouchers);
    };

    checkVoucher();
  }, [vouchers]);

  const changeBean = async item => {
    // Hiển thị alert xác nhận
    Alert.alert(
      'Xác nhận đổi Bean',
      `Bạn có chắc muốn đổi "${item.requiredPoints}" Bean lấy mã giảm giá "${item.name}" không?`,
      [
        {
          text: 'Hủy',
          onPress: () => console.log('Hành động hủy bỏ'),
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: async () => {
            try {
              const response = await changeBeans(item._id);
              if (response) {
                Toaster.show('Đổi thành công mã giảm giá');
                setChangePoint(prev => !prev);
              } else {
                Toaster.show('Bạn không đủ Bean');
              }
            } catch (error) {
              console.error('Lỗi khi đổi bean:', error);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const filterByDiscountType = type => {
    const discountTypeMap = {
      1: 'percentage',
      2: 'fixedAmount',
    };

    const discountType = discountTypeMap[type];

    if (!discountType) {
      return validVouchers;
    }

    const filtered = validVouchers.filter(
      voucher => voucher.discountType === discountType,
    );
    return filtered;
  };

  const onItemPress = item => {
    if (isUpdateOrderInfo) {
      // console.log('item Vouher = ', item);
      if (cartDispatch) {
        CartManager.updateOrderInfo(cartDispatch, {
          voucher: item._id,
          voucherInfo: item,
        });
      }

      navigation.goBack();
    } else if (isChangeBeans) {
      changeBean(item);
    } else {
      navigation.navigate(VoucherGraph.VoucherDetailSheet, { item });
    }
  };

  return (
    <Column style={styles.container}>
      <TitleText text="Phiếu ưu đãi" style={{ marginHorizontal: 16, fontSize: 16 }} />
      <FlatList
        data={filterByDiscountType(type)}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <ItemVoucher onPress={() => onItemPress(item)} item={item} />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ gap: 2, backgroundColor: colors.fbBg }}
      />
    </Column>
  );
};

const ItemVoucher = ({ onPress, item }) => {
  return (
    <TouchableOpacity style={styles.itemVoucher} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Column>
        {/* Tên voucher: màu đậm, dễ đọc */}
        <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>
          {item.name}
        </Text>

        {/* Điểm Bean: màu nổi bật nhẹ nếu có */}
        {item?.voucherType === 'seed' && (
          <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '500' }}>
            {item.requiredPoints} Bean
          </Text>
        )}


        <Row>
          <NormalText text={`Hết hạn:`} style={{color: colors.gray850}}/>

          <NormalText
            style={{
              color: moment(item.endDate).isBefore(moment())
                ? colors.invalid
                : colors.black,
            }}
            text={`${item.endDate
                ? moment(item.endDate).utcOffset(7).format('HH:mm - DD/MM/YYYY')
                : 'Chưa có thời gian'
              }`}
          />

        </Row>

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
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
  },
  itemImage: {
    width: width / 4.5,
    height: width / 4.5,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    resizeMode: 'cover',
  },
});
