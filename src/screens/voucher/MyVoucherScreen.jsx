import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {LightStatusBar, NormalHeader, CustomTabView} from '../../components';
import {colors, GLOBAL_KEYS, ScreenEnum} from '../../constants';
import {} from '../../constants';

const {width} = Dimensions.get('window');

const MyVoucherScreen = props => {
  const {navigation} = props;
  const [tabIndex, setTabIndex] = useState(0);

  const navigateToVoucherDetail = item => {
    navigation.navigate(ScreenEnum.VoucherDetailSheet, {item});
  };

  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Phiếu ưu đãi của tôi"
        onLeftPress={() => navigation.goBack()}
      />
      <CustomTabView
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        tabBarConfig={{
          titles: ['Giao hàng', 'Tại cửa hàng', 'Mang đi'],
          titleActiveColor: colors.primary,
          titleInActiveColor: colors.gray700,
        }}>
        <Body
          key="delivery"
          data={voucherData.delivery}
          handleGoVoucherDetail={navigateToVoucherDetail}
        />
        <Body
          key="merchant"
          data={voucherData.merchant}
          handleGoVoucherDetail={navigateToVoucherDetail}
        />
        <Body
          key="takeAway"
          data={voucherData.takeAway}
          handleGoVoucherDetail={navigateToVoucherDetail}
        />
      </CustomTabView>
    </View>
  );
};

const Body = ({data, handleGoVoucherDetail}) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.bodyContainer}>
      {data.length > 0 && (
        <Text style={styles.bodyHeader}>Voucher khả dụng</Text>
      )}
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <ItemVoucher
            item={item}
            handleGoVoucherDetail={handleGoVoucherDetail}
          />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  </ScrollView>
);

const ItemVoucher = ({item, handleGoVoucherDetail}) => (
  <TouchableOpacity
    onPress={() => handleGoVoucherDetail(item)}
    style={styles.itemVoucher}>
    <Image source={{uri: item.image}} style={styles.itemImage} />
    <View style={styles.itemDetails}>
      <Text style={styles.itemTitle}>Voucher {item.name}</Text>
      <Text style={styles.itemTime}>Hết hạn {item.time}</Text>
    </View>
  </TouchableOpacity>
);

const voucherData = {
  delivery: [
    {
      id: 1,
      name: 'Voucher Miễn Phí Vận Chuyển, Voucher Miễn Phí Vận Chuyển',
      image:
        'https://promacprinting.com/wp-content/uploads/2019/12/phieu-giam-gia-tra-sua.jpg',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1024px-QR_code_for_mobile_English_Wikipedia.svg.png',
      discountCode: 'FREEDEL2025',
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
      time: '2025-02-15',
    },
    {
      id: 2,
      name: 'Voucher Miễn Phí Vận Chuyển',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1024px-QR_code_for_mobile_English_Wikipedia.svg.png',
      discountCode: 'SHIPFREE2025',
      description: [
        'Chỉ áp dụng cho khách hàng mới.',
        'Giảm phí vận chuyển tối đa 30.000 VNĐ.',
        'Áp dụng cho các đơn hàng giao hàng nội thành.',
        'Không áp dụng cùng các ưu đãi khác.',
        'Thời gian sử dụng: trong vòng 7 ngày kể từ khi nhận voucher.',
        'Hỗ trợ các phương thức thanh toán online.',
        'Không áp dụng vào các ngày lễ.',
      ],
      homepage: 'https://www.example.com/delivery-voucher-2',
      time: '2025-02-15',
    },
  ],
  merchant: [
    {
      id: 17,
      name: 'Voucher Giảm Giá 15%',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnIScARb-Vu_kGsKjpId-oCyaNsvGT0LCnZg&s',
      qrCode:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1024px-QR_code_for_mobile_English_Wikipedia.svg.png',
      discountCode: 'DISCOUNT15',
      description: [
        'Áp dụng cho tất cả các cửa hàng đối tác.',
        'Giảm giá trực tiếp 15% trên tổng hóa đơn.',
        'Không áp dụng cho các sản phẩm giảm giá khác.',
        'Hạn sử dụng: đến hết ngày 25/02/2025.',
        'Không hoàn lại hoặc đổi trả dưới bất kỳ hình thức nào.',
        'Không giới hạn số lượng voucher sử dụng.',
        'Liên hệ nhân viên cửa hàng để hỗ trợ.',
      ],
      homepage: 'https://www.example.com/merchant-voucher-1',
      time: '2025-02-25',
    },
  ],
  takeAway: [],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    paddingVertical: 8,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.white,
  },
  bodyHeader: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    color: colors.black,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  itemVoucher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  itemImage: {
    width: width / 4.5,
    height: width / 4.5,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    resizeMode: 'cover',
  },
  itemDetails: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    gap: 8,
    flex: 1,
  },
  itemTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '600',
    color: colors.black,
  },
  itemTime: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '400',
  },
});

export default MyVoucherScreen;
