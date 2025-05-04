import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getMyVouchers} from '../../axios';
import {
  Column,
  LightStatusBar,
  NormalHeader,
  NormalLoading,
  VoucherVertical,
} from '../../components';
import {GLOBAL_KEYS, colors} from '../../constants';

const MyVouchersScreen = ({navigation}) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMyVochers = async () => {
      try {
        setLoading(true);
        const response = await getMyVouchers();
        if (response) {
          const allVouchers = response
            .filter(item => item?.voucher)
            .map(item => ({
              ...item.voucher,
              exchangedAt: item.exchangedAt,
            }));

          setVouchers(allVouchers);
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
    <Column style={styles.container}>
      <LightStatusBar />
      {loading && <NormalLoading visible={loading} />}

      <NormalHeader
        title="Phiếu ưu đãi của tôi"
        onLeftPress={() => {
          navigation.goBack();
        }}
      />

      {vouchers.length > 0 && (
        <VoucherVertical
          loading={loading}
          vouchers={vouchers}
          route={{params: {isUpdateOrderInfo: false, isChangeBeans: false}}}
          type={0}
        />
      )}
      {!loading && vouchers.length === 0 && (
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            textAlignVertical: 'center',
            margin: 16,
            fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
            lineHeight: 20,
          }}>
          Bạn chưa đổi phiếu giảm giá nào. Hãy đổi phiếu giảm giá ở mục Đổi Seed
          nhé!
        </Text>
      )}
    </Column>
  );
};

export default MyVouchersScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    backgroundColor: colors.white,
  },
});
