import React, { useState, useEffect } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { AuthButton, Column, LightStatusBar, NormalText, TitleText } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { AppGraph } from '../../layouts/graphs';
import BarcodeBwipjs from '../../components/barcode/BarcodeBwipjs';
import VoucherVertical from '../../components/vouchers/VoucherVertical';
import { AppAsyncStorage } from '../../utils';
import { useAppContext } from '../../context/appContext';

const width = Dimensions.get('window').width;
const VoucherScreen = props => {
  const { navigation } = props;
  const { authState } = useAppContext()
  const [user, setUser] = useState(null)
  console.log('authState', authState)

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.user, null)
        if (response) {
          setUser(response)
        }
      } catch (error) {
        console.log('Error', error)
      }

    }

    getProfile()
  }, [])

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <LightStatusBar />

      <ImageBackground
        source={require('../../assets/images/bgvoucher.png')}
        resizeMode="cover"
        style={styles.imageBg}>
        <View style={styles.column}>

          <Text style={styles.title}>Ưu đãi</Text>

          {authState.lastName && (
            <>

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

              <View style={styles.barCode}>
                <BarcodeBwipjs user={user} hasBackground={false} />
              </View>
            </>

          )}
        </View>
      </ImageBackground>
      {
        !authState.lastName &&
        <AuthButton title='Đăng nhập' style={{ marginVertical: 16 }} />
      }

    

      <View style={styles.column}>

        <View style={styles.row}>
          <Card
            iconName="shield-check"
            color={colors.orange700}
            title="Quyền lợi của bạn"
          // onPress={() => alert('Quyền lợi của bạn!')}
          />
          <Card
            iconName="gift"
            color={colors.primary}
            title="Đổi thưởng"
          // onPress={() => alert('Đổi thưởng!')}
          />
        </View>
        <View style={styles.row}>
          <Card
            iconName="clock-edit"
            color={colors.red800}
            title="Lịch sử đổi Bean"
          // onPress={() => alert('Lịch sử đổi Bean')}
          />
        </View>


      </View>



      {
        authState.lastName &&
        <Column style={{ marginHorizontal: 16 }} >
          <TitleText text='Phiếu ưu đãi' />

          <VoucherVertical
            navigation={navigation}
            route={{ params: { isUpdateOrderInfo: false } }}
          />
        </Column>
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
  },
  column: {
    flexDirection: 'column',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
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
    width: 150
  },
  textVoucher: {
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  barCode: {
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignItems: 'center',
    backgroundColor: colors.white,
    width: width - 32,
  },
  imgcode: {
    width: '100%',
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
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
  cardText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },




});

export default VoucherScreen;
