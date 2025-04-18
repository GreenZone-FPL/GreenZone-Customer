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
        
        <Column >
          <Text style={styles.headerText}>Số seed của bạn</Text>

          <Text style={styles.beanAmount}>
            {TextFormatter.formatted(user?.seed) || 0}{' '}
            <Text style={[styles.beanAmount, { color: colors.gray700, fontSize: 14 }]}>
              seed
            </Text>
          </Text>
        </Column>

        
      </Row>

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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    gap: 16,
    marginBottom: 16,
  },
  iconSeed: {
    width: 70,
    height: 70,
    borderRadius: 48,
  },
  headerText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
     color: colors.black,
  },
  beanAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.orange700,
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
