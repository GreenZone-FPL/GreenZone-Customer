import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import {colors, GLOBAL_KEYS} from '../../constants';
import {OverlayStatusBar} from '../../components';
import {Icon} from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import {BottomGraph} from '../../layouts/graphs';
import {TextFormatter} from '../../utils';

const width = Dimensions.get('window').width;

const VoucherDetailSheet = ({navigation, route}) => {
  const {item} = route.params || null;
  const [showAlert, setShowAlert] = useState(false);

  const copyToClipboard = () => {
    Clipboard.setString(item.code);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  const handleTermsText = () => {
    Linking.openURL(data.homepage);
  };

  return (
    <View style={styles.container}>
      {showAlert && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>Sao chép thành công</Text>
        </View>
      )}

      <OverlayStatusBar />

      <View style={styles.mainContainer}>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}>
            <Icon
              source="close"
              size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.borderContainer}>
          <ScrollView
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            <View style={styles.voucherInfoContainer}>
              <Text style={styles.voucherTitle}>Green Zone</Text>
              <Text style={styles.voucherName}>{item.name}</Text>

              <View style={styles.separator} />

              <Image source={{uri: item.image}} style={styles.qrCodeImage} />
              <Text style={styles.discountCode}>{item.code}</Text>

              <TouchableOpacity onPress={copyToClipboard}>
                <Text style={styles.copyText}>Sao chép</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.orderButton}
                onPress={() => navigation.navigate(BottomGraph.OrderScreen)}>
                <Text style={styles.orderButtonText}>Bắt đầu đặt hàng</Text>
              </TouchableOpacity>

              <View style={styles.separator} />

              <View style={styles.expiryContainer}>
                <Text style={styles.expiryText}>Ngày hết hạn:</Text>
                <Text style={styles.expiryDate}>
                  {TextFormatter.formatDateSimple(item.endDate)}
                </Text>
              </View>

              <View style={styles.separator} />

              {data?.description.map((desc, index) => (
                <Text style={styles.descriptionText} key={index}>
                  {index + 1}/ <Text>{desc}</Text>
                </Text>
              ))}

              <Text style={styles.termsText}>
                Xem thêm các điều khoản sử dụng dịch vụ tại:
                <TouchableOpacity onPress={handleTermsText}>
                  <Text style={styles.termsLink}>{data.homepage}</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const data = {
  qrCode:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1024px-QR_code_for_mobile_English_Wikipedia.svg.png',
  description: [
    'Áp dụng cho tất cả các đơn hàng giao hàng.',
    'Không giới hạn số lần sử dụng trong ngày.',
    'Chỉ áp dụng với đơn hàng trên 100.000 VNĐ.',
    'Không áp dụng cùng các chương trình khuyến mãi khác.',
    'Chỉ áp dụng tại các cửa hàng liên kết.',
    'Thời gian sử dụng từ 8:00 AM - 10:00 PM.',
    'Liên hệ tổng đài để biết thêm chi tiết.',
  ],
  homepage: 'https://www.example.com/delivery-voucher-1',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  alert: {
    position: 'absolute',
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    opacity: 0.9,
    zIndex: 10,
    width: width,
    alignItems: 'center',
  },
  alertText: {
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  mainContainer: {
    backgroundColor: colors.gray200,
    marginTop: StatusBar.currentHeight + 40,
    borderTopLeftRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderTopRightRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    flex: 1,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
    backgroundColor: colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
  },
  borderContainer: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    flex: 1,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT * 2,
    marginBottom: GLOBAL_KEYS.PADDING_DEFAULT * 2,
    marginTop: GLOBAL_KEYS.PADDING_DEFAULT,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
  },
  voucherInfoContainer: {
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    alignItems: 'center',
  },
  voucherTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.primary,
  },
  voucherName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.gray300,
  },
  qrCodeImage: {
    width: width / 3,
    height: width / 3,
    // backgroundColor: 'green'
  },
  discountCode: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    textAlign: 'center',
  },
  copyText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.blue600,
  },
  orderButton: {
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  orderButtonText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.white,
    padding: GLOBAL_KEYS.PADDING_SMALL,
  },
  expiryContainer: {
    flexDirection: 'row',
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    justifyContent: 'space-between',
    width: '100%',
  },
  expiryText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  expiryDate: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '600',
  },
  descriptionText: {
    width: '100%',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '400',
  },
  termsText: {
    width: '100%',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '400',
    marginTop: GLOBAL_KEYS.PADDING_SMALL,
  },
  termsLink: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '400',
    marginTop: GLOBAL_KEYS.PADDING_SMALL,
    color: colors.blue600,
  },
});

export default VoucherDetailSheet;
