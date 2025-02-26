import React, {useEffect, useState} from 'react';
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
import {colors, GLOBAL_KEYS} from '../../constants';
import {AppGraph, VoucherGraph} from '../../layouts/graphs';
import {getAllVoucher} from '../../axios/index';
import {TextFormatter} from '../../utils';

const {width} = Dimensions.get('window');

const MyVoucherScreen = props => {
  const {navigation} = props;
  const [tabIndex, setTabIndex] = useState(0);

  const [vouchers, setVouchers] = useState([]);

  const fetchVouchers = async () => {
    try {
      const response = await getAllVoucher();
      setVouchers(response);
    } catch (error) {
      console.log('Lỗi khi gọi API Voucher:', error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const navigateToVoucherDetail = item => {
    navigation.navigate(VoucherGraph.VoucherDetailSheet, {item});
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
          data={vouchers}
          handleGoVoucherDetail={navigateToVoucherDetail}
        />
        <Body
          key="merchant"
          data={vouchers}
          handleGoVoucherDetail={navigateToVoucherDetail}
        />
        <Body
          key="takeAway"
          data={vouchers}
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
        keyExtractor={item => item._id.toString()}
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

const ItemVoucher = ({item, handleGoVoucherDetail}) => {
  console.log(item);
  return (
    <TouchableOpacity
      onPress={() => handleGoVoucherDetail(item)}
      style={styles.itemVoucher}>
      <Image source={{uri: item.image}} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>Voucher {item.name}</Text>
        <Text style={styles.itemTime}>
          Hết hạn {TextFormatter.formatDateSimple(item.endDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabView: {
    backgroundColor: colors.white,
  },
  tabBar: {
    backgroundColor: colors.white,
  },
  indicatorStyle: {
    backgroundColor: colors.primary,
  },
  labelStyle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '700',
    color: colors.black,
  },
  activeLabelStyle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '700',
    color: colors.primary,
  },
  inactiveLabelStyle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '700',
    color: colors.black,
  },
  bodyContainer: {
    paddingVertical: 8,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.white,
  },
  bodyHeader: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
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
