import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';
import { Icon } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { Column, LightStatusBar, NormalText, Row, TitleText } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { TextFormatter } from '../../utils';
import { useNavigation, useRoute } from '@react-navigation/native';

const width = Dimensions.get('window').width;

const VoucherDetailSheet = () => {
  const { item } = useRoute().params
  const navigation = useNavigation()

  const copyToClipboard = () => {
    Clipboard.setString(item.code);
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Đã sao chép mã đơn hàng!',
      visibilityTime: 2000,
      text1Style: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
      },
    });
  };

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={styles.container}>

      <LightStatusBar />
      <Pressable onPress={() => { }} style={styles.contentContainer}>
        <ScrollView>

          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Icon source="close" size={24} color={colors.primary} />
          </Pressable>

          <Column>
            <TitleText text='GreenZone' style={styles.voucherTitle} />
            <Text style={styles.voucherName}>{item.name}</Text>

            <Image source={{ uri: item.image }} style={styles.qrCodeImage} />

            <Text style={styles.discountCode}>{item.code}</Text>

            <Pressable onPress={copyToClipboard}>
              <Text style={styles.copyText}>Sao chép</Text>
            </Pressable>

          </Column>

          <Row style={styles.expiryContainer}>
            <NormalText text='Ngày hết hạn:' />
            <NormalText text={TextFormatter.formatDateSimple(item.endDate)} style={styles.endDate} />
          </Row>


          <Column >
            {data?.description.map((desc, index) => (
              <NormalText key={index} text={`${index + 1}. ${desc}`} style={styles.infoText} />
            ))}
          </Column>
        </ScrollView>
      </Pressable>

    </Pressable>
  );
};

const data = {
  qrCode:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1024px-QR_code_for_mobile_English_Wikipedia.svg.png',
  description: [
    'Áp dụng cho tất cả các đơn hàng.',
    'Không giới hạn số lần sử dụng trong ngày.',
    'Không áp dụng cùng các khuyến mãi khác.',
    'Chỉ áp dụng tại các cửa hàng liên kết.',
    'Thời gian sử dụng từ 8:00 AM - 10:00 PM.',
    'Liên hệ tổng đài để biết thêm chi tiết.',
  ]
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.overlay,
  },

  closeButton: {
    marginVertical: 16,
    marginHorizontal: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.white
  },
  contentContainer: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    width: Dimensions.get('window').width * 0.85,
    alignSelf: 'flex-end',
    flex: 1
  },

  voucherTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.primary,
  },
  infoText: {
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    backgroundColor: colors.transparent,
    color: colors.gray850
  },
  endDate: {
    color: colors.orange700
  },
  voucherName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.black,
  },
  qrCodeImage: {
    width: width / 3,
    height: width / 3,
    borderRadius: 8,
    alignSelf: 'center'
  },
  discountCode: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.lemon
  },
  copyText: {
    fontWeight: '500',
    textAlign: 'center',
    color: colors.blue600,
  },
  expiryContainer: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginBottom: 8
  }
});

export default VoucherDetailSheet;
