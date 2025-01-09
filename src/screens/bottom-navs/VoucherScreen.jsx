import React from 'react';
import { Image, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Icon } from 'react-native-paper';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';


const VoucherScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <LightStatusBar />
      <ImageBackground
        source={require('../../assets/images/bgvoucher.png')}
        resizeMode="cover"
        style={styles.imageBg}
      >
        <View style={styles.column}>
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
            <Text style={styles.code}>M41352236</Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.column}>
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
    </ScrollView>
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
    gap: 16
  },
  imageBg: {
    width: '100%',
    height: 360
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
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myTicket: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL,
    paddingVertical: 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  textVoucher: {
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
  },
  barCode: {
    backgroundColor: colors.white,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: 6,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignItems: 'center',
  },
  imgcode: {
    width: '100%',
    resizeMode: 'contain'
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
    elevation: 4,
  },
  cardText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  ticket: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    color: colors.black,
  },
  btnTicket: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingVertical: 6,

  },
  textBtn: {
    color: colors.white,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
  },
  code: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    color: colors.black
  }
});


export default VoucherScreen;
