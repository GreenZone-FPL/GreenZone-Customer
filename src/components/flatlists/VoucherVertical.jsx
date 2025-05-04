import {useNavigation} from '@react-navigation/native';
import moment from 'moment/moment';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {changeBeans} from '../../axios';
import {colors} from '../../constants';
import {useCartContext} from '../../context';
import {VoucherGraph} from '../../layouts/graphs';
import {CartActionTypes} from '../../reducers';
import {VoucherVerticalSkeleton} from '../../skeletons';
import {Toaster} from '../../utils';
import {Column, NormalText, Row, SeedText, TitleText} from '../index';

const {width} = Dimensions.get('window');

export const VoucherVertical = ({
  loading = false,
  route,
  vouchers,
  type,
  setChangePoint = false,
}) => {
  const navigation = useNavigation();
  const {cartDispatch} = useCartContext();
  const {isUpdateOrderInfo} = route.params || false;
  const {isChangeBeans} = route.params || false;
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
      'Xác nhận',
      `Bạn có chắc muốn đổi ${item.requiredPoints} Seed lấy mã giảm giá "${item.name}" không?`,
      [
        {
          text: 'Đóng',
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
      {cancelable: false},
    );
  };

  const filterByDiscountType = type => {
    const discountTypeMap = {
      1: 'global',
      2: 'seed',
    };

    const voucherType = discountTypeMap[type];

    if (!voucherType) {
      return validVouchers;
    }

    const filtered = validVouchers.filter(
      voucher => voucher.voucherType === voucherType,
    );
    return filtered;
  };

  const onItemPress = item => {
    if (isUpdateOrderInfo) {
      cartDispatch({
        type: CartActionTypes.UPDATE_ORDER_INFO,
        payload: {
          voucher: item._id,
          voucherInfo: item,
        },
      });

      navigation.goBack();
    } else if (isChangeBeans) {
      changeBean(item);
    } else {
      navigation.navigate(VoucherGraph.VoucherDetailSheet, {item});
    }
  };
  if (loading) {
    return <VoucherVerticalSkeleton />;
  }

  return (
    <Column style={styles.container}>
      <TitleText
        text="Phiếu ưu đãi"
        style={{marginHorizontal: 16, fontSize: 16}}
      />
      <FlatList
        data={filterByDiscountType(type)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <ItemVoucher
            onPress={() => onItemPress(item)}
            item={item}
            loading={loading}
            isChangeBeans={isChangeBeans}
          />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{gap: 2, backgroundColor: colors.fbBg}}
      />
    </Column>
  );
};

const ItemVoucher = ({onPress, item, isChangeBeans}) => {
  return (
    <Pressable style={styles.itemVoucher} onPress={onPress}>
      <Image
        source={{uri: item.image}}
        style={
          item?.voucherType === 'seed' ? styles.itemImageSeed : styles.itemImage
        }
      />
      <Column style={{flex: 1}}>
        {/* Tên voucher: màu đậm, dễ đọc */}
        <Text
          numberOfLines={2}
          style={{fontSize: 14, fontWeight: '600', color: colors.black}}>
          {item.name}
        </Text>

        {item?.voucherType === 'seed' && (
          <SeedText point={item?.requiredPoints} />
        )}

        {item.voucherType === 'seed' && !isChangeBeans ? (
          <Row>
            <NormalText text={`Ngày đổi:`} />

            <NormalText
              style={{color: colors.orange700}}
              text={`${
                item.endDate
                  ? moment(item.exchangedAt)
                      .utcOffset(7)
                      .format('HH:mm - DD/MM/YYYY')
                  : 'Chưa có thời gian'
              }`}
            />
          </Row>
        ) : (
          <Row>
            <NormalText text={`Hết hạn:`} />

            <NormalText
              style={{color: colors.orange700}}
              text={`${
                item.endDate
                  ? moment(item.endDate)
                      .utcOffset(7)
                      .format('HH:mm - DD/MM/YYYY')
                  : 'Chưa có thời gian'
              }`}
            />
          </Row>
        )}
      </Column>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    backgroundColor: colors.white,
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
    width: width / 5.5,
    height: width / 5.5,
    borderRadius: width / 1.5,
    resizeMode: 'cover',
  },
  itemImageSeed: {
    width: width / 2.5,
    height: width / 5,
    resizeMode: 'cover',
  },
});
