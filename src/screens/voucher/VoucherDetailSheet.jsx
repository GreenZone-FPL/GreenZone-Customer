import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text
} from 'react-native';
import { Icon } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { Column, NormalText, OverlayStatusBar, QrCodeVoucher, Row, TitleText } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { TextFormatter } from '../../utils';

const width = Dimensions.get('window').width;

const VoucherDetailSheet = () => {
  const { item } = useRoute().params
  const navigation = useNavigation()

  const copyToClipboard = () => {
    Clipboard.setString(item.code);
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Đã sao chép mã giảm giá',
      visibilityTime: 2000,
      text1Style: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
      },
    });
  };

  return (

    <SafeAreaView style={styles.contentContainer}>
      <OverlayStatusBar />
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.closeButton}>
        <Icon source="close" size={24} color={colors.primary} />
      </Pressable>

      <Column style={{ gap: 16, paddingHorizontal: 16 }}>
        <TitleText text="GreenZone" style={styles.voucherTitle} />
        <Row style={{ alignSelf: 'center' }}>
          <Image source={{ uri: item.image }} style={styles.qrCodeImage} />
          <Text style={styles.voucherName}>{item.name}</Text>
        </Row>



        <QrCodeVoucher voucherCode={item.code} />

        <Text style={styles.discountCode}>{item.code}</Text>

        <Pressable onPress={copyToClipboard}>
          <Text style={styles.copyText}>Sao chép</Text>
        </Pressable>


        <Row >
          <NormalText text="Ngày hết hạn:" />
          <NormalText
            text={TextFormatter.formatDateSimple(item.endDate)}
            style={styles.endDate}
          />
        </Row>
        <Text style={styles.infoText}>{item.description}</Text>
      </Column>

    </SafeAreaView>


  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.overlay,
  },

  closeButton: {
    margin: 16,
    alignSelf: 'flex-start',
    backgroundColor: colors.white
  },
  contentContainer: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignSelf: 'flex-end',
    flex: 1,
  },

  voucherTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.primary,
  },
  infoText: {
    color: colors.gray850,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    lineHeight: 20
  },
  endDate: {
    color: colors.orange700
  },
  voucherName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.black,
  },
  qrCodeImage: {
    width: width / 4.5,
    height: width / 4.5,
    borderRadius: 8,
    resizeMode: "cover"
  },
  discountCode: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.primary
  },
  copyText: {
    fontWeight: '500',
    textAlign: 'center',
    color: colors.blue600,
  },

});

export default VoucherDetailSheet;
