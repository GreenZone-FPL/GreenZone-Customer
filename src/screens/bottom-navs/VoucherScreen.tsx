// @ts-ignore
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';
import { Icon } from 'react-native-paper';
import { getAllVoucher } from '../../axios';
import {
  AuthContainer,
  BarcodeUser,
  Column,
  LightStatusBar,
  NormalText,
  Row,
  VoucherVertical
} from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContainer, useVoucherContainer } from '../../containers';
import { VoucherGraph } from '../../layouts/graphs';
import { AppAsyncStorage, Toaster } from '../../utils';

const width: number = Dimensions.get('window').width;
const VoucherScreen = ({ navigation }) => {
  const { authState } = useVoucherContainer();
  const { onNavigateLogin } = useAppContainer();

  const [vouchers, setVouchers] = useState([]);
  useEffect(() => {
    const fetchVouchers = async () => {
     
      try {
        if (await AppAsyncStorage.isTokenValid()) {
          const response = await getAllVoucher();
          setVouchers(response);
        }
      } catch (error) {
        console.log('Lỗi khi gọi API Voucher:', error);
      }
    };

    fetchVouchers();
  }, []);
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <LightStatusBar />

      {!authState.lastName ?

        <ImageBackground
          source={require('../../assets/images/bgvoucher.png')}
          resizeMode='stretch'
          style={styles.imageBg}>
       
            <AuthContainer onPress={onNavigateLogin} />
      
        </ImageBackground>
        :

        <ImageBackground
          source={require('../../assets/images/bgvoucher.png')}
          resizeMode="cover"
          style={styles.imageBg}>
          <Column style={{ padding: 16, gap: 16 }}>
            <Pressable
              style={styles.myTicket}
              onPress={() => {
                navigation.navigate(VoucherGraph.MyVouchersScreen)
              }}>
              <Icon
                source="ticket"
                size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                color={colors.primary}
              />
              <Text style={styles.textVoucher}>Phiếu ưu đãi của tôi</Text>
            </Pressable>

            <BarcodeUser
              hasBackground={true}
              showPoints={true}
              style={{ width: Dimensions.get('window').width }}
            />
          </Column>
        </ImageBackground>
      }

      {
        authState.lastName ?
          <Column>
            <Row style={{ margin: 16 }}>
              <Card
                iconName="shield-check"
                color={colors.orange700}
                title="Quyền lợi của bạn"
                onPress={() => { Toaster.show('Tính năng đang phát triển') }}
              />
              <Card iconName="gift" color={colors.primary} title="Đổi thưởng" onPress={() => { navigation.navigate(VoucherGraph.SeedScreen) }} />
            </Row>
            <VoucherVertical vouchers={vouchers} type={1} route={{ params: { isUpdateOrderInfo: false } }} />

          </Column>
          :

          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />

      }

    </ScrollView>
  );
};


const Card = ({ iconName, color, title, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Icon
        source={iconName}
        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        color={color}
      />
      <NormalText text={title} />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: 'column',
    gap: 16,


  },
  imageBg: {
    width: '100%',
    height: width / 1.5,
    justifyContent: 'center'
  },

  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    color: colors.white,
  },

  myTicket: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL,
    paddingVertical: 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
    width: 150,
    alignItems: 'center', justifyContent: 'center'

  },
  textVoucher: {
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    textAlign: 'right'
  },
  logo: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').width / 1.5,
    alignSelf: 'center',
  },

  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'space-between',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 1.5,
  },
});

export default VoucherScreen;