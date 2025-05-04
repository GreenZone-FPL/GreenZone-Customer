import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {getAllVoucher, getMyVouchers} from '../../axios/index';
import {
  Column,
  LightStatusBar,
  NormalHeader,
  NormalText,
  Row,
  TitleText,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {useAppContext} from '../../context/appContext';
import {VoucherGraph} from '../../layouts/graphs';
import {CartActionTypes} from '../../reducers';
import {TextFormatter} from '../../utils';
import { useCartContext } from '../../context';
import { Icon } from 'react-native-paper';
import moment from 'moment';

const {width} = Dimensions.get('window');

const SelectVouchersScreen = ({navigation, route}) => {
  const [storeVouchers, setStoreVouchers] = useState([]);
  const [myExchangedVouchers, setMyExchangedVouchers] = useState([]);
  const [validStoreVouchers, setValidStoreVouchers] = useState([]);
  const [validMyVouchers, setValidMyVouchers] = useState([]);

  const {cartDispatch} = useCartContext();
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
          const uniqueVouchers: any = myResponse
            .filter((item: any) => item?.voucher)
            .map((item: any) => ({
              ...item.voucher,
              exchangedAt: item.exchangedAt
            }));
        
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
      (voucher: any) => voucher.voucherType === voucherType,
    );
  };

  const onItemPress = (item: any) => {

    
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
              keyExtractor={(_,index:number) => index.toString()}
              renderItem={({item}) => (
                <ItemVoucher onPress={() => onItemPress(item)} item={item} />
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={{gap: 5, backgroundColor: colors.fbBg}}
            />
          </>
        )}

        {validStoreVouchers.length > 0 && (
          <>
            <TitleText text="Phiếu ưu đãi GreenZone" style={styles.title} />
            <FlatList
              data={filterByDiscountType(1)}
              keyExtractor={(item: any) => item._id.toString()}
              renderItem={({item}) => (
                <ItemVoucher onPress={() => onItemPress(item)} item={item} />
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={{gap: 5, backgroundColor: colors.fbBg}}
            />
          </>
        )}
      </ScrollView>
    </Column>
  );
};

const ItemVoucher = ({onPress, item}) => {
  return (
    <Pressable style={styles.itemVoucher} onPress={onPress}>
      <View>
       
      <Image
        source={{uri: item.image}}
        style={
          item?.voucherType === 'seed' ? styles.itemImageSeed : styles.itemImage
        }
      />
      </View>
      <Column style={{flex:1}}>
        <View style={{maxWidth: width / 2}}>
          <Text numberOfLines={2} style={styles.voucherName}>
            {`${item.name}`}
          </Text>
        </View>

        {item.voucherType==="seed"? <Row>
          <NormalText text={`Ngày đổi:`} />

          <NormalText
            style={{color: colors.orange700}}
            text={`${
              item.endDate
                ? moment(item.exchangedAt).utcOffset(7).format('HH:mm - DD/MM/YYYY')
                : 'Chưa có thời gian'
            }`}
          />
        </Row>:
        <Row>
        <NormalText text={`Hết hạn:`} />

        <NormalText
          style={{color: colors.orange700}}
          text={`${
            item.endDate
              ? moment(item.endDate).utcOffset(7).format('HH:mm - DD/MM/YYYY')
              : 'Chưa có thời gian'
          }`}
        />
      </Row>}
      </Column>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fbBg,
  },
  title: {
    marginHorizontal: 16,
    marginVertical: 10,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
    color: colors.lemon,
  },
  itemVoucher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    gap: 16,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  itemImage: {
    width: width / 5,
    height: width / 5,
    borderRadius: width / 1.5,
    resizeMode: 'cover',
  },
  itemImageSeed: {
    width: width / 2.5,
    height: width / 5,
    resizeMode: 'cover',
  },
  voucherName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
    color: colors.black,
  },
});

export default SelectVouchersScreen;
