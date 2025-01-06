import React from 'react';
import { StyleSheet, Image, SafeAreaView, ImageBackground, Pressable, Alert } from 'react-native';
import { View, Text } from 'react-native';
import LightStatusBar from '../../components/status_bars/LightStatusBar';
import GLOBAL_KEYS from '../../constants/global_keys';
import colors from '../../constants/color';
import { Icon } from 'react-native-paper';


const VoucherScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LightStatusBar />
      <ImageBackground
        source={require('../../assets/images/bgvoucher.png')}
        resizeMode="cover"
        style={styles.imageBg}
      >
        <View style={styles.padding}>
          <Text style={styles.title}>Ưu đãi</Text>
          <View style={styles.content}>
            <Text style={styles.title}>Mới</Text>
            <Pressable style={styles.myTicket}>
              <Icon
                source="ticket-confirmation-outline"
                size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                color={colors.primary}
              />
              <Text style={styles.textVoucher}>Voucher của tôi</Text>
            </Pressable>
          </View>
          <View style={styles.barCode}>
            <Image source={require('../../assets/images/barcode.png')} style={styles.imgcode} />
            <Text>M41352236</Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.paddingBody}>
        <View style={styles.row}>
          <Card
            iconName="crown"
            color={colors.yellow700}
            title="Hạng thành viên"
            onPress={() => alert('Hạng thành viên!')}
          />
          <Card
            iconName="clock-edit"
            color={colors.red800}
            title="Lịch sử mua hàng"
            onPress={() => alert('Lịch sử mua hàng')}
          />
        </View>
        <View style={styles.row}>
          <Card
            iconName="shield-check"
            color={colors.orange700}
            title="Quyền lợi của bạn"
            onPress={() => alert('Quyền lợi của bạn!')}
          />
          <Card
            iconName="gift"
            color={colors.primary}
            title="Đổi thưởng"
            onPress={() => alert('Đổi thưởng!')}
          />
        </View>

        <View style={styles.ticket}>
          <Text style={styles.ticketTitle}>Phiếu ưu đãi của bạn</Text>
          <Pressable style={styles.btnTicket}>
            <Text style={styles.textBtn}>Xem tất cả</Text>
          </Pressable>
        </View>


      </View>
    </SafeAreaView>
  );
};

const Card = ({ iconName, color, title, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Icon source={iconName} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={color} />
      <Text style={styles.cardText}>{title}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: 'column',
  },
  imageBg: {
    overflow: 'hidden',
  },
  padding: {
    flexDirection: 'column',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  paddingBody: {
    flexDirection: 'column',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myTicket: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  textVoucher: {
    color: colors.primary,
  },
  barCode: {
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    marginTop: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center',
  },
  imgcode: {
    width: '100%',
    resizeMode: 'contain'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'space-between',
    shadowColor: colors.gray700,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 3,
  },
  cardText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    color: colors.black,
  },
  ticket: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '900',
    color: colors.gray900,
  },
  btnTicket: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green500,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  textBtn: {
    color: colors.white,
  },
});


export default VoucherScreen;
