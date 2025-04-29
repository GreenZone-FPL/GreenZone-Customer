// @ts-ignore
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {getAllVoucher, getProfile} from '../../axios';
import {
  AuthContainer,
  BarcodeUser,
  Column,
  LightStatusBar,
  NormalText,
  Row,
  VoucherVertical,
} from '../../components';
import {colors, GLOBAL_KEYS, OrderStatus} from '../../constants';
import {useAuthActions} from '../../containers';
import {useAuthContext} from '../../context';
import {useAppContext} from '../../context/appContext';
import {VoucherGraph} from '../../layouts/graphs';
import {SectionLoader, SkeletonBox} from '../../skeletons';
import {Toaster} from '../../utils';

const width: number = Dimensions.get('window').width;
const VoucherScreen = ({navigation}) => {
  const {authState} = useAuthContext();
  const {onNavigateLogin} = useAuthActions();
  const {updateOrderMessage, setUser} = useAppContext();

  const [vouchers, setVouchers] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  const fetchProfile = async (enableLoading: boolean) => {
    try {
      if (enableLoading) {
        setLoadingProfile(true);
      }
      if (authState.lastName) {
        const response: any = await getProfile();

        if (response) {
          setUser(response);
        }
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      if (enableLoading) {
        setLoadingProfile(false);
      }
    }
  };

  useEffect(() => {
    // Sau khi hoàn thành đơn hàng, nhận socket và cập nhật lại UI
    // load lần sau, không cần loading
    if (updateOrderMessage.status === OrderStatus.COMPLETED.value) {
      fetchProfile(false);
    }
  }, [updateOrderMessage.status]);

  useEffect(() => {
    fetchProfile(true);
  }, []);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        if (authState.lastName) {
          setLoadingVouchers(true);
          const response = await getAllVoucher();
          setVouchers(response);
        }
      } catch (error) {
        console.log('Lỗi khi gọi API Voucher:', error);
      } finally {
        setLoadingVouchers(false);
      }
    };

    fetchVouchers();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <LightStatusBar />

      {!authState.lastName ? (
        <ImageBackground
          source={require('../../assets/images/bgvoucher.png')}
          resizeMode="stretch"
          style={styles.imageBg}>
          <AuthContainer onPress={onNavigateLogin} />
        </ImageBackground>
      ) : (
        <SectionLoader
          loading={loadingProfile}
          skeleton={<SkeletonBox width="100%" height={260} borderRadius={2} />}>
          <ImageBackground
            source={require('../../assets/images/bgvoucher.png')}
            resizeMode="cover"
            style={styles.imageBg}>
            <Column style={{padding: 16, gap: 16}}>
              <Pressable
                style={styles.myTicket}
                onPress={() => {
                  navigation.navigate(VoucherGraph.MyVouchersScreen);
                }}>
                <Icon
                  source="ticket"
                  size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                  color={colors.primary}
                />
                <NormalText
                  style={styles.textVoucher}
                  text="Phiếu ưu đãi của tôi"
                />
              </Pressable>

              <BarcodeUser
                hasBackground={true}
                showPoints={true}
                style={{width: Dimensions.get('window').width}}
              />
            </Column>
          </ImageBackground>
        </SectionLoader>
      )}

      {authState.lastName ? (
        <Column>
          <SectionLoader
            loading={loadingVouchers}
            skeleton={
              <Row style={{marginVertical: 8, alignSelf: 'center'}}>
                <SkeletonBox width="45%" height={90} borderRadius={8} />
                <SkeletonBox width="45%" height={90} borderRadius={8} />
              </Row>
            }>
            <Row style={{margin: 16}}>
              <Card
                iconName="shield-check"
                color={colors.orange700}
                title="Quyền lợi của bạn"
                onPress={() => {
                  Toaster.show('Tính năng đang phát triển');
                }}
              />
              <Card
                iconName="gift"
                color={colors.primary}
                title="Đổi thưởng"
                onPress={() => {
                  navigation.navigate(VoucherGraph.SeedScreen);
                }}
              />
            </Row>
          </SectionLoader>
          <VoucherVertical
            loading={loadingVouchers}
            vouchers={vouchers}
            type={1}
            route={{params: {isUpdateOrderInfo: false}}}
          />
        </Column>
      ) : (
        <Column style={styles.emptyView}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
          <NormalText
            style={styles.description}
            text={`Đăng nhập để xem những ưu đãi cho thành viên bạn nhé`}
          />
        </Column>
      )}
    </ScrollView>
  );
};

const Card = ({iconName, color, title, onPress}) => {
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
    justifyContent: 'center',
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
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textVoucher: {
    color: colors.primary,
  },
  logo: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
    alignSelf: 'center',
  },

  card: {
    flex: 1,
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 10,
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
  },
  emptyView: {
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 16,
  },
});

export default VoucherScreen;
