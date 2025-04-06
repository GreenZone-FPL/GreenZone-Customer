import {View, Text, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Column,
  LightStatusBar,
  NormalHeader,
  Row,
  VoucherVertical,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {useHomeContainer} from '../../containers';
import {getAllVoucher, getMyVouchers} from '../../axios';
import {AppAsyncStorage} from '../../utils';

const BeanScreen = ({navigation}) => {
  const {user} = useHomeContainer();
  const [vouchers, setVouchers] = useState([]);
  const [myVouchers, setMyVouchers] = useState([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        if (await AppAsyncStorage.isTokenValid()) {
          const response = await getAllVoucher();
          const response2 = await getMyVouchers();

          if (response) {
            setVouchers(response);
          }
          if (response2) {
            setMyVouchers(response2);
          }
        }
      } catch (error) {
        console.log('Lỗi khi gọi API Voucher:', error);
      }
    };

    fetchVouchers();
  }, []);

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Đổi Bean"
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <Row style={styles.headerRow}>
        <Image
          style={styles.iconBean}
          source={require('../../assets/bean/icon_bean.png')}
        />
        <Column>
          <Text style={styles.headerText}>Số bean hiện tại của bạn</Text>
          <Text style={styles.beanAmount}>
            {user?.seed} <Text style={styles.beanText}>BEAN</Text>
          </Text>
        </Column>
      </Row>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Từ Green Zone</Text>
        <VoucherVertical
          vouchers={vouchers}
          type={2}
          route={{params: {isUpdateOrderInfo: false, isChangeBeans: true}}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray200,
    flex: 1,
  },
  headerRow: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.gray200,
    padding: 16,
  },
  iconBean: {
    width: 48,
    height: 48,
  },
  headerText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  beanAmount: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
    color: colors.black,
  },
  beanText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
    color: colors.gray300,
  },
  section: {
    margin: 16,
    flex: 1,
    gap: 16,
  },
  sectionTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default BeanScreen;
