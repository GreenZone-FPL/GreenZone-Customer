import React, {useEffect, useState} from 'react';
import {
  Text,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {getAllVoucher, getMyVouchers} from '../../axios/index';
import {
  Column,
  LightStatusBar,
  NormalHeader,
  NormalText,
  TitleText,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {useAppContext} from '../../context/appContext';
import {VoucherGraph} from '../../layouts/graphs';
import {CartManager, TextFormatter} from '../../utils';
import {CartActionTypes} from '../../reducers';
import {black} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const {width} = Dimensions.get('window');

const VouchersMerchantScreen = ({navigation, route}) => {
  const [storeVouchers, setStoreVouchers] = useState([]);
  const [myExchangedVouchers, setMyExchangedVouchers] = useState([]);
  const [validStoreVouchers, setValidStoreVouchers] = useState([]);
  const [validMyVouchers, setValidMyVouchers] = useState([]);

  const {cartDispatch} = useAppContext();
  const {isUpdateOrderInfo} = route.params || false;

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const storeResponse = await getAllVoucher();
        const myResponse = await getMyVouchers();

        if (storeResponse) {
          setStoreVouchers(storeResponse);
        }

        if (myResponse) {
          const exchanged = myResponse.map(item => item.voucher);

          // Lọc các voucher không trùng ID
          const uniqueVouchers = Object.values(
            exchanged.reduce((acc, voucher) => {
              acc[voucher._id] = voucher;
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
      1: 'percentage',
      2: 'fixedAmount',
    };

    const discountType = discountMap[type];
    if (!discountType) {
      console.warn('Loại discountType không hợp lệ!');
      return [];
    }

    return validStoreVouchers.filter(
      voucher => voucher.discountType === discountType,
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
      navigation.navigate(VoucherGraph.VoucherDetailSheet, {item});
    }
  };

  return (
    <Column style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Phiếu ưu đãi của tôi"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView>
        {myExchangedVouchers.length > 0 && (
          <>
            <TitleText text="Voucher đổi Bean" style={styles.title} />
            <FlatList
              data={myExchangedVouchers}
              // data={validMyVouchers}
              keyExtractor={item => item._id.toString()}
              renderItem={({item}) => (
                <ItemVoucher onPress={() => onItemPress(item)} item={item} />
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </>
        )}

        {validStoreVouchers.length > 0 && (
          <>
            <TitleText text="Voucher cửa hàng" style={styles.title} />
            <FlatList
              data={filterByDiscountType(1)}
              keyExtractor={item => item._id.toString()}
              renderItem={({item}) => (
                <ItemVoucher onPress={() => onItemPress(item)} item={item} />
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </>
        )}
      </ScrollView>
    </Column>
  );
};

const ItemVoucher = ({onPress, item}) => {
  return (
    <TouchableOpacity style={styles.itemVoucher} onPress={onPress}>
      <Image source={{uri: item.image}} style={styles.itemImage} />
      <Column>
        <View style={{maxWidth: width / 2}}>
          <Text numberOfLines={2} style={styles.voucherName}>
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
  },
  title: {
    margin: 16,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '600',
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
  voucherName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VouchersMerchantScreen;
