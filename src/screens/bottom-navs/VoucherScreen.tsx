// @ts-ignore
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {
  AuthButton,
  BarcodeUser,
  Column,
  LightStatusBar,
  NormalText,
  Row,
  TitleText,
  VoucherVertical,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {useAppContainer, useVoucherContainer} from '../../containers';
import { View } from 'react-native-animatable';

const width: number = Dimensions.get('window').width;
const VoucherScreen: React.FC = () => {
  const {authState, user} = useVoucherContainer();
    const {onNavigateLogin} = useAppContainer();
  

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <LightStatusBar />

      <ImageBackground
        source={require('../../assets/images/bgvoucher.png')}
        resizeMode="cover"
        style={styles.imageBg}>
        <Column style={{padding: 16, gap: 16}}>
          <Text style={styles.title}>Ưu đãi</Text>
         <View style={{justifyContent:'center',alignItems:'center', height:"80%"}}>
         {!authState.lastName && (
            <AuthButton title="Đăng nhập" onPress={onNavigateLogin} />
      )}
         </View>
          {authState.lastName && (
            // eslint-disable-next-line react-native/no-inline-styles
            <Column style={{gap: 16}}>
              <Pressable
                style={styles.myTicket}
                onPress={() => {
                  // navigation.navigate(VoucherGraph.MyVouchersScreen)
                }}>
                <Icon
                  source="ticket-confirmation-outline"
                  size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                  color={colors.primary}
                />
                <Text style={styles.textVoucher}>Voucher của tôi</Text>
              </Pressable>

              <BarcodeUser
                user={user}
                hasBackground={false}
                style={{width: Dimensions.get('window').width}}
              />
            </Column>
          )}
        </Column>
      </ImageBackground>


      <Row style={{margin: 16}}>
        <Card
          iconName="shield-check"
          color={colors.orange700}
          title="Quyền lợi của bạn"
          onPress={{}}
        />
        <Card iconName="gift" color={colors.primary} title="Đổi thưởng" onPress={{}} />
      </Row>

      {authState.lastName && (
        <Column style={{marginHorizontal: 16}}>
          <TitleText text="Phiếu ưu đãi" />

          <VoucherVertical route={{params: {isUpdateOrderInfo: false}}} />
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
  },

  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    color: colors.white,
  },

  myTicket: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL,
    paddingVertical: 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
    width: 150,
  },
  textVoucher: {
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },

  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'space-between',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 1.5,
  },
});

export default VoucherScreen;
