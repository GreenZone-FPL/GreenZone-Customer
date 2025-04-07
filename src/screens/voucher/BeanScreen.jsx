import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {
  Column,
  LightStatusBar,
  NormalHeader,
  Row,
  VoucherVertical,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {getAllVoucher, getProfile} from '../../axios';
import {AppAsyncStorage} from '../../utils';

const BeanScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [changePoint, setChangePoint] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        if (await AppAsyncStorage.isTokenValid()) {
          const response = await getAllVoucher();
          if (response) setVouchers(response);
        }
      } catch (error) {
        console.log('Lỗi khi gọi API Voucher:', error);
      }
    };

    fetchVouchers();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response) setUser(response);
      } catch (error) {
        console.error('Lỗi khi lấy profile:', error);
      }
    };

    fetchProfile();
  }, [changePoint]);

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader title="Đổi Bean" onLeftPress={() => navigation.goBack()} />

      <Row style={styles.headerRow}>
        <Image
          style={styles.iconBean}
          source={require('../../assets/bean/icon_bean.png')}
        />
        <Column>
          <Text style={styles.headerText}>Số bean hiện tại của bạn</Text>
          <Text style={styles.beanAmount}>
            {user?.seed ?? 0} <Text style={styles.beanText}>BEAN</Text>
          </Text>
        </Column>
      </Row>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Từ Green Zone</Text>
        <VoucherVertical
          vouchers={vouchers}
          type={2}
          route={{params: {isUpdateOrderInfo: false, isChangeBeans: true}}}
          setChangePoint={setChangePoint}
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
