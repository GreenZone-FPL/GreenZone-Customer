import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getMyVouchers} from '../../axios';
import {
  LightStatusBar,
  NormalHeader,
  NormalLoading,
  VoucherVertical,
} from '../../components';
import {GLOBAL_KEYS} from '../../constants';

const MyVouchersScreen = ({navigation}) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMyVochers = async () => {
      try {
        setLoading(true);
        const response = await getMyVouchers();
        if (response) {
          const uniqueVouchers = Object.values(
            response.reduce((acc, item) => {
              if (item?.voucher) {
                acc[item.voucher._id] = item.voucher;
              }
              return acc;
            }, {}),
          );

          setVouchers(uniqueVouchers);
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    };
    getMyVochers();
  }, []);
  return (
    <View style={{flex: 1}}>
      <LightStatusBar />
      <NormalHeader
        title="Phiếu ưu đãi của tôi"
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{margin: GLOBAL_KEYS.PADDING_DEFAULT, flex: 1}}>
        {vouchers?.length > 0 ? (
          <VoucherVertical
            vouchers={vouchers}
            route={{params: {isUpdateOrderInfo: false, isChangeBeans: false}}}
            type={0}
          />
        ) : (
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              textAlignVertical: 'center',
              margin: 16,
              fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
            }}>
            Bạn chưa đổi phiếu giảm giá nào, hãy đổi phiếu giảm giá ở mục Đổi
            Seed nhé!
          </Text>
        )}
      </View>
      {loading && <NormalLoading visible={loading} />}
    </View>
  );
};

export default MyVouchersScreen;
