import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getAllVoucher, getMyVouchers } from '../../axios/index';
import {
  Column,
  LightStatusBar,
  NormalHeader,
  NormalText,
  Row,
  TitleText,
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import { VoucherGraph } from '../../layouts/graphs';
import { CartActionTypes } from '../../reducers';
import { TextFormatter } from '../../utils';

const { width } = Dimensions.get('window');

const SelectVouchersScreen = ({ navigation, route }) => {
  const [storeVouchers, setStoreVouchers] = useState([]);
  const [myExchangedVouchers, setMyExchangedVouchers] = useState([]);
  const [validStoreVouchers, setValidStoreVouchers] = useState([]);
  const [validMyVouchers, setValidMyVouchers] = useState([]);

  const { cartDispatch } = useAppContext();
  const { isUpdateOrderInfo } = route.params || false;

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const storeResponse = await getAllVoucher();
        const myResponse = await getMyVouchers();

        if (storeResponse) {
          setStoreVouchers(storeResponse);
        }

        if (myResponse) {
          const uniqueVouchers = Object.values(
            myResponse.reduce((acc, item) => {
              if (item?.voucher) {
                acc[item.voucher._id] = item.voucher;
              }
              return acc;
            }, {}),
          );
          setMyExchangedVouchers(uniqueVouchers);
        }
      } catch (error) {
        console.log('Lỗi khi gọi API Voucher:', error);
      }
    };

    fetchVouchers();
  }, []);

  // Lọc các voucher cửa hàng còn hiệu lực
  const filterValidVouchers = voucherList => {
    const now = new Date();
    return voucherList.filter(voucher => {
      const start = new Date(voucher.startDate);
      const end = new Date(voucher.endDate);
      return start <= now && end >= now;
    });
  };
  useEffect(() => {
    const valid = filterValidVouchers(storeVouchers);
    setValidStoreVouchers(valid);
  }, [storeVouchers]);

  useEffect(() => {
    const valid = filterValidVouchers(myExchangedVouchers);
    setValidMyVouchers(valid);
  }, [myExchangedVouchers]);

  const filterByDiscountType = type => {
    const discountMap = {
      1: 'global',
      2: 'seed',
    };

    const voucherType = discountMap[type];
    if (!voucherType) {
      console.warn('Loại discountType không hợp lệ!');
      return [];
    }

    return validStoreVouchers.filter(
      voucher => voucher.voucherType === voucherType,
    );
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
    } else {
      navigation.navigate(VoucherGraph.VoucherDetailSheet, { item });
    }
  };

  return (
    <Column style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Chọn phiếu ưu đãi"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView>
        {myExchangedVouchers.length > 0 && (
          <>
            <TitleText text="Phiếu ưu đãi của tôi" style={styles.title} />
            <FlatList
              data={myExchangedVouchers}
              // data={validMyVouchers}
              keyExtractor={item => item._id.toString()}
              renderItem={({ item }) => (
                <ItemVoucher onPress={() => onItemPress(item)} item={item} />
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </>
        )}

        {validStoreVouchers.length > 0 && (
          <>
            <TitleText text="Phiếu ưu đãi cửa hàng" style={styles.title} />
            <FlatList
              data={filterByDiscountType(1)}
              keyExtractor={item => item._id.toString()}
              renderItem={({ item }) => (
                <ItemVoucher onPress={() => onItemPress(item)} item={item} />
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 5, backgroundColor: colors.fbBg }}
            />
          </>
        )}
      </ScrollView>
    </Column>
  );
};

const ItemVoucher = ({ onPress, item }) => {
  return (
    <TouchableOpacity style={styles.itemVoucher} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Column>
        <View style={{ maxWidth: width / 2 }}>
          <Text numberOfLines={2} style={styles.voucherName}>
            {`Voucher ${item.name}`}
          </Text>
        </View>


        <Row>
          <NormalText text={`Hết hạn:`} style={{ color: colors.gray850 }} />

          <NormalText
            style={{ color: colors.black }}
            text={`${TextFormatter.formatDateSimple(item.endDate)}`}
          />

        </Row>

      </Column>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    marginHorizontal: 16,
    marginVertical: 8,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '600',
  },
  itemVoucher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    gap: 16,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  itemImage: {
    width: width / 4.5,
    height: width / 4.5,
    borderRadius: width / 1.5,
    resizeMode: 'cover',
  },
  voucherName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SelectVouchersScreen;
