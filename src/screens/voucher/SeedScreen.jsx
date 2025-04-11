import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {
  Column,
  LightStatusBar,
  NormalHeader,
  NormalLoading,
  Row,
  VoucherVertical,
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { getAllVoucher, getProfile } from '../../axios';
import { AppAsyncStorage, TextFormatter } from '../../utils';

const SeedScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [changePoint, setChangePoint] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        if (await AppAsyncStorage.isTokenValid()) {
          const response = await getAllVoucher();
          if (response) setVouchers(response);
        }
      } catch (error) {
        console.log('Lỗi khi gọi API Voucher:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const response = await getProfile();
        if (response) setUser(response);
      } catch (error) {
        console.error('Lỗi khi lấy profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [changePoint]);

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalLoading visible={loading} />
      <NormalHeader title="Đổi Seed" onLeftPress={() => navigation.goBack()} />

      <Row style={styles.headerRow}>
        <Image
          style={styles.iconSeed}
          source={require('../../assets/seed/icon_seed.png')}
        />
        <Column>
          <Row style={{ gap: 4 }}>
            <Text style={styles.headerText}>Số</Text>
            <Text style={[styles.headerText, { color: colors.primary, fontWeight: '500' }]}>Seed</Text>
            <Text style={styles.headerText}>của bạn</Text>
          </Row>

          <Text style={styles.beanAmount}>
            {TextFormatter.formatted(user?.seed) || 0}{' '}
          </Text>
        </Column>
      </Row>


      {/* <Text style={styles.sectionTitle}>Từ Green Zone</Text> */}
      <VoucherVertical
        vouchers={vouchers}
        type={2}
        route={{ params: { isUpdateOrderInfo: false, isChangeBeans: true } }}
        setChangePoint={setChangePoint}
      />


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    gap: 16
  },
  headerRow: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.yellow700,
    padding: 8,
    margin: 16
  },
  iconSeed: {
    width: 70,
    height: 70,
    borderRadius: 48,
  },
  headerText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
  },
  beanAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  beanText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
    color: colors.primary,
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

export default SeedScreen;
